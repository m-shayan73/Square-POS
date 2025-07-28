export interface Item {
  id: string;
  name: string;
  description?: string;
  images?: Image[];
  variations?: ItemVariation[];
}

export interface ItemVariation {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  images?: Image[];
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "default" | "name" | "price";
  sortOrder?: "ASC" | "DESC";
}

export type Image = {
  id: string;
  url: string;
  name: string;
};
