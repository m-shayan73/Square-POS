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

export interface Category {
  id: string;
  name: string;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  sortBy?: "default" | "name" | "price";
  sortOrder?: "ASC" | "DESC";
}

export interface Image {
  id: string;
  url: string;
  name: string;
};
