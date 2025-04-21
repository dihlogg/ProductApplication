import { View, Text, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_ENDPOINTS } from "@/service/apiService";
import { CartInfo } from "@/types/cart-details";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";

const HistoryOrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerHeight = useHeaderHeight();
  const [transactions, setTransactions] = useState<CartInfo | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactionById();
  }, [id]);

  const getTransactionById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.GET_TRANSACTION_BY_ID}/${id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !transactions) {
    return (
      <View style={[styles.wrapper, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Stack.Screen
        options={{ headerShown: true, headerTransparent: false, title: "Order Details" }}
      />
      <View style={[styles.wrapper]}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.orderInfoCard}>
            <Text style={styles.orderId}>Order #{transactions.id?.slice(0, 6) || "N/A"}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{transactions.dateOrder}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, styles.statusText]}>
                {transactions.status}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total:</Text>
              <Text style={[styles.value, styles.totalText]}>
                {transactions.totalPrice.toLocaleString("vi-VN")} ₫
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Items</Text>

          <FlatList
            data={transactions.cartDetails}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{
                    uri: item.productImages[0]?.imageUrl || "https://via.placeholder.com/80",
                  }}
                  style={styles.image}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.detailText}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text style={styles.detailText}>
                    Price: {item.price.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default HistoryOrderDetails;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#6b7280",
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    color: "#111827",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
  },
  orderInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },
  statusText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  totalText: {
    color: "#d97706",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});