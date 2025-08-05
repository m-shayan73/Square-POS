import type { Category, Discount, Item, SearchFilters, Tax } from "@/types";
import type {
  CalculateOrderParams,
  OrderCalculationResult,
} from "@/types/services";

export interface IPosService {
  listItems(): Promise<Item[]>;
  searchItems(filters: SearchFilters): Promise<Item[]>;
  listDiscounts(): Promise<Discount[]>;
  listTaxes(): Promise<Tax[]>;
  listCategories(): Promise<Category[]>;
  calculateOrder(params: CalculateOrderParams): Promise<OrderCalculationResult>;
}
