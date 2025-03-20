import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CartProductType } from "@/types/type";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { API_ENDPOINTS } from "@/service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

type Props = {};

const CartScreen = (props: Props) => {
  const [cartProducts, setCartProducts] = useState<CartProductType[]>([]);
  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    getCartData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCartData();
    }, [])
  );

  const getCartData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) return;
  
      const user = JSON.parse(userData);
      const userId: string = user.id;
  
      const cartResponse = await axios.get(
        API_ENDPOINTS.GET_CART_REDIS(userId)
      );
      if (cartResponse.status !== 200) return;
  
      const cartItems = cartResponse.data;
      console.log("Cart Items:", cartItems);
  
      const productDetailsPromises = cartItems.map(async (item: any) => {
        const productResponse = await axios.get(
          `${API_ENDPOINTS.GET_PRODUCT_DETAILS}/${item.ProductId}`
        );
        return { 
          ...productResponse.data,
          quantity: productResponse.data.quantity, // số lượng tồn kho
          cartQuantity: item.Quantity // số lượng trong giỏ hàng
        };
      });
  
      const productsWithDetails = await Promise.all(productDetailsPromises);
      setCartProducts(productsWithDetails);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
  
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) return;
  
      const user = JSON.parse(userData);
      const userId: string = user.id;
  
      const response = await axios.post(API_ENDPOINTS.POST_CART_REDIS, {
        userId,
        productId,
        quantity: newQuantity,
      });
  
      if (response.status === 200) {
        setCartProducts((prevProducts) =>
          prevProducts.map((item) =>
            item.id === productId ? { ...item, cartQuantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity.");
    }
  };
  const removeFromCart = (productId: string) => {
    Alert.alert(
      "Confirm",
      "Do you want to delete this product from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const userData = await AsyncStorage.getItem("userInfo");
              if (!userData) return;

              const user = JSON.parse(userData);
              const userId: string = user.id;

              const response = await axios.delete(
                API_ENDPOINTS.DELETE_PRODUCT_FROM_CART_REDIS(userId, productId)
              );

              if (response.status === 200) {
                console.log("Delete Success");

                // update states to re-render UI
                setCartProducts((prevCart) =>
                  prevCart.filter((item) => item.id !== productId)
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete product.");
            }
          },
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={cartProducts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(300 + index * 100).duration(500)}
            >
              <CartItem
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            </Animated.View>
          )}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.priceInforWrapper}>
          <Text style={styles.totalText}>
            Total: {totalPrice.toLocaleString("vi-VN")}
            <Text style={styles.textVND}> ₫</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const CartItem = ({
  item,
  updateQuantity,
  removeFromCart,
}: {
  item: CartProductType;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}) => {
  const imageUrl =
    item?.productImages?.[0]?.imageUrl ||
    "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b1/ff/b1ff8943a6d5c41189d9a59591fd68b2.png";

  const isMaxQuantity = (item.cartQuantity || 0) >= (item.quantity || 0);

  return (
    <View style={styles.itemWrapper}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.itemImg}
        resizeMode="cover"
      />
      <View style={styles.itemInfoWrapper}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>Only {item.quantity} left</Text>
        <Text style={styles.itemText}>
          {(item.price * (item.cartQuantity || 0)).toLocaleString("vi-VN")}
          <Text style={styles.textVND}> ₫</Text>
        </Text>

        <View style={styles.itemControlWrapper}>
          <TouchableOpacity onPress={() => item.id && removeFromCart(item.id)}>
            <Ionicons name="trash-outline" size={20} color={"red"} />
          </TouchableOpacity>
          <View>
            <View style={styles.quantityControlWrapper}>
              <TouchableOpacity
                style={styles.quantityControl}
                onPress={() =>
                  item.id && updateQuantity(item.id, (item.cartQuantity || 0) - 1)
                }
              >
                <Ionicons name="remove-outline" size={20} color={Colors.black} />
              </TouchableOpacity>
              <Text>{item.cartQuantity || 0}</Text>
              <TouchableOpacity
                style={[
                  styles.quantityControl,
                  isMaxQuantity && styles.quantityControlDisabled
                ]}
                disabled={isMaxQuantity}
                onPress={() =>
                  item.id && updateQuantity(item.id, (item.cartQuantity || 0) + 1)
                }
              >
                <Ionicons 
                  name="add-outline" 
                  size={20} 
                  color={isMaxQuantity ? Colors.gray : Colors.black} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color={"red"} />
          </TouchableOpacity>
        </View>
        {isMaxQuantity && (
              <Text style={styles.maxQuantityText}>
                Max {item.quantity} per order
              </Text>
            )}
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: Colors.white,
  },
  priceInforWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  totalText: {
    fontSize: 17,
    fontWeight: 600,
    color: Colors.black,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.white,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    borderRadius: 5,
  },
  itemImg: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  itemInfoWrapper: {
    flex: 1,
    alignSelf: "flex-start",
    gap: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.black,
  },
  textVND: {
    color: "red",
    fontWeight: "600",
    fontSize: 18,
    textDecorationLine: "none",
  },
  itemControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  quantityControl: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
  },
  quantityControlDisabled: {
    opacity: 0.5,
  },
  maxQuantityText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'red',
    textAlign: 'center',
  },
});
