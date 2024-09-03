import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { animated, useSpring } from "@react-spring/native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import productService from "@/services/productService";
import offerService from "@/services/offerService";
import CustomBottomSheetModal from "./CustomBottomSheetModal";
import Colors from "@/constants/Colors";
import axios from "axios";
import BASE_URL from "@/services/config";
import useGetUserData from "@/hooks/useGetUserData";

interface Comment {
  id: string;
  name: string;
  comment: string;
  pictureUrl: string;
}

interface Props {
  refresh: number;
  category: string;
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
}

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

const AnimatedOfferGift = ({ children }: { children: React.ReactNode }) => {
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

const MerchantListing = ({ refresh, category }: Props) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const listRef = useRef<FlatList>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const userId = useGetUserData();
  console.log(userId);
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products with category:", category);
        setLoading(true);
        /*const data = await productService.getProducts(category);
        console.log("Fetched products:", data);*/

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

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Item", `Are you sure you want to delete item ${id}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log(`Deleting item ${id}`);
            await productService.deleteProduct(id); // Call the delete function
            const updatedItems = products.filter((item) => item.id !== id);
            setProducts(updatedItems); // Update state with the updatedItems
          } catch (error) {
            console.error("Error deleting item:", error);
            Alert.alert(
              "Error deleting item",
              error.message || "An unknown error occurred"
            );
          }
        },
        style: "destructive",
      },
    ]);
  };

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

  const renderRow: ListRenderItem<Product> = ({ item }) => {
    return (
      <TouchableOpacity>
        <Animated.View
          style={styles.listing}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          <Animated.Image source={{ uri: item.image }} style={styles.image} />
          {item.offers.length > 0 ? (
            <View style={styles.offerTagContainer}>
              {item.offers.map((offer) => (
                <AnimatedOfferTag key={offer.id}>
                  {offer.discount}% Off
                </AnimatedOfferTag>
              ))}
            </View>
          ) : (
            item.userId === userId && (
              <Link href={`merchant/${item.id}`} asChild>
                <TouchableOpacity style={styles.giftIconContainer}>
                  <AnimatedOfferGift>
                    <Ionicons name="gift-outline" size={24} />
                  </AnimatedOfferGift>
                </TouchableOpacity>
              </Link>
            )
          )}
          {item.userId === userId && (
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color={"#000"} />
              </TouchableOpacity>
              <Link href={`listing/merchant/${item.id}`} asChild>
                <TouchableOpacity style={styles.roundButton}>
                  <Ionicons name="create-outline" size={24} color={"#000"} />
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => handleViewComments(item)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={"#000"}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.detailsContainer}>
            <Text style={{ fontSize: 16, fontFamily: "mon-sb" }}>
              {item.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={Colors.secondary} />
              <Text style={{ fontFamily: "mon-sb" }}>
                {item.review_scores_rating.toFixed(2)}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: "mon" }}>{item.type}</Text>
          <View style={styles.priceContainer}>
            {item.previousPrice && (
              <Text style={styles.previousPrice}>€ {item.previousPrice}</Text>
            )}
            <Text style={styles.newPrice}>€ {item.price}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={loading ? [] : products}
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
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 3,
    position: "relative",
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
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  iconContainer: {
    position: "absolute",
    right: 30,
    top: 30,
    flexDirection: "column",
    gap: 10,
  },
  roundButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    zIndex: 1,
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

  giftIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default MerchantListing;
