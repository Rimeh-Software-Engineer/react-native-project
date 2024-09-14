import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { animated, useSpring } from "@react-spring/native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import * as Haptics from "expo-haptics";
import useBasketMarket from "@/maket/basketMarket";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import productService from "@/services/productService";
import offerService from "@/services/offerService";
import commentService from "@/services/commentService";
import userService from "@/services/userService";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const getFirstLetter = (name) => {
  return name ? name.charAt(0).toUpperCase() : "";
};

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  console.log("Fetched ID:", id);
  const [listing, setListing] = useState(null);
  const [offer, setOffer] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [merchant, setMerchant] = useState(null);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const bottomSheetRef = useRef(null);

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
            backgroundColor: Colors.white,
            borderRadius: 5,
          },
        ]}
      >
        <Text style={styles.offerText}>{children}</Text>
      </animated.View>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product listing
        const productData = await productService.getProductById(id);
        setListing(productData);

        // Fetch all offers and filter for the current product
        const allOffers = await offerService.getOffers();
        const productOffers = allOffers.filter(
          (offer) => offer.productId === id
        );

        setOffer(productOffers);

        // Fetch merchant details
        if (productData && productData.userId) {
          const merchantData = await userService.getUserById(
            productData.userId
          );
          console.log("Fetched merchant data:", merchantData); // Log to check data
          setMerchant(merchantData);
        }

        // Fetch comments for the product
        const comments = await commentService.getCommentsByListingId(id);
        setCommentsCount(comments.length); // Set comments count
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data.");
      }
    };

    fetchData();
  }, [id]);

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing?.name || "Product",
        url: listing?.image,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}
        ></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);
  const addProduct = useBasketMarket((state) => state.addProduct);
  const addTocart = () => {
    addProduct({
      id: listing.id,
      name: listing.name,
      price: listing.price,
      info: listing.description,
      img: listing.image,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          ref={scrollRef}
          scrollEventThrottle={16}
        >
          {listing && (
            <Animated.Image
              source={{ uri: listing.image }}
              style={[styles.image, imageAnimatedStyle]}
              resizeMode="cover"
            />
          )}

          <View style={styles.infoContainer}>
            {listing ? (
              <>
                <Text style={styles.name}>{listing.name}</Text>

                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons
                      name="star"
                      color={Colors.secondary}
                      size={20}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.ratings}>
                      {listing.review_scores_rating
                        ? listing.review_scores_rating
                        : "N/A"}
                    </Text>
                  </View>

                  {/* <Text style={styles.comments}>{commentsCount} Comments</Text> */}
                </View>
                <View style={styles.divider} />

                {offer.length > 0 && (
                  <View>
                    {offer.map((offer) => (
                      <View key={offer._id}>
                        <AnimatedOfferTag>
                          <Text
                            style={[
                              {
                                fontWeight: "500",
                                fontSize: 16,
                                fontFamily: "mon-sb",
                              },
                            ]}
                          >
                            Do Not miss the Offer !
                          </Text>
                        </AnimatedOfferTag>
                        <Text
                          style={[
                            {
                              fontWeight: "500",
                              fontSize: 16,
                              fontFamily: "mon-sb",
                            },
                          ]}
                        >
                          {offer.title}
                        </Text>

                        <Text>{offer.description}</Text>

                        <Text>
                          <Text>Valid Until</Text>{" "}
                          <Text style={{ color: Colors.secondary }}>
                            {new Date(offer.end_time).toLocaleDateString()}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.divider} />

                <View style={styles.hostView}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {merchant && getFirstLetter(merchant.name)}
                    </Text>
                  </View>

                  <View>
                    {merchant && (
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          fontFamily: "mon-sb",
                        }}
                      >
                        Posted by {merchant.name}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.description}>{listing.description}</Text>
                <Text style={styles.featureItem}>
                  {(listing.features || []).join(", ")}
                </Text>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </Animated.ScrollView>

        <Animated.View
          style={defaultStyles.footer}
          entering={SlideInDown.delay(200)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.footerText}>
              <Text style={styles.footerPrice}>
                {listing ? `${listing.price}dt` : "Loading..."}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}
              onPress={addTocart}
            >
              <Text style={defaultStyles.btnText}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <CustomBottomSheetModal ref={bottomSheetRef} />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
    fontFamily: "mon-sb",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  typePro: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
  },
  summaryPro: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: "mon",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  comments: {
    fontSize: 14,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    fontFamily: "mon-sb",
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  featureItem: {
    fontSize: 16,
    fontFamily: "mon",
    marginBottom: 5,
    color: "#FF3939", // Set the color to red
  },
  offerTagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  offerTag: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  offerText: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
  },
  offerMessageContainer: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  offerMessageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetailsPage;
