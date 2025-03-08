export interface ProductType {
  id?: string | null;
  name: string;
  price: number;
  description: string;
  quantity: number;
  categoryId: string;
  productImages: ProductImage[];
}

export interface ProductImage {
  imageUrl: string;
}

export interface CategoryType {
  id?: string | null;
  categoryName: string;
  description: string;
  image: string;
}

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NotificationType {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}