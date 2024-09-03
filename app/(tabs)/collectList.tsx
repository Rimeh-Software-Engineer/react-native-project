import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import useBasketMarket from "@/maket/basketMarket";
import Colors from "@/constants/Colors";
import SwipeableRow from "@/components/SwipeableRow";

const Page = () => {
  const { products, total, clearCart, reduceProduct } = useBasketMarket();
  const [order, setOrder] = useState(false);
  return (
    <>
      {order && <Text> Order</Text>}
      {!order && (
        <>
          <FlatList
            data={products}
            ListHeaderComponent={<Text style={styles.section}>My Orders</Text>}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#eee" }}></View>
            )}
            renderItem={({ item }) => (
              <SwipeableRow onDelete={() => reduceProduct(item)}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 18, color: Colors.primary }}>
                    {item.quantity}x
                  </Text>
                  <Text style={{ flex: 1, fontSize: 18 }}>{item.name}</Text>
                  <Text style={{ fontSize: 18 }}>
                    {item.price * item.quantity}DT
                  </Text>
                </View>
              </SwipeableRow>
            )}
            ListFooterComponent={
              <View>
                <View style={styles.totalRow}>
                  <Text style={{ fontSize: 18, color: Colors.medium }}>
                    Total
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {total}DT
                  </Text>
                </View>
              </View>
            }
          ></FlatList>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.footerText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    gap: 20,
    alignItems: "center",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -10,
    },
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 10,
    height: 56,
  },
  footerText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "mon-sb",
  },
});

export default Page;
