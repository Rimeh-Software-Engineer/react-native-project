import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
<<<<<<< HEAD
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useRouter, Link, useFocusEffect } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isSignedIn, setIsSignedIn] = useState(false);

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
    if (token) {
      setIsSignedIn(true);
    }
    return token;
  };

  useEffect(() => {
    checkAuth();
  });
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn]);
  const handleLogin = async () => {
    setError(""); // Clear any previous errors
    console.log("handleLogin called");
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email: email,
        password: password,
      });
      console.log("Response:", response.data);
      if (response.status === 200) {
        const { token, user } = response.data;
        console.log("Token received:", token);
        console.log("User role:", user.role);
        console.log("User data:", user.id);

        // Store the token
        await AsyncStorage.setItem("userToken", token);

        // Log to verify the token is stored
        const storedToken = await AsyncStorage.getItem("userToken");
        console.log("Stored Token:", storedToken);

        // Fetch user details if necessary
        await AsyncStorage.setItem("userId", user.id);
        console.log("User", user.id);

        // Navigate based on user role
        if (user.role === "customer") {
          console.log("Navigating to customer tabs");
          router.push("/(tabs)");
        } else if (user.role === "merchant") {
          console.log("Navigating to merchant tabs");
          router.push("/merchant/MerchantTabs");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.toJSON());
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          if (error.response.status === 400) {
            setError(error.response.data);
          } else {
            setError("Login failed. Please try again.");
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
=======
import React from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

enum Strategy {
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}
const Page = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "exp://10.34.33.137:8081/--/(tabs)",
  });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
    redirectUrl: "exp://10.34.37.157:8081/--/(tabs)",
  });
  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };
  return (
    <View style={styles.container}>
>>>>>>> f13aba4 (discountApplication)
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
<<<<<<< HEAD
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
      <TouchableOpacity style={defaultStyles.btn} onPress={handleLogin}>
        <Text style={defaultStyles.btnText}>Login</Text>
=======
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
>>>>>>> f13aba4 (discountApplication)
      </TouchableOpacity>
      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
<<<<<<< HEAD
      <View style={{ gap: 10 }}>
        <Link href={"/(modals)/register"} asChild>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Register</Text>
          </TouchableOpacity>
        </Link>
=======
      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="call-outline"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
>>>>>>> f13aba4 (discountApplication)
      </View>
    </View>
  );
};

export default Page;
<<<<<<< HEAD

=======
>>>>>>> f13aba4 (discountApplication)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
<<<<<<< HEAD
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
=======

>>>>>>> f13aba4 (discountApplication)
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "mon-sb",
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
});
