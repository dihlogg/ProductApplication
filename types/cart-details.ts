export interface CartInfo {
    id?: string | null;
    status: string;
    dateOrder: string;
    totalPrice: number;
    cartDetails: CartDetailInfo[];
}

export interface CartDetailInfo {
    image: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface CartInfoRequestDto {
    status: string;
    dateOrder: string;
    userId: string;
    cartDetailDtos: CartDetailRequestDto[];
}

export interface CartDetailRequestDto {
    productId: string;
    quantity: number;
    totalPrice: number;
}
