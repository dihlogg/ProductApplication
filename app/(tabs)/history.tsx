import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

type Props = {};

type Order = {
  id: string;
  dateOrder: string;
  status: string;
  totalPrice: string;
  image: string;
  productName: string;
  quantity: string;
};

// Dữ liệu mẫu cho các tab
const newOrders: Order[] = [
  {
    id: "1",
    dateOrder: "17/12/2004",
    status: "New Order",
    totalPrice: "$799.99",
    image:
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/803717658.jpeg",
    productName: "Kids' Bunk Bed",
    quantity: "1",
  },
];

const deliveryOrders: Order[] = [
  {
    id: "2",
    dateOrder: "20/12/2004",
    status: "In Delivery",
    totalPrice: "$499.99",
    image:
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/803717658.jpeg",
    productName: "Gaming Chair",
    quantity: "1",
  },
];

const completedOrders: Order[] = [
  {
    id: "3",
    dateOrder: "25/12/2004",
    status: "Completed",
    totalPrice: "$299.99",
    image:
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/803717658.jpeg",
    productName: "Desk Lamp",
    quantity: "2",
  },
];

const HistoryScreen = (props: Props) => {
  const headerHeight = useHeaderHeight();
  const [activeTab, setActiveTab] = useState<"New" | "Delivery" | "Completed">(
    "Delivery"
  );

  // Hàm để chọn dữ liệu dựa trên tab đang hoạt động
  const getOrders = () => {
    switch (activeTab) {
      case "New":
        return newOrders;
      case "Delivery":
        return deliveryOrders;
      case "Completed":
        return completedOrders;
      default:
        return newOrders;
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
            style={[styles.tab, activeTab === "New" && styles.activeTab]}
            onPress={() => setActiveTab("New")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "New" && styles.activeTabText,
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

        {/* Danh sách đơn hàng */}
        <FlatList
          data={getOrders()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              {/* Dòng 1: Order ID và Date */}
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.dateOrder}>{item.dateOrder}</Text>
              </View>

              {/* Dòng 2: Hình ảnh và thông tin Items/Total */}
              <View style={styles.orderContent}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.productDetails}>
                    Items: {item.quantity}
                  </Text>
                  <Text style={styles.productDetails}>
                    Total: {item.totalPrice}
                  </Text>
                </View>
                <Text style={styles.detailsText}>Details {'>'}</Text>
              </View>

              {/* Dòng 3: Trạng thái và Details */}
              <View style={styles.orderFooter}>
                <View
                  style={[styles.statusContainer, getStatusStyle(item.status)]}
                >
                  <View
                    style={[styles.statusDot, getStatusStyle(item.status)]}
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                {activeTab === "Delivery" && item.status === "In Delivery" && (
                <TouchableOpacity
                  style={styles.receivedButton}
                  onPress={() => {
                    // TODO: xử lý khi người dùng nhấn nút Received
                    console.log(`Order ${item.id} marked as received`);
                  }}
                >
                  <Text style={styles.receivedButtonText}>Received</Text>
                </TouchableOpacity>
              )}
              </View>
            </View>
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
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
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
});
