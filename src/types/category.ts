export interface CategoryImage {
  url: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: CategoryImage | null;
}
