import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MerchantHomePage from "./MerchantHomePage";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddProduct from "./AddProduct";
import { useRef } from "react";
import Page from "../(tabs)/profile";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";

const Tab = createBottomTabNavigator();

const MerchantTabs = () => {
  const bottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: {
            fontFamily: "mon-sb",
          },
        }}
      >
        <Tab.Screen
          name="MerchantHomePage"
          component={MerchantHomePage}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="AddProduct"
          component={AddProduct}
          options={{
            tabBarLabel: "Add Product",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="post-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Page}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
            headerTitle: "",
          }}
        />
      </Tab.Navigator>
      <CustomBottomSheetModal ref={bottomSheetRef} />
    </BottomSheetModalProvider>
  );
};

export default MerchantTabs;
