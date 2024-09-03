<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect, useState, useRef, useCallback } from "react";
=======
import React, { useEffect, useState, useRef } from "react";
>>>>>>> f13aba4 (discountApplication)
=======
import React, { useEffect, useState, useRef, useCallback } from "react";
>>>>>>> 185fb92 (mywork)
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
<<<<<<< HEAD
<<<<<<< HEAD
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { animated, useSpring } from "@react-spring/native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import productService from "@/services/productService";
import CustomBottomSheetModal from "./CustomBottomSheetModal";
import offerService from "@/services/offerService";
import axios from "axios";
import Colors from "@/constants/Colors";
import RatingSubmission from "./RatingSubmission";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

interface Comment {
  id: string;
  name: string;
  comment: string;
  pictureUrl: string;
}

interface Props {
  refresh: number;
  category: string;
  isSorted: boolean;
  isSortedLogic: boolean;
  onResetIsSortedLogic: () => void;
}

interface Product {
  id: string;
  image: string;
  name: string;
  review_scores_rating: number;
  type: string;
  previousPrice?: number;
  price: number;
  offers: Offer[];
  ratings: {
    userId: string;
    rating: number;
  }[];
}

// AnimatedText component to handle offer tag animation
const AnimatedOfferTag = ({ children }: { children: React.ReactNode }) => {
  const [props, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    loop: { reverse: true },
  }));

  return (
    <animated.View
      style={[
        props,
        {
          backgroundColor: Colors.primary,
          padding: 5,
          borderRadius: 5,
          marginRight: 5,
        },
      ]}
    >
      <Text style={styles.offerText}>{children}</Text>
    </animated.View>
  );
};

