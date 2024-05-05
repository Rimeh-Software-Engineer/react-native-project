<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import api from "services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const Page = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); // Mock authentication state
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      checkAuth();
      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  const checkAuth = async () => {
    // Replace with your authentication logic
    const token = await AsyncStorage.getItem("userToken");

    const userId = await AsyncStorage.getItem("userId");
    console.log("Fetched User ID:", userId);
    if (!token) {
      console.log("TOKEN", token);
      router.push("/(modals)/login");
    }
    return token;
  };

  // Load user data on mount
  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Fetched User ID:", userId); // Debug log
        if (userId) {
          const fetchedUser = await api.getUserById(userId);
          setUser(fetchedUser);
          setName(fetchedUser.name);
          setEmail(fetchedUser.email);
        } else {
          console.error("User ID is not available");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserIdAndData();
  }, []);

  // Save updated user data
  const onSaveUser = async () => {
    try {
      const updatedUser = {
        name: name,
        email: email,
        // Add other fields if needed
      };

      if (user) {
        const response = await api.updateUser(user._id, updatedUser);
        console.log("API functions:", api);

        setUser(response);
        setEditName(false);
        setEditEmail(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle sign out
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      setIsSignedIn(false);
      navigation.navigate("(modals)/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {user && (
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {!editName && (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "mon-b", fontSize: 22 }}>
                  {name}
                </Text>
                <TouchableOpacity onPress={() => setEditName(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
            {editName && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {!editEmail && (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "mon-b", fontSize: 12 }}>
                  {email}
                </Text>
                <TouchableOpacity onPress={() => setEditEmail(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
            {editEmail && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={[defaultStyles.inputField, { width: 200 }]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
=======
import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";

const Page = () => {
  const { signOut, isSignedIn } = useAuth();
  return (
    <View>
      {isSignedIn && <Button title="Log Out" onPress={() => signOut()} />}
      {!isSignedIn && (
        <Link href={"/(modals)/login"}>
          <Text>Login</Text>
        </Link>
      )}
>>>>>>> f13aba4 (discountApplication)
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    fontFamily: "mon-b",
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  editRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButton: {
    backgroundColor: Colors.dark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

=======
>>>>>>> f13aba4 (discountApplication)
export default Page;
