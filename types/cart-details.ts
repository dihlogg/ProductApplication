export interface CartInfo {
    id?: string | null;
    status: string;
    dateOrder: string;
    totalPrice: number;
    cartDetails: CartDetailInfo[];
}

export interface CartDetailInfo {
    productName: string;
    price: number;
    quantity: number;
    productImages: ProductImage[];
}

export interface ProductImage {
    imageUrl: string;
}
