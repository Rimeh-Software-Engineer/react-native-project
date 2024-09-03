import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

=======
import { useEffect } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 185fb92 (mywork)
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

<<<<<<< HEAD
const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
  async getToken(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
      throw err; // Throw the error to indicate failure
    }
  },
};
>>>>>>> f13aba4 (discountApplication)
=======
>>>>>>> 185fb92 (mywork)
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 185fb92 (mywork)
    <GestureHandlerRootView>
      <StatusBar
        style="light"
        hidden={true}
        backgroundColor="transparent"
        translucent={true}
      />
<<<<<<< HEAD
      <RootLayoutNav />
    </GestureHandlerRootView>
=======
    <ClerkProvider
      publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
>>>>>>> f13aba4 (discountApplication)
=======
      <RootLayoutNav />
    </GestureHandlerRootView>
>>>>>>> 185fb92 (mywork)
  );
}

function RootLayoutNav() {
  const router = useRouter();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 185fb92 (mywork)
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // Mockup authentication check function
  const checkAuth = async () => {
    // Replace with your authentication logic
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      setIsSignedIn(true);
    }
    setIsLoaded(true);
    return token;
  };

  useEffect(() => {
    checkAuth();
  }, []);
<<<<<<< HEAD
=======
  const { isLoaded, isSignedIn } = useAuth();
>>>>>>> f13aba4 (discountApplication)
=======
>>>>>>> 185fb92 (mywork)
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    } else if (isLoaded && !isSignedIn) {
      router.push("/(modals)/login");
    }
  }, [isLoaded, isSignedIn]);
  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 185fb92 (mywork)
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {!isSignedIn && (
          <Stack.Screen
            name="(modals)/login"
            options={{
              title: "Log In ",
              headerTitleStyle: {
                fontFamily: "mon-sb",
              },
              presentation: "modal",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="close-outline" size={28}></Ionicons>
                </TouchableOpacity>
              ),
            }}
          />
        )}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="listing/[id]"
          options={{ headerTitle: "", headerTransparent: true }}
        />
        <Stack.Screen
          name="(modals)/filter"
          options={{
            title: "Filter",
            headerTitleStyle: {
              fontFamily: "mon-sb",
            },
            presentation: "modal",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="close-outline"
                  size={28}
                  color={Colors.primary}
                ></Ionicons>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(modals)/register"
          options={{
            title: "Register",
            headerTitleStyle: {
              fontFamily: "mon-sb",
            },
            presentation: "modal",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back-outline"
                  size={28}
                  color={Colors.primary}
                ></Ionicons>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="merchant/[id]"
          options={{
            title: "Add Offer",
            headerTitleStyle: {
              fontFamily: "mon-sb",
            },
            presentation: "modal",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back-outline"
                  size={28}
                  color={Colors.primary}
                ></Ionicons>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="merchant/MerchantTabs"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(modals)/comments"
          options={{
            title: "Comments",
            headerTitleStyle: {
              fontFamily: "mon-sb",
            },
            presentation: "modal",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back-outline"
                  size={28}
                  color={Colors.primary}
                ></Ionicons>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <Stack.Screen />
    </GestureHandlerRootView>
<<<<<<< HEAD
=======
    <Stack>
      <Stack.Screen
        name="(modals)/login"
        options={{
          title: "Log In or Sign Up",
          headerTitleStyle: {
            fontFamily: "mon-sb",
          },
          presentation: "modal",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}></Ionicons>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: "" }} />
    </Stack>
>>>>>>> f13aba4 (discountApplication)
=======
>>>>>>> 185fb92 (mywork)
  );
}
