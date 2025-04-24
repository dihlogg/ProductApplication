const API_BASE_URL = "http://192.168.1.15:5117";

export const API_ENDPOINTS = {
    GET_CART_INFO: `${API_BASE_URL}/CartInfo/GetCartInfos`,
    GET_CATEGORIES: `${API_BASE_URL}/Category/GetCategories`,
    GET_PRODUCT_INFO: `${API_BASE_URL}/ProductInfo/GetProductInfos`,
    SEARCH_PRODUCT_INFO: `${API_BASE_URL}/ProductInfo/SearchProductInfos`,
    GET_PRODUCT_DETAILS: `${API_BASE_URL}/ProductInfo/GetProductDetailsById`,
    GET_PRODUCT_BY_CATEGORY: `${API_BASE_URL}/ProductInfo/GetProductsByCategoryId`,
    LOGIN_USER: `${API_BASE_URL}/UserInfo/LoginUser`,
    REGISTER_USER: `${API_BASE_URL}/UserInfo/PostUserInfo`,
    POST_CART_REDIS: `${API_BASE_URL}/CartDetails/Redis/PostCartRedis`,
    GET_CART_REDIS: (userId: any) => `${API_BASE_URL}/CartDetails/Redis/GetCartItems/${userId}`,
    DELETE_PRODUCT_FROM_CART_REDIS: (userId: any, productId: any) => `${API_BASE_URL}/CartDetails/Redis/DeleteProductFromCartRedis/user/${userId}/product/${productId}`,
    POST_CART_DETAIL_REDIS: `${API_BASE_URL}/CartDetails/Redis/PostCartDetailsRedis`,
    GET_FEATURED_PRODUCTS_HISTORY: `${API_BASE_URL}/ProductInfoHistory/GetFeaturedProductHistory`,
    GET_SIMILAR_PRODUCTS: `${API_BASE_URL}/ProductInfo/GetSimilarProducts`,
    POST_MESSAGE: `${API_BASE_URL}/Chat/PostMessage`,
    GET_MESSAGES: `${API_BASE_URL}/Chat/GetMessages`,
    GET_TRANSACTIONS: `${API_BASE_URL}/CartInfo/GetTransactionsByUserId`,
    GET_TRANSACTION_BY_ID: `${API_BASE_URL}/CartInfo/GetTransactionById`,
    UPDATE_CART_STATUS: `${API_BASE_URL}/CartInfo/UpdateStatusCartInfo`,
    DELETE_CART_INFO: `${API_BASE_URL}/CartInfo/DeleteCartInfo`,
};