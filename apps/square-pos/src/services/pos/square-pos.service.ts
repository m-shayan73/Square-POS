import { getSquareClient } from "@/services/clients/square-client";
import type {
  CalculateOrderParams,
  Category,
  Discount,
  Image,
  Item,
  ItemVariation,
  OrderCalculationResult,
  SearchFilters,
  Tax,
} from "@/types";
import type { Square } from "square";
import type { IPosService } from "./pos.interface";

type ImageMap = Record<string, { name: string; url: string }>;

export class SquarePosService implements IPosService {
  private squareClient;
  private locationId: string;

  constructor(token: string, locationId: string) {
    this.squareClient = getSquareClient(token);
    this.locationId = locationId;
  }

  async listItems(): Promise<Item[]> {
    return this.searchItems({});
  }

  async searchItems(filters: SearchFilters): Promise<Item[]> {
    const query = this.buildSearchQuery(filters);

    const request: Square.SearchCatalogObjectsRequest = {
      includeRelatedObjects: true,
      includeDeletedObjects: false,
      objectTypes: ["ITEM"],
      ...(Object.keys(query).length > 0 ? { query } : {}),
    };

    const data = await this.squareClient.catalog.search(request);

    if (!data.objects || data.objects.length === 0) {
      return [];
    }

    const items: Item[] = [];
    const imageMap: Record<string, { name: string; url: string }> = {};

    data.relatedObjects?.forEach((object) => {
      if (
        object.type !== "IMAGE" ||
        !object.imageData ||
        !object.imageData.url
      ) {
        return;
      }
      imageMap[object.id] = {
        name: object.imageData.name || "Unnamed Image",
        url: object.imageData.url,
      };
    });

    items.push(
      ...data.objects.map((obj) => this.catalogObjectToItem(obj, imageMap))
    );

    return items;
  }

  async listDiscounts(): Promise<Discount[]> {
    const discounts = await this.listCatalogObjects(["DISCOUNT"]);

    return discounts.map((obj) => this.catalogObjectToDiscount(obj));
  }

  async listTaxes(): Promise<Tax[]> {
    const taxes = await this.listCatalogObjects(["TAX"]);

    return taxes.map((obj) => this.catalogObjectToTax(obj));
  }

  async listCategories(): Promise<Category[]> {
    const categories = await this.listCatalogObjects(["CATEGORY"]);
    const transformedCategories = categories.map((obj) =>
      this.catalogObjectToCategory(obj)
    );
    transformedCategories.unshift({
      id: "all",
      name: "All Items",
    });
    return transformedCategories;
  }

  async calculateOrder(
    params: CalculateOrderParams
  ): Promise<OrderCalculationResult> {
    // Build the discounts and taxes for the order
    function buildScopeMap<T extends { id: string }>(
      globalIds: string[] | undefined,
      items: Array<{ discountsApplied?: T[]; taxesApplied?: T[] }>,
      appliedKey: "discountsApplied" | "taxesApplied"
    ): Map<string, "ORDER" | "LINE_ITEM"> {
      const scopeMap = new Map<string, "ORDER" | "LINE_ITEM">();
      const globals = globalIds || [];
      globals.forEach((id) => {
        scopeMap.set(id, "ORDER");
      });
      items.forEach((item) => {
        item[appliedKey]?.forEach((applied) => {
          if (!scopeMap.has(applied.id)) {
            scopeMap.set(applied.id, "LINE_ITEM");
          }
        });
      });
      return scopeMap;
    }

    const discountScopeMap = buildScopeMap(
      params.globalDiscounts,
      params.items,
      "discountsApplied"
    );
    const taxScopeMap = buildScopeMap(
      params.globalTaxes,
      params.items,
      "taxesApplied"
    );

    const allAppliedDiscounts: Square.OrderLineItemDiscount[] = Array.from(
      discountScopeMap.entries()
    ).map(([id, scope]) => ({
      catalogObjectId: id,
      uid: id,
      scope,
    }));

    const allAppliedTaxes: Square.OrderLineItemTax[] = Array.from(
      taxScopeMap.entries()
    ).map(([id, scope]) => ({
      catalogObjectId: id,
      uid: id,
      scope,
    }));

    // Build line items for Square order
    const lineItems = params.items.map((item) => {
      const appliedDiscounts = (item.discountsApplied || [])
        .filter((discount) => discountScopeMap.get(discount.id) === "LINE_ITEM")
        .map((discount) => ({ discountUid: discount.id }));

      const appliedTaxes = (item.taxesApplied || [])
        .filter((tax) => taxScopeMap.get(tax.id) === "LINE_ITEM")
        .map((tax) => ({ taxUid: tax.id }));

      return {
        catalogObjectId: item.variationId,
        quantity: item.quantity.toString(),
        ...(appliedDiscounts.length > 0 && { appliedDiscounts }),
        ...(appliedTaxes.length > 0 && { appliedTaxes }),
      };
    });

    const orderRequest: Square.CalculateOrderRequest = {
      order: {
        locationId: this.locationId,
        discounts: allAppliedDiscounts,
        taxes: allAppliedTaxes,
        lineItems,
      },
    };

    const response = await this.squareClient.orders.calculate(orderRequest);

    if (response.errors) {
      throw new Error(
        `Square API Error: ${response.errors.map((e) => e.detail).join(", ")}`
      );
    }

    const order = response.order;

    const totalTax = (Number(order?.totalTaxMoney?.amount) || 0) / 100;
    const totalDiscount =
      (Number(order?.totalDiscountMoney?.amount) || 0) / 100;
    const netTotal = (Number(order?.totalMoney?.amount) || 0) / 100;
    const subtotal = netTotal - totalTax + totalDiscount;
    const currency = order?.totalMoney?.currency || "USD";

    return {
      subtotal,
      totalTax,
      totalDiscount,
      netTotal,
      currency,
    };
  }

