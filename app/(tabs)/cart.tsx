import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CartProductType } from "@/types/type";
import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { API_ENDPOINTS } from "@/service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import connectSignalR from "@/service/signalrService";
import { RegisterRequest } from "@/types/register-request";

type Props = {};

const CartScreen = (props: Props) => {
  const [userInfo, setUserInfo] = useState<RegisterRequest>();
  const [cartProducts, setCartProducts] = useState<CartProductType[]>([]);
  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );
  const headerHeight = useHeaderHeight();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchUserInfoAndConnect = async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) return;

      const user = JSON.parse(userData);
      setUserInfo(user);

      if (!user.id) return; // expect signalR chỉ khi có userId

      console.log(`Connecting SignalR for user: ${user.id}`);
      const connection = await connectSignalR(user.id, getCartData);

      return () => {
        console.log("Stopping SignalR connection");
        connection?.stop();
      };
    };

    fetchUserInfoAndConnect();
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
          cartQuantity: item.Quantity, // số lượng trong giỏ hàng
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

    if (loadingProducts[productId]) return;

    try {
      setLoadingProducts((prev) => ({ ...prev, [productId]: true }));

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
            item.id === productId
              ? { ...item, cartQuantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity.");
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
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

  const handleCheckout = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const user = JSON.parse(userData);
      const userId: string = user.id;

      if (!userId || cartProducts.length === 0) {
        Alert.alert("Error", "No products in cart.");
        return;
      }

      const productsPayload = cartProducts.map((item) => ({
        productId: item.id,
        quantity: item.cartQuantity,
      }));

      // show popup
      setIsSuccessModalVisible(true);

      const response = await axios.post(API_ENDPOINTS.POST_CART_DETAIL_REDIS, {
        userId,
        products: productsPayload,
      });

      if (response.status === 200) {
        console.log("Checkout response:", response.data);
        // clear cart redis
        setCartProducts([]);
      } else {
        Alert.alert("Error", "Checkout failed.");
        setIsSuccessModalVisible(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Error", "An error occurred during checkout.");
      setIsSuccessModalVisible(false);
    }
  };

  const handleContinueShopping = () => {
    setIsSuccessModalVisible(false);
    router.push("/");
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
                loadingProducts={loadingProducts}
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
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isSuccessModalVisible}
          onRequestClose={() => setIsSuccessModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png", // Icon checkmark
                }}
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Success!</Text>
              <Text style={styles.successMessage}>
                Your order will be delivered soon.{"\n"}Thank you for choosing
                our app!
              </Text>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinueShopping}
              >
                <Text style={styles.continueBtnText}>CONTINUE SHOPPING</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const CartItem = ({
  item,
  updateQuantity,
  removeFromCart,
  loadingProducts,
}: {
  item: CartProductType;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  loadingProducts: { [key: string]: boolean };
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
        <Text style={styles.itemTextName}>{item.name}</Text>
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
                disabled={loadingProducts[item.id ?? ""]}
                onPress={() =>
                  item.id &&
                  updateQuantity(item.id, (item.cartQuantity || 0) - 1)
                }
              >
                <Ionicons
                  name="remove-outline"
                  size={20}
                  color={Colors.black}
                />
              </TouchableOpacity>
              <Text>{item.cartQuantity || 0}</Text>
              <TouchableOpacity
                style={[
                  styles.quantityControl,
                  isMaxQuantity && styles.quantityControlDisabled,
                ]}
                disabled={isMaxQuantity}
                onPress={() =>
                  item.id &&
                  updateQuantity(item.id, (item.cartQuantity || 0) + 1)
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
    paddingHorizontal: 10,
    backgroundColor: "#F8F8F8",
  },
  itemWrapper: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfoWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemText: {
    marginBottom: 4,
    fontSize: 16,
    color: "#666",
    fontWeight: 400,
  },
  itemTextName: {
    marginBottom: 4,
    fontSize: 16,
    color: "#333",
    fontWeight: 600,
  },
  textVND: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FE2020",
  },
  itemControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantityControlWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityControl: {
    padding: 5,
    backgroundColor: "#EEE",
    borderRadius: 6,
  },
  quantityControlDisabled: {
    backgroundColor: "#ccc",
  },
  maxQuantityText: {
    color: "#FE2020",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 15,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 4,
  },
  priceInforWrapper: {
    marginBottom: 10,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutBtn: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  successIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  continueBtn: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  continueBtnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
