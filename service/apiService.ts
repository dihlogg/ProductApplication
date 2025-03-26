const API_BASE_URL = "http://10.60.30.130:5117";

export const API_ENDPOINTS = {
    GET_CART_INFO: `${API_BASE_URL}/CartInfo/GetCartInfos`,
    GET_CATEGORIES: `${API_BASE_URL}/Category/GetCategories`,
    GET_PRODUCT_INFO: `${API_BASE_URL}/ProductInfo/GetProductInfos`,
    GET_PRODUCT_DETAILS: `${API_BASE_URL}/ProductInfo/GetProductDetailsById`,
    LOGIN_USER: `${API_BASE_URL}/UserInfo/LoginUser`,
    REGISTER_USER: `${API_BASE_URL}/UserInfo/PostUserInfo`,
    POST_CART_REDIS: `${API_BASE_URL}/CartDetails/Redis/PostCartRedis`,
    GET_CART_REDIS: (userId: any) => `${API_BASE_URL}/CartDetails/Redis/GetCartItems/${userId}`,
    DELETE_PRODUCT_FROM_CART_REDIS: (userId: any, productId: any) => `${API_BASE_URL}/CartDetails/Redis/DeleteProductFromCartRedis/user/${userId}/product/${productId}`,
};