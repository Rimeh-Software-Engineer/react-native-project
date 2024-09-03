import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import MerchantHomeHeader from "@/components/MerchantHomeHeader";
import MerchantListing from "@/components/MerchantListing";
import productService from "@/services/productService";

const MerchantHomePage = () => {
  const [category, setCategory] = useState<string>("Electronics");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);

  const fetchProducts = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const data = await productService.getProducts(category);
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Expected an array of products but received:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(category);
  }, [category, refresh, fetchProducts]);

  const onDataChanged = (newCategory: string) => {
    setCategory(newCategory);
    setRefresh(refresh + 1); // Trigger refresh to reload data
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <MerchantHomeHeader onCategoryChanged={onDataChanged} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MerchantListing
          listings={items}
          refresh={refresh}
          category={category}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MerchantHomePage;
