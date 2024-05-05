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
    </View>
  );
};

export default Page;
