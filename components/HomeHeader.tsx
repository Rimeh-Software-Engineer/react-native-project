import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const HomeHeader = () => {
  const { user } = useUser();

  return (
    user && (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.imageUrl }} style={styles.imageStyle} />
          <View>
            <Text
              style={{ color: Colors.dark, padding: 10, fontFamily: "mon" }}
            >
              {user.fullName}
            </Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity>
            <View style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ color: Colors.grey, fontFamily: "mon" }}>
                  Search
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default HomeHeader;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: 180,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
    borderBottomLeftRadius: 25,
  },

  profileContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 14,
    paddingTop: 45,
  },
  imageStyle: {
    borderRadius: 99,
    width: 45,
    height: 45,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 14,
  },

  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
    padding: 14,
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
});
