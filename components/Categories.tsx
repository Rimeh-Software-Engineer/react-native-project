import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState } from "react";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";

const categories = [
  {
    name: "Electronics",
    icon: "devices",
  },
  {
    name: "Books & Media",
    icon: "book",
  },
  {
    name: "Toys & Games",
    icon: "toys",
  },
  {
    name: "Clothing & Accessories",
    icon: "shopping-bag",
  },
  {
    name: "Home & Furniture",
    icon: "home",
  },

  {
    name: "Beauty & Personal Care",
    icon: "spa",
  },
  {
    name: "Sports & Outdoors",
    icon: "sports",
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const Categories = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measureLayout(
      scrollRef.current,
      (x, y) => {
        // Scroll to the position of the selected category
        scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
      },
      () => {}
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };
  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        marginBottom: 14,
        paddingTop: 10,
      }}
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          ref={(el) => (itemsRef.current[index] = el)}
          key={index}
          style={
            activeIndex === index
              ? styles.categoriesBtnActive
              : styles.categoriesBtn
          }
          onPress={() => selectCategory(index)}
        >
          <MaterialIcons
            name={item.icon as any}
            size={24}
            color={activeIndex === index ? "#000" : Colors.grey}
          />
          <Text
            style={
              activeIndex === index
                ? styles.categoryTextActive
                : styles.categoryText
            }
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  categoryText: {
    fontSize: 14,
    fontFamily: "mon-sb",
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "mon-sb",
    color: Colors.dark,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Colors.dark,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});
export default Categories;
