const API_BASE_URL = "http://192.168.1.204:5117";

export const API_ENDPOINTS = {
    GET_CART_INFO: `${API_BASE_URL}/CartInfo/GetCartInfos`,
    GET_CATEGORIES: `${API_BASE_URL}/Category/GetCategories`,
    GET_PRODUCT_INFO: `${API_BASE_URL}/ProductInfo/GetProductInfos`,
    GET_PRODUCT_DETAILS: `${API_BASE_URL}/ProductInfo/GetProductDetailsById`,
    LOGIN_USER: `${API_BASE_URL}/UserInfo/LoginUser`,
    REGISTER_USER: `${API_BASE_URL}/UserInfo/PostUserInfo`,
};