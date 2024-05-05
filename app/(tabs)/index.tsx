<<<<<<< HEAD
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import HomeHeader from "@/components/HomeHeader";
import Listing from "@/components/Listing";
import productService from "@/services/productService";

const Page = () => {
  const [category, setCategory] = useState<string>("Electronics");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isSortedLogic, setIsSortedLogic] = useState(false);

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

  const onSortChanged = () => {
    setIsSorted((state) => !state);
    setIsSortedLogic((state) => !state);
  };
  const resetSortedLogic = () => {
    setIsSortedLogic(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeHeader
        onCategoryChanged={onDataChanged}
        onSortChanged={onSortChanged}
        isSorted={isSorted}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Listing
          refresh={refresh}
          category={category}
          isSortedLogic={isSortedLogic}
          onResetSortedLogic={resetSortedLogic}
        />
      )}
=======
import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Stack } from "expo-router";
import HomeHeader from "@/components/HomeHeader";
import Categories from "@/components/Categories";
import Listing from "@/components/Listing";
import listingsData from "@/assets/data/airbnb-listings.json";

const Page = () => {
  const items = useMemo(() => listingsData as any, []);
  const [category, setCategory] = useState<string>("Electronics");
  const onDataChanged = (category: string) => {
    setCategory(category);
  };
  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeHeader />
      <Categories onCategoryChanged={onDataChanged} />
      <Listing listings={items} category={category} />
>>>>>>> f13aba4 (discountApplication)
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

=======
>>>>>>> f13aba4 (discountApplication)
export default Page;
