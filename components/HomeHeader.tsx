import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import axios from "axios";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

interface Category {
  name: string;
  icon: string;
}

interface Props {
  onCategoryChanged: (category: string) => void;
  onSortChanged: () => void;
  isSorted: boolean;
}

const HomeHeader = ({
  onCategoryChanged,
  onSortChanged,
  isSorted = false,
}: Props) => {
  const [user, setUser] = useState<{ name: string }>({ name: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("userToken");
        console.log("Retrieved User ID:", userId);
        console.log("Retrieved Token:", token);
        if (userId && token) {
          const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("User data:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error("Backend error:", error.response.data);
        } else {
          console.error("Network error or unexpected error:", error);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchUserData();
    fetchCategories();
  }, []);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measureLayout(
      scrollRef.current!,
      (x, y) => {
        scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
      },
      () => {}
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <View>
          <Text style={{ color: Colors.dark, padding: 10, fontFamily: "mon" }}>
            {user.name || "Loading..."}
          </Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity>
          <View style={styles.searchBtn}>
            <Ionicons name="search" size={24} />
            <Text style={{ color: Colors.grey, fontFamily: "mon" }}>
              Search
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        {/* <Link href={"/(modals)/filter"} asChild> 
         
        </Link> */}
        <TouchableOpacity
          style={[
            styles.filterBtn,
            isSorted && { backgroundColor: Colors.primary },
          ]}
          onPress={() => {
            onSortChanged();
          }}
        >
          <Ionicons name="options-outline" size={24} />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 16,
          backgroundColor: "#fff",
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 200,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 14,
    paddingTop: 20,
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "mon-b",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 14,
  },
  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
    padding: 12,
    alignItems: "center",
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#c2c2c2",
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#A2A0A2",
    borderRadius: 24,
  },
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

export default HomeHeader;
