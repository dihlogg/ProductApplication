export interface RegisterRequest {
    id?: string | null;
    userName: string;
    userPassword: string;
    userFullName: string;
    userAddress: string;
    userPhone: string;
}

export interface UpdateStatusCartInfoRequest {
    cartInfoId?: string | null;
    status: string;
}