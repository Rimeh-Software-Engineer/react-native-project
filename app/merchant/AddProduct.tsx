import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import Colors from "@/constants/Colors";
import productService from "@/services/productService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  onSubmit: (productData: any) => void;
}

const AddProductForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [previousPrice, setPreviousPrice] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();

    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access photos is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !description ||
      !image ||
      !price ||
      !previousPrice ||
      !category
    ) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (previousPrice <= price) {
      Alert.alert("Previous price should be greater than the new price");

      return;
    }

    const productData = {
      name,
      description,
      image: image,
      previousPrice: parseFloat(previousPrice),
      price: parseFloat(price),
      categoryId: category,
      userId,
    };

    try {
      await productService.addProduct(productData);
      Alert.alert("Product added successfully");
      setName("");
      setDescription("");
      setImage(null);
      setPreviousPrice("");
      setPrice("");
      setCategory("");
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error adding product");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          style={styles.pickImageButton}
          onPress={handlePickImage}
        >
          <Ionicons name="camera-outline" size={48} />
          <Text style={styles.pickImageText}>Pick Image</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Previous Price"
          keyboardType="numeric"
          value={previousPrice}
          onChangeText={setPreviousPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="New Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.input}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickImageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickImageText: {
    marginLeft: 10,
    fontSize: 16,
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
    fontFamily: "mon-sb",
  },
});

export default AddProductForm;