const Listing = ({
  refresh,
  category,
  isSorted = false,
  isSortedLogic,
  onResetSortedLogic,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const listRef = useRef<FlatList>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>(
    []
  );

  const sortedProducts = isSortedLogic
    ? [...products].sort((a, b) => a.price - b.price)
    : products;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          fetchRecommendations(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchRecommendations = async (userId: string) => {
    try {
      const recommendations = await productService.getRecommendations(userId);
      console.log("Recommendations fetched:", recommendations);

      // Transform item_id to the correct productId
      const transformedRecommendations = recommendations.map(
        (rec) => rec.item_id
      );
      console.log("Transformed Recommendations:", transformedRecommendations);

      setRecommendedProductIds(transformedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products with category:", category);
        setLoading(true);
        //const data = await productService.getProducts(category);
        const data = await offerService.fetchProductsWithOffers(category);
        console.log("Fetched products:", data);

        if (!Array.isArray(data)) {
          console.error("Expected an array of products but received:", data);
          throw new Error("Invalid data format");
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert(
          "Error fetching products",
          error.message || "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refresh, category]);

  const refreshProduct = useCallback(
    async (productId) => {
      try {
        // Re-fetch the products or refresh the list in your state
        setLoading(true);
        const data = await offerService.fetchProductsWithOffers(category);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error refreshing products:", error);
        Alert.alert(
          "Error refreshing products",
          error.message || "An unknown error occurred"
        );
        setLoading(false);
      }
    },
    [category]
  );

  const handleViewComments = useCallback(async (product: Product) => {
    console.log("Fetching comments for listing ID:", product.id);
    setSelectedProduct(product);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/comments/${product.id}`
      );
      console.log("Comments response data:", response.data);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }

    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 100);
  }, []);

  const renderRow: ListRenderItem<Product> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={styles.listingWrapper} // Use a wrapper for layout animations
        >
=======
  Image,
=======
>>>>>>> 185fb92 (mywork)
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { animated, useSpring } from "@react-spring/native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import productService from "@/services/productService";
import CustomBottomSheetModal from "./CustomBottomSheetModal";
import offerService from "@/services/offerService";
import axios from "axios";
import Colors from "@/constants/Colors";
import RatingSubmission from "./RatingSubmission";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

interface Comment {
  id: string;
  name: string;
  comment: string;
  pictureUrl: string;
}

interface Props {
  refresh: number;
  category: string;
  isSorted: boolean;
  isSortedLogic: boolean;
  onResetIsSortedLogic: () => void;
}

interface Product {
  id: string;
  image: string;
  name: string;
  review_scores_rating: number;
  type: string;
  previousPrice?: number;
  price: number;
  offers: Offer[];
  ratings: {
    userId: string;
    rating: number;
  }[];
}

// AnimatedText component to handle offer tag animation
const AnimatedOfferTag = ({ children }: { children: React.ReactNode }) => {
  const [props, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    loop: { reverse: true },
  }));

  return (
    <animated.View
      style={[
        props,
        {
          backgroundColor: Colors.primary,
          padding: 5,
          borderRadius: 5,
          marginRight: 5,
        },
      ]}
    >
      <Text style={styles.offerText}>{children}</Text>
    </animated.View>
  );
};

const Listing = ({
  refresh,
  category,
  isSorted = false,
  isSortedLogic,
  onResetSortedLogic,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const listRef = useRef<FlatList>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>(
    []
  );

  const sortedProducts = isSortedLogic
    ? [...products].sort((a, b) => a.price - b.price)
    : products;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          fetchRecommendations(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchRecommendations = async (userId: string) => {
    try {
      const recommendations = await productService.getRecommendations(userId);
      console.log("Recommendations fetched:", recommendations);

      // Transform item_id to the correct productId
      const transformedRecommendations = recommendations.map(
        (rec) => rec.item_id
      );
      console.log("Transformed Recommendations:", transformedRecommendations);

      setRecommendedProductIds(transformedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

<<<<<<< HEAD
  const renderRow: ListRenderItem<any> = ({ item }) => {
    return (
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
>>>>>>> f13aba4 (discountApplication)
=======
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products with category:", category);
        setLoading(true);
        //const data = await productService.getProducts(category);
        const data = await offerService.fetchProductsWithOffers(category);
        console.log("Fetched products:", data);

        if (!Array.isArray(data)) {
          console.error("Expected an array of products but received:", data);
          throw new Error("Invalid data format");
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert(
          "Error fetching products",
          error.message || "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refresh, category]);

  const refreshProduct = useCallback(
    async (productId) => {
      try {
        // Re-fetch the products or refresh the list in your state
        setLoading(true);
        const data = await offerService.fetchProductsWithOffers(category);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error refreshing products:", error);
        Alert.alert(
          "Error refreshing products",
          error.message || "An unknown error occurred"
        );
        setLoading(false);
      }
    },
    [category]
  );

  const handleViewComments = useCallback(async (product: Product) => {
    console.log("Fetching comments for listing ID:", product.id);
    setSelectedProduct(product);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/comments/${product.id}`
      );
      console.log("Comments response data:", response.data);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }

    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 100);
  }, []);

  const renderRow: ListRenderItem<Product> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={styles.listingWrapper} // Use a wrapper for layout animations
        >
>>>>>>> 185fb92 (mywork)
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 185fb92 (mywork)
            <Animated.Image source={{ uri: item.image }} style={styles.image} />
            {item.offers.length > 0 && (
              <View style={styles.offerTagContainer}>
                {item.offers.map((offer) => (
                  <AnimatedOfferTag key={offer.id}>
                    {offer.discount}% Off
                  </AnimatedOfferTag>
                ))}
              </View>
            )}
            {recommendedProductIds.includes(item.id) && (
              <View style={styles.recommendedTagContainer}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
<<<<<<< HEAD
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleViewComments(item)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={25}
                color={"#000"}
              />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={{ fontSize: 16, fontFamily: "mon-sb" }}>
                {item.name}
              </Text>
              <View style={styles.twoRateContainer}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.secondary} />
                  <Text style={{ fontFamily: "mon-sb" }}>
                    {item.review_scores_rating.toFixed(2)}
                  </Text>
                </View>
                {userId && (
                  <View style={styles.rateAddContainer}>
                    <RatingSubmission
                      productId={item.id}
                      userId={userId} // Pass the actual user ID
                      refreshProduct={() => refreshProduct(item.id)}
                    />
                  </View>
                )}
              </View>
            </View>

            <Text style={{ fontFamily: "mon" }}>{item.type}</Text>
            <View style={styles.priceContainer}>
              {item.previousPrice && (
                <Text style={styles.previousPrice}>
                  {item.previousPrice} dt
                </Text>
              )}
              <Text style={styles.newPrice}>{item.price} dt</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={loading ? [] : sortedProducts}
        ref={listRef}
        renderItem={renderRow}
      />
      {selectedProduct && (
        <CustomBottomSheetModal
          ref={bottomSheetModalRef}
          listing={selectedProduct}
          comments={comments}
          setComments={setComments}
        />
      )}
=======
            <Image source={{ uri: item.medium_url }} style={styles.image} />
=======
>>>>>>> 185fb92 (mywork)
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleViewComments(item)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={25}
                color={"#000"}
              />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={{ fontSize: 16, fontFamily: "mon-sb" }}>
                {item.name}
              </Text>
              <View style={styles.twoRateContainer}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.secondary} />
                  <Text style={{ fontFamily: "mon-sb" }}>
                    {item.review_scores_rating.toFixed(2)}
                  </Text>
                </View>
                {userId && (
                  <View style={styles.rateAddContainer}>
                    <RatingSubmission
                      productId={item.id}
                      userId={userId} // Pass the actual user ID
                      refreshProduct={() => refreshProduct(item.id)}
                    />
                  </View>
                )}
              </View>
            </View>

            <Text style={{ fontFamily: "mon" }}>{item.type}</Text>
            <View style={styles.priceContainer}>
              {item.previousPrice && (
                <Text style={styles.previousPrice}>
                  {item.previousPrice} dt
                </Text>
              )}
              <Text style={styles.newPrice}>{item.price} dt</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={loading ? [] : sortedProducts}
        ref={listRef}
        renderItem={renderRow}
      />
<<<<<<< HEAD
>>>>>>> f13aba4 (discountApplication)
=======
      {selectedProduct && (
        <CustomBottomSheetModal
          ref={bottomSheetModalRef}
          listing={selectedProduct}
          comments={comments}
          setComments={setComments}
        />
      )}
>>>>>>> 185fb92 (mywork)
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 185fb92 (mywork)
  container: {
    flex: 1,
  },
  listingWrapper: {
    // Wrapper style for layout animations
  },
<<<<<<< HEAD
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 3,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  twoRateContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "flex-end", // Aligns items to the right
    flex: 1,
  },

  rateAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  previousPrice: {
    textDecorationLine: "line-through",
    color: "red",
    fontFamily: "mon-sb",
  },
  newPrice: {
    fontSize: 16,
    fontFamily: "mon-sb",
    color: "green",
  },
  chatButton: {
    position: "absolute",
    right: 30,
    top: 30,
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  offerTagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  offerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  recommendedTagContainer: {
    position: "absolute",
    top: 1,
    right: 5,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    padding: 5,
  },
  recommendedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

=======
=======
>>>>>>> 185fb92 (mywork)
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 3,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  twoRateContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "flex-end", // Aligns items to the right
    flex: 1,
  },

  rateAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  previousPrice: {
    textDecorationLine: "line-through",
    color: "red",
    fontFamily: "mon-sb",
  },
  newPrice: {
    fontSize: 16,
    fontFamily: "mon-sb",
    color: "green",
  },
  chatButton: {
    position: "absolute",
    right: 30,
    top: 30,
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  offerTagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  offerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  recommendedTagContainer: {
    position: "absolute",
    top: 1,
    right: 5,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    padding: 5,
  },
  recommendedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
<<<<<<< HEAD
>>>>>>> f13aba4 (discountApplication)
=======

>>>>>>> 185fb92 (mywork)
export default Listing;
