import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router, Stack } from "expo-router";
import { CartInfo } from "@/types/cart-details";
import { RegisterRequest } from "@/types/register-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ENDPOINTS } from "@/service/apiService";

type Props = {};

const HistoryScreen = (props: Props) => {
  const headerHeight = useHeaderHeight();
  const [activeTab, setActiveTab] = useState<
    "NewOrder" | "Delivery" | "Completed"
  >("Delivery");
  const [transactions, setTransactions] = useState<CartInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<RegisterRequest>();
  const [transactionCache, setTransactionCache] = useState<
    Record<string, CartInfo[]>
  >({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserInfo(parsed);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      GetTransactions(activeTab);
    }
  }, [activeTab, userInfo]);

  const GetTransactions = async (status: string) => {
    if (!userInfo) return;
    // Nếu đã có cache → không gọi API lại
    if (transactionCache[status]) {
      setTransactions(transactionCache[status]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_TRANSACTIONS, {
        params: {
          userId: userInfo.id,
          status: status,
        },
      });
      setTransactions(response.data);
      console.log("Transactions:", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const UpdateCartStatus = async (id: string, newStatus: string) => {
    try {
      const response = await axios.put(API_ENDPOINTS.UPDATE_CART_STATUS, {
        cartInfoId: id,
        status: newStatus,
      });
      GetTransactions(activeTab);
      return true;
    } catch (error) {
      console.error("Exception update:", error);
      return false;
    }
  };
  const deleteCartInfo = async (id: string) => {
    const response = await axios.delete(
      `${API_ENDPOINTS.DELETE_CART_INFO}/${id}`
    );
    GetTransactions(activeTab);
  };

  const getOrders = () => {
    switch (activeTab) {
      case "NewOrder":
        return transactions.filter((order) => order.status === "NewOrder");
      case "Delivery":
        return transactions.filter((order) => order.status === "Delivery");
      case "Completed":
        return transactions.filter((order) => order.status === "Completed");
      default:
        return [];
    }
  };

  // Hàm để lấy style cho trạng thái
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New Order":
        return styles.statusNew;
      case "In Delivery":
        return styles.statusDelivery;
      case "Completed":
        return styles.statusCompleted;
      default:
        return styles.statusNew;
    }
  };

  return (
    <GestureHandlerRootView>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "NewOrder" && styles.activeTab]}
            onPress={() => setActiveTab("NewOrder")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "NewOrder" && styles.activeTabText,
              ]}
            >
              New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Delivery" && styles.activeTab]}
            onPress={() => setActiveTab("Delivery")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Delivery" && styles.activeTabText,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
            onPress={() => setActiveTab("Completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Completed" && styles.activeTabText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={getOrders()}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>
                  Order #{item.id?.slice(0, 6)}
                </Text>
                <Text style={styles.dateOrder}>{item.dateOrder}</Text>
              </View>
              <View style={styles.orderContent}>
                <Image
                  source={{
                    uri: item.cartDetails[0]?.productImages?.[0]?.imageUrl,
                  }}
                  style={styles.image}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.productDetails}>
                    Items:{" "}
                    {item.cartDetails.reduce(
                      (sum, detail) => sum + detail.quantity,
                      0
                    )}
                  </Text>
                  <Text style={styles.productDetails}>
                    Total: {item.totalPrice.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/order-details/history-order",
                      params: { data: JSON.stringify(item) }, // truyền cả đơn hàng
                    });
                  }}
                >
                  <Text style={styles.detailsText}>Details {">"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.orderFooter}>
                <View
                  style={[styles.statusContainer, getStatusStyle(item.status)]}
                >
                  <View
                    style={[styles.statusDot, getStatusStyle(item.status)]}
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                {activeTab === "Delivery" && item.status === "Delivery" && (
                  <TouchableOpacity
                    style={styles.receivedButton}
                    onPress={async () => {
                      const success = await UpdateCartStatus(
                        item.id ?? "",
                        "Completed"
                      );
                    }}
                  >
                    <Text style={styles.receivedButtonText}>Received</Text>
                  </TouchableOpacity>
                )}
                {activeTab === "NewOrder" && item.status === "NewOrder" && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => deleteCartInfo(item.id ?? "")} // Gọi hàm ở đây
                  >
                    <Text style={styles.receivedButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>
              No orders found.
            </Text>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#F8F8F8",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#888", // Màu chữ xám cho tab không hoạt động
  },
  activeTabText: {
    color: "#FFF", // Màu chữ trắng cho tab hoạt động
    fontWeight: "bold",
  },
  orderItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateOrder: {
    fontSize: 14,
    color: "#888",
  },
  orderContent: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  productDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusNew: {
    backgroundColor: "#6200EE",
  },
  statusDelivery: {
    backgroundColor: "#F5A623",
  },
  statusCompleted: {
    backgroundColor: "#2ECC71",
  },
  statusText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#FFF",
    right: 5,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#6200EE",
  },
  receivedButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },

  receivedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FE2020",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
});
