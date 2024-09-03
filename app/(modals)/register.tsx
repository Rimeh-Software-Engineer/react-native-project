import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError(""); // Clear any previous errors
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, {
        name: username,
        email: email,
        password: password,
        role: role,
      });
      if (response.status === 200) {
        const { token, user } = response.data;

        if (token) {
          // Store the token
          await AsyncStorage.setItem("userToken", token);
          console.log("Stored Token:", token);
        } else {
          console.error("No token received");
          setError("Registration failed. Please try again.");
          return;
        }

        if (user && user.id) {
          // Store user ID
          await AsyncStorage.setItem("userId", user.id);
          console.log("User ID:", user.id);
        } else {
          console.error("User ID is missing");
          setError("Registration failed. Please try again.");
          return;
        }
        if (role === "customer") {
          router.push("/(tabs)");
        } else if (role === "merchant") {
          router.push("/merchant/MerchantTabs");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.toJSON());
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          if (
            error.response.status === 400 &&
            error.response.data === "Email already exists."
          ) {
            setError("Email already exists. Please use a different email.");
          } else {
            setError("Registration failed. Please try again.");
          }
        } else if (error.request) {
          console.error("Error request:", error.request);
          setError("Network error. Please try again.");
        } else {
          console.error("Error message:", error.message);
          setError("Unexpected error. Please try again.");
        }
      } else {
        console.error("Unexpected error:", error);
        setError("Unexpected error. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        autoCapitalize="none"
        placeholder="Username"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "customer" && styles.selectedRoleButton,
          ]}
          onPress={() => setRole("customer")}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "customer" && styles.selectedRoleButtonText,
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "merchant" && styles.selectedRoleButton,
          ]}
          onPress={() => setRole("merchant")}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "merchant" && styles.selectedRoleButtonText,
            ]}
          >
            Merchant
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={defaultStyles.btn} onPress={handleRegister}>
        <Text style={defaultStyles.btnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selectedRoleButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  selectedRoleButtonText: {
    color: "#fff",
  },
});