  // Helpers
  private listCatalogObjects(types: string[]): Promise<Square.CatalogObject[]> {
    return this.squareClient.catalog
      .list({
        types: types.join(","),
      })
      .then((response) => response.data || []);
  }

  private buildSearchQuery(filters: SearchFilters): Square.CatalogQuery {
    const { search, category, sortBy, sortOrder } =
      filters || {};

    const isSearchApplied = search && search.trim().length > 1;
    const isCategoryApplied = category && category.trim() !== "all";
    const isSortApplied = sortBy !== undefined && sortOrder !== undefined;

    const query: Square.CatalogQuery = {};

    // Add text filtering if provided
    if (isSearchApplied) {
      query.textQuery = {
        keywords: [search],
      };
    }

    // Add category filtering if provided
    if (isCategoryApplied) {
      query.exactQuery = {
        attributeName: "category",
        attributeValue: category,
      };
    }

    // Add sorting if provided
    if (isSortApplied) {
      query.sortedAttributeQuery = {
        attributeName: sortBy,
        sortOrder: sortOrder,
      };
    }

    return query;
  }

  // Transformation methods to convert square objects to self defined objects
  private catalogObjectToItem(
    obj: Square.CatalogObject,
    imageMap: ImageMap
  ): Item {
    if (obj.type !== "ITEM" || !obj.itemData) {
      throw new Error("Invalid ITEM object");
    }
    return {
      id: obj.id,
      name: obj.itemData.name || "Unnamed Item",
      description: obj.itemData.description || "No description available",
      images: this.imageIdsToImages(obj.itemData.imageIds || [], imageMap),
      variations: (obj.itemData.variations || []).map((v) =>
        this.catalogObjectToItemVariation(v, imageMap)
      ),
    };
  }

  private catalogObjectToItemVariation(
    obj: Square.CatalogObject,
    imageMap: ImageMap
  ): ItemVariation {
    if (obj.type !== "ITEM_VARIATION" || !obj.itemVariationData) {
      throw new Error("Invalid ITEM_VARIATION object");
    }
    return {
      id: obj.id,
      name: obj.itemVariationData.name || "Unnamed Variation",
      price: {
        amount:
          obj.itemVariationData.priceMoney?.amount !== undefined
            ? Number(obj.itemVariationData.priceMoney.amount) / 100
            : 0,
        currency: obj.itemVariationData.priceMoney?.currency || "USD",
      },
      images: this.imageIdsToImages(
        obj.itemVariationData.imageIds || [],
        imageMap
      ),
    };
  }

  private catalogObjectToDiscount(obj: Square.CatalogObject): Discount {
    if (obj.type !== "DISCOUNT" || !obj.discountData) {
      throw new Error("Invalid DISCOUNT object");
    }

    const discountData = obj.discountData;

    return {
      id: obj.id,
      name: discountData.name || "Unnamed Discount",
    };
  }

  private catalogObjectToTax(obj: Square.CatalogObject): Tax {
    if (obj.type !== "TAX" || !obj.taxData) {
      throw new Error("Invalid TAX object");
    }

    const taxData = obj.taxData;

    return {
      id: obj.id,
      name: taxData.name || "Unnamed Tax",
    };
  }

  private catalogObjectToCategory(obj: Square.CatalogObject): Category {
    if (obj.type !== "CATEGORY" || !obj.categoryData) {
      throw new Error("Invalid CATEGORY object");
    }
    return {
      id: obj.id || "",
      name: obj.categoryData.name || "Unnamed Category",
    };
  }

  private imageIdsToImages(imageIds: string[], imageMap: ImageMap): Image[] {
    return imageIds
      .map((id) => {
        const image = imageMap[id];
        if (image) {
          return { id, ...image };
        }
        return undefined;
      })
      .filter((image): image is Image => image !== undefined);
  }
}
