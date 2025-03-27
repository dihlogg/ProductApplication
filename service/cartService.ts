import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "./apiService";
import { Alert } from "react-native";

// add product to cart
export const addToCart = async (productId: string, setCartProducts?: Function) => {
  try {
    const userData = await AsyncStorage.getItem("userInfo");
    if (!userData) {
      console.log("No user info found");
      return false;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    // get cart redis
    const cartResponse = await axios.get(API_ENDPOINTS.GET_CART_REDIS(userId));
    let cartItems = cartResponse.status === 200 ? cartResponse.data : [];

    // check product in cart?
    const existingProduct = cartItems.find((item: any) => item.ProductId === productId);

    // if product exist in cart, +1 cartQuantity
    const newQuantity = existingProduct ? existingProduct.Quantity + 1 : 1;

    // if product doesn't exist in cart, add new product to cart
    const response = await axios.post(API_ENDPOINTS.POST_CART_REDIS, {
      productId,
      userId,
      quantity: newQuantity,
    });

    if (response.status === 200) {
      console.log("Product added to cart successfully");

      if (setCartProducts) {
        const updatedCartResponse = await axios.get(API_ENDPOINTS.GET_CART_REDIS(userId));
        if (updatedCartResponse.status === 200) {
          const cartItems = updatedCartResponse.data;
          const productDetailsPromises = cartItems.map(async (item: any) => {
            const productResponse = await axios.get(
              `${API_ENDPOINTS.GET_PRODUCT_DETAILS}/${item.ProductId}`
            );
            return { 
              ...productResponse.data, 
              quantity: productResponse.data.quantity, // số lượng tồn kho
              cartQuantity: item.Quantity // số lượng đã chọn trong giỏ hàng
            };
          });

          const updatedCartProducts = await Promise.all(productDetailsPromises);
          setCartProducts(updatedCartProducts);
        }
      }

      return true;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
  return false;
};



