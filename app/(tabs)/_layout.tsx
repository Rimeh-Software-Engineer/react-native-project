<<<<<<< HEAD
import React, { useRef } from "react";
import { Tabs, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useBasketMarket from "@/maket/basketMarket";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";

const CustomTabBarIcon = ({ name, color, size }) => {
  const { items } = useBasketMarket();
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name} color={color} size={size} />
      {items > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{items}</Text>
        </View>
      )}
    </View>
  );
};

const Layout = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: {
            fontFamily: "mon-sb",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="collectList"
          options={{
            tabBarLabel: "Basket",
            tabBarIcon: ({ color, size }) => (
              <CustomTabBarIcon name="cart-outline" color={color} size={size} />
            ),
            headerTitle: "Basket",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
            headerTitle: "",
          }}
        />
      </Tabs>
      <CustomBottomSheetModal ref={bottomSheetRef} />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    margin: 5,
  },
  badgeContainer: {
    position: "absolute",
    right: -9,
    top: -3,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "bold",
  },
});

=======
import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: "mon-sb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="collectList"
        options={{
          tabBarLabel: "CollectList",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="brands"
        options={{
          tabBarLabel: "Brands",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="shopping-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          tabBarLabel: "Add Post",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="post-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

>>>>>>> f13aba4 (discountApplication)
export default Layout;
