import { getSquareClient } from '@/shared/services/clients/square-client'
import { ImageMap } from '@/shared/types/product'
import type { Square } from 'square'
import type {
  IPosService,
  Item,
  ItemVariation,
  Discount,
  Tax,
  SearchParams,
  CalculateOrderParams,
  OrderCalculationResult,
} from './pos.interface'

export class SquarePosService implements IPosService {
  private squareClient
  private locationId: string

  constructor(token: string, locationId: string) {
    this.squareClient = getSquareClient(token)
    this.locationId = locationId
  }

  async listItems(): Promise<Item[]> {
    return this.searchItems({})
  }

  async searchItems(params: SearchParams): Promise<Item[]> {
    const { search, filters } = params
    const { minPrice, maxPrice, sortBy, sortOrder } = filters || {}

    const isSearchApplied = search && search.trim() !== ''
    const isPriceFilterApplied = minPrice !== undefined || maxPrice !== undefined
    const isSortApplied = sortBy !== undefined && sortOrder !== undefined

    function buildSearchQuery(): Square.CatalogQuery {
      const query: Square.CatalogQuery = {}

      // Add text filtering if provided
      if (isSearchApplied) {
        query.textQuery = {
          keywords: [search],
        }
      }

      // Add price filtering if provided
      if (isPriceFilterApplied) {
        query.rangeQuery = {
          attributeName: 'price',

          ...(minPrice !== undefined
            ? { attributeMinValue: BigInt(minPrice * 100) }
            : maxPrice !== undefined
              ? { attribute_min_value: 0 }
              : {}),

          ...(maxPrice !== undefined
            ? { attributeMaxValue: BigInt(maxPrice * 100) }
            : minPrice !== undefined
              ? { attributeMaxValue: BigInt(Number.MAX_SAFE_INTEGER) }
              : {}),
        }
      }

      // Add sorting if provided
      if (isSortApplied) {
        query.sortedAttributeQuery = {
          attributeName: sortBy,
          sortOrder: sortOrder,
        }
      }

      return query
    }

    const query = buildSearchQuery()

    const request: Square.SearchCatalogObjectsRequest = {
      includeRelatedObjects: true,
      includeDeletedObjects: false,
      objectTypes: isPriceFilterApplied ? ['ITEM_VARIATION'] : ['ITEM'],
      ...(Object.keys(query).length > 0 ? { query } : {}),
    }

    const data = await this.squareClient.catalog.search(request)

    if (!data.objects || data.objects.length === 0) {
      return []
    }

    // images.forEach((image) => {
    //   if (image.type === 'IMAGE' && image.imageData) {
    //     this.imageMap.set(image.id, {
    //       url: image.imageData.url,
    //       name: image.imageData.name || 'Unnamed Image',
    //     })
    //   }
    // }

    const items: Item[] = []

    if (isPriceFilterApplied) {
      // Build items from related objects as price filtering is applied on item variations and we need items to display on UI
      data.relatedObjects?.forEach((item) => {
        if (item.type === 'ITEM' && item.itemData) {
          const itemId = item.id

          // Filter variations by price
          const filteredVariations = item.itemData.variations?.filter((variation) => {
            if (variation.type !== 'ITEM_VARIATION' || !variation.itemVariationData) {
              return false
            }
            const variationData = variation.itemVariationData
            const amount = variationData.priceMoney?.amount || 0
            return (
              amount >= (minPrice ? minPrice * 100 : 0) &&
              amount <= (maxPrice ? maxPrice * 100 : Number.MAX_SAFE_INTEGER)
            )
          })

          if (!filteredVariations || filteredVariations.length === 0) return

          // Create item with filtered variations
          const newItem = this.catalogObjectToItem(item)

          items.push(newItem)
        }
      })
    } else {
      items.push(...data.objects.map((obj) => this.catalogObjectToItem(obj)))
    }

    return items
  }

  async listDiscounts(): Promise<Discount[]> {
    const discounts = await this.listCatalogObjects(['DISCOUNT'])

    return discounts.map((obj) => this.catalogObjectToDiscount(obj))
  }

  async listTaxes(): Promise<Tax[]> {
    const taxes = await this.listCatalogObjects(['TAX'])

    return taxes.map((obj) => this.catalogObjectToTax(obj))
  }

