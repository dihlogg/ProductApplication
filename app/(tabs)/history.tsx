import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useHeaderHeight } from '@react-navigation/elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

type Props = {}

const orders = [
  {
    id: "1",
    dateOrder: "17/12/2004",
    status: "PAID",
    totalPrice: "$799.99",
    image: "https://cdn.viettelstore.vn/Images/Product/ProductImage/803717658.jpeg",
    productName: "Kids' Bunk Bed",
    quantity: "1",
  },
];

const HistoryScreen = (props: Props) => {
  const headerHeight = useHeaderHeight();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Orders" }} />
      
      <View style={[styles.container]}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.image} />
              
              <View style={styles.infoContainer}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.dateOrder}>📅 {item.dateOrder}</Text>
                <Text style={styles.productDetails}>
                  {item.quantity} x {item.totalPrice}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  item.status === "PAID"
                    ? styles.statusPaid
                    : styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F8F8F8",
  },
  orderItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateOrder: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPaid: {
    backgroundColor: "#2ECC71",
  },
  statusPending: {
    backgroundColor: "#F39C12",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
})