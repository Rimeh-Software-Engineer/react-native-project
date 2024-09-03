import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import offerService from "@/services/offerService";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const AddOfferPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("Product ID:", id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiredDate, setExpiredDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error retrieving user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) {
      setExpiredDate(selectedDate);
    }
  };

  console.log("EXPIRED DATTE", expiredDate);

  const handleSubmit = async () => {
    if (!title || !description || !discount || !expiredDate) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const offerData = {
      title,
      description,
      discount: parseFloat(discount),
      productId: id,
      userId,
      expiredDate: expiredDate.toISOString(),
    };

    console.log("offerData", offerData);

    try {
      await offerService.addOffer(offerData);
      Alert.alert("Offer added successfully");
      setTitle("");
      setDescription("");
      setDiscount("");
      setExpiredDate(new Date());
      router.back();
    } catch (error) {
      console.error("Error adding offer:", error);
      Alert.alert("Error adding offer");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Discount"
        keyboardType="numeric"
        value={discount}
        onChangeText={setDiscount}
      />

      <TouchableOpacity
        onPress={() => setShowEndPicker(true)}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>
          {!expiredDate ? "Select Expiration Date" : expiredDate?.toISOString()}
        </Text>
        <MaterialIcons
          name="calendar-today"
          size={20}
          color="black"
          style={styles.icon}
        />
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={expiredDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Add Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
});

export default AddOfferPage;
