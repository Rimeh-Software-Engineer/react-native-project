import React, { useState, useEffect } from "react";
import { View, Button, Alert, TextInput, StyleSheet } from "react-native";
import Colors from "@/constants/Colors"; // Ensure Colors is imported correctly
import axios from "axios";
import BASE_URL from "@/services/config";

const RatingSubmission = ({ productId, userId, refreshProduct }) => {
  const [rating, setRating] = useState("");
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    const fetchExistingRating = async () => {
      console.log(
        "RATING URL: ",
        `${BASE_URL}/api/products/${productId}/rating/${userId}`
      );
      try {
        const response = await axios.get(
          `${BASE_URL}/api/products/${productId}/rating/${userId}`
        );
        if (response.data) {
          setExistingRating(response.data.rating);
          setRating(response.data.rating.toString());
        }
      } catch (error) {
        console.error("Error fetching existing rating:", error);
      }
    };

    fetchExistingRating();
  }, [productId, userId]);

  const submitRating = async () => {
    const numericRating = parseInt(rating, 10);
    if (numericRating >= 1 && numericRating <= 5) {
      try {
        if (existingRating !== null) {
          // Update existing rating
          await axios.post(`${BASE_URL}/api/products/${productId}/rate`, {
            userId,
            rating: numericRating,
          });
        } else {
          // Create new rating
          await axios.post(`${BASE_URL}/api/products/${productId}/rate`, {
            userId,
            rating: numericRating,
          });
        }
        Alert.alert("Rating submitted successfully");
        refreshProduct();
      } catch (error) {
        console.error("Error submitting rating:", error);
        Alert.alert("Error submitting rating", error.message);
      }
    } else {
      Alert.alert("Invalid Rating", "Please enter a number between 1 and 5");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your rating (1-5)"
        value={rating}
        onChangeText={(text) => setRating(text.replace(/[^1-5]/g, ""))} // Restrict input to 1-5
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        title="Please Rate"
        onPress={submitRating}
        color={Colors.primary} // Set button color to primary color
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default RatingSubmission;
