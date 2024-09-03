import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import productService from "@/services/productService"; // Adjust path as necessary
import { Checkbox } from "react-native-paper";

interface Category {
  name: string;
  count: number;
  checked?: boolean;
}

const ItemBox = () => {
  return (
    <>
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="arrow-down-outline" size={20} color={Colors.grey} />
          <Text style={{ flex: 1 }}>Sort</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="bag-outline" size={20} color={Colors.grey} />
          <Text style={{ flex: 1 }}>By Rating</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="pricetag-outline" size={20} color={Colors.grey} />
          <Text style={{ flex: 1 }}>Offers</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
        </TouchableOpacity>
      </View>
      <Text style={styles.header}> Categories </Text>
    </>
  );
};

function Filter() {
  const navigation = useNavigation();
  const [items, setItems] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category[]>([]);
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await productService.getCategories();
        console.log("Fetched categories:", categories); // Log the categories
        const formattedCategories = categories.map((category: any) => ({
          name: category.name,
          count: 0,
          checked: false,
        }));
        // Log to check if there are duplicates
        const names = formattedCategories.map((item) => item.name);
        const hasDuplicates = names.length !== new Set(names).size;
        console.log("Has duplicates:", hasDuplicates);
        setItems(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const categories = await productService.getCategoryCounts();
        setItems(
          categories.map((category: any) => ({
            name: category.categoryName,
            count: category.productCount,
            checked: false,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories with counts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    const hasSelected = selected.length > 0;
    const selectedItems = items.filter((item) => item.checked);
    const newSelected = selectedItems.length > 0;

    if (hasSelected !== newSelected) {
      flexWidth.value = withTiming(newSelected ? 150 : 0);
      scale.value = withTiming(newSelected ? 1 : 0);
    }
    setSelected(selectedItems);
  }, [items]);

  const handleClearAll = () => {
    const updatedItems = items.map((item) => {
      item.checked = false;
      return item;
    });
    setItems(updatedItems);
  };

  const handleApplyFilters = () => {
    // Apply your filters here and navigate back
    const filteredItems = items.filter((item) => item.checked);
    // Pass the filtered items or perform filtering based on your app logic
    console.log("Filtered Items:", filteredItems);
    navigation.goBack();
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      opacity: flexWidth.value > 0 ? 1 : 0,
    };
  });
  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const renderItem: ListRenderItem<Category> = ({ item }) => {
    console.log("Rendering item:", item); // Log each item
    return (
      <View style={styles.row}>
        <Text style={styles.itemText}>
          {item.name} ({item.count})
        </Text>
        <Checkbox
          status={item.checked ? "checked" : "unchecked"}
          onPress={() => {
            console.log(
              `Checkbox for ${item.name} is ${
                item.checked ? "checked" : "unchecked"
              }`
            );
            setItems((prevItems) =>
              prevItems.map((cat) =>
                cat.name === item.name ? { ...cat, checked: !cat.checked } : cat
              )
            );
          }}
          // Add any additional styling or props here if needed
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={<ItemBox />}
      />
      <Text style={{ color: Colors.dark }}>Filter</Text>
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <Animated.View style={[animatedStyles, styles.outlineButton]}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear All
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.fullButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.footerText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FCF8FF",
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
    flex: 1,
    height: 56,
  },
  footerText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "mon-sb",
  },
  item: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderColor: "#eee",
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  itemText: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 56,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Filter;
