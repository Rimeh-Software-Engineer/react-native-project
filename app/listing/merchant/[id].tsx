import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import productService from "services/productService";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const ProductDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [listing, setListing] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [previousPrice, setPreviousPrice] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const product = await productService.getProductById(id);
        if (product) {
          setListing(product);
          setName(product.name);
          setPreviousPrice(String(product.previousPrice || product.price));
          setPrice(String(product.price));
          setDescription(product.description);
          setImage(product.image);
          setSelectedCategory(product.categoryId); // Ensure category ID is set
        } else {
          Alert.alert("Error", "Product not found.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Error", "Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProductDetails();
    fetchCategories();

    navigation.setOptions({
      headerTitle: "Product Details",
      headerRight: () => null,
    });
  }, [id, navigation]);

  useEffect(() => {
    if (listing && categories.length > 0) {
      const matchedCategory = categories.find(
        (cat) => cat._id === listing.categoryId
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory._id);
      }
    }
  }, [listing, categories]);

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

  const handleSaveChanges = async () => {
    if (!listing) {
      Alert.alert("Error", "No product data available.");
      return;
    }

    if (!name || !description || !price || !selectedCategory) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const category = categories.find((cat) => cat._id === selectedCategory);
    if (!category) {
      Alert.alert("Error", "Selected category is invalid.");
      return;
    }

    const updatedProduct = {
      ...listing,
      name,
      previousPrice: parseFloat(previousPrice),
      price: parseFloat(price),
      description,
      image,
      categoryId: selectedCategory,
      categoryName: category.name,
    };

    try {
      const result = await productService.updateProduct(id, updatedProduct);
      setListing(result); // Update the state with the updated product
      Alert.alert("Changes Saved", "Product details have been updated.", [
        {
          text: "OK",
          onPress: () => {
            console.log("Navigating to MerchantListing");
            navigation.navigate("MerchantHomePage");
          },
        },
      ]);
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to update product details.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <ScrollView style={styles.container}>
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
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select a Category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ProductDetailsPage;