  async calculateOrder(params: CalculateOrderParams): Promise<OrderCalculationResult> {
    // Build the discounts and taxes for the order
    function buildScopeMap<T extends { id: string }>(
      globalIds: string[] | undefined,
      items: Array<{ discountsApplied?: T[]; taxesApplied?: T[] }>,
      appliedKey: 'discountsApplied' | 'taxesApplied',
    ): Map<string, 'ORDER' | 'LINE_ITEM'> {
      const scopeMap = new Map<string, 'ORDER' | 'LINE_ITEM'>()
      const globals = globalIds || []
      globals.forEach((id) => {
        scopeMap.set(id, 'ORDER')
      })
      items.forEach((item) => {
        item[appliedKey]?.forEach((applied) => {
          if (!scopeMap.has(applied.id)) {
            scopeMap.set(applied.id, 'LINE_ITEM')
          }
        })
      })
      return scopeMap
    }

    const discountScopeMap = buildScopeMap(params.globalDiscounts, params.items, 'discountsApplied')
    const taxScopeMap = buildScopeMap(params.globalTaxes, params.items, 'taxesApplied')

    const allAppliedDiscounts: Square.OrderLineItemDiscount[] = Array.from(
      discountScopeMap.entries(),
    ).map(([id, scope]) => ({
      catalogObjectId: id,
      uid: id,
      scope,
    }))

    const allAppliedTaxes: Square.OrderLineItemTax[] = Array.from(taxScopeMap.entries()).map(
      ([id, scope]) => ({
        catalogObjectId: id,
        uid: id,
        scope,
      }),
    )

    // Build line items for Square order
    const lineItems = params.items.map((item) => {
      const appliedDiscounts = (item.discountsApplied || [])
        .filter((discount) => discountScopeMap.get(discount.id) === 'LINE_ITEM')
        .map((discount) => ({ discountUid: discount.id }))

      const appliedTaxes = (item.taxesApplied || [])
        .filter((tax) => taxScopeMap.get(tax.id) === 'LINE_ITEM')
        .map((tax) => ({ taxUid: tax.id }))

      return {
        catalogObjectId: item.variationId,
        quantity: item.quantity.toString(),
        ...(appliedDiscounts.length > 0 && { appliedDiscounts }),
        ...(appliedTaxes.length > 0 && { appliedTaxes }),
      }
    })

    const orderRequest: Square.CalculateOrderRequest = {
      order: {
        locationId: this.locationId,
        discounts: allAppliedDiscounts,
        taxes: allAppliedTaxes,
        lineItems,
      },
    }

    const response = await this.squareClient.orders.calculate(orderRequest)

    if (response.errors) {
      throw new Error(`Square API Error: ${response.errors.map((e) => e.detail).join(', ')}`)
    }

    const order = response.order

    const totalTax = (Number(order?.totalTaxMoney?.amount) || 0) / 100
    const totalDiscount = (Number(order?.totalDiscountMoney?.amount) || 0) / 100
    const netTotal = (Number(order?.totalMoney?.amount) || 0) / 100
    const subtotal = netTotal - totalTax + totalDiscount
    const currency = order?.totalMoney?.currency || 'USD'

    return {
      subtotal,
      totalTax,
      totalDiscount,
      netTotal,
      currency,
    }
  }

  // Helpers
  private listCatalogObjects(types: string[]): Promise<Square.CatalogObject[]> {
    return this.squareClient.catalog
      .list({
        types: types.join(','),
      })
      .then((response) => response.data || [])
  }

  // Transformation methods to convert square objects to self defined objects
  private catalogObjectToItem(obj: Square.CatalogObject): Item {
    if (obj.type !== 'ITEM' || !obj.itemData) {
      throw new Error('Invalid ITEM object')
    }
    return {
      id: obj.id,
      name: obj.itemData.name || 'Unnamed Item',
      description: obj.itemData.description || 'No description available',
      images: obj.itemData.imageIds || [],
      variations: (obj.itemData.variations || []).map((v) => this.catalogObjectToItemVariation(v)),
    }
  }

  private catalogObjectToItemVariation(obj: Square.CatalogObject): ItemVariation {
    if (obj.type !== 'ITEM_VARIATION' || !obj.itemVariationData) {
      throw new Error('Invalid ITEM_VARIATION object')
    }
    return {
      id: obj.id,
      name: obj.itemVariationData.name || 'Unnamed Variation',
      price: {
        amount:
          obj.itemVariationData.priceMoney?.amount !== undefined
            ? Number(obj.itemVariationData.priceMoney.amount) / 100
            : 0,
        currency: obj.itemVariationData.priceMoney?.currency || 'USD',
      },
      images: obj.itemVariationData.imageIds || [],
    }
  }

  private catalogObjectToDiscount(obj: Square.CatalogObject): Discount {
    if (obj.type !== 'DISCOUNT' || !obj.discountData) {
      throw new Error('Invalid DISCOUNT object')
    }

    const discountData = obj.discountData

    return {
      id: obj.id,
      name: discountData.name || 'Unnamed Discount',
    }
  }

  private catalogObjectToTax(obj: Square.CatalogObject): Tax {
    if (obj.type !== 'TAX' || !obj.taxData) {
      throw new Error('Invalid TAX object')
    }

    const taxData = obj.taxData

    return {
      id: obj.id,
      name: taxData.name || 'Unnamed Tax',
    }
  }
}
