import type { Category } from "./category";

export interface ProductImage {
  url: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
  image: ProductImage | null;
  category: Category | null;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: ProductImage | null;
  quantity: number;
}

export interface ProductPage {
  products: Product[];
  hasMore: boolean;
  page: number;
}
