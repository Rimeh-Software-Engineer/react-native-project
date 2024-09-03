import axios from "axios";

<<<<<<< HEAD
const BASE_URL = "http:///192.168.76.173:3000/api";
=======
const BASE_URL = "http://192.168.1.24:3000/api";
>>>>>>> 185fb92 (mywork)

// Add a new product
const addProduct = async (productData) => {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("previousPrice", productData.previousPrice.toString());
  formData.append("price", productData.price.toString());
  formData.append("categoryId", productData.categoryId);
  formData.append("userId", productData.userId);

  if (productData.image) {
    formData.append("image", {
      uri: productData.image,
      name: "image.jpg",
      type: "image/jpeg",
    });
  }

  const response = await axios.post(`${BASE_URL}/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getRecommendations = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recommendations/recommendations/${userId}`
    );
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

// Fetch categories
const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};

// Fetch products
const getProducts = async (category: string) => {
  const response = await axios.get(`${BASE_URL}/products`, {
    params: { category }, // Send category as a query parameter
  });
  return response.data;
};

// Fetch a product by ID
const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Fetch product counts per category
const getCategoryCounts = async () => {
  const response = await axios.get(`${BASE_URL}/categories/counts`);
  return response.data;
};

// Delete a product
const deleteProduct = async (productId: string) => {
  const response = await axios.delete(`${BASE_URL}/products/${productId}`);
  return response.data;
};

// Update a product
const updateProduct = async (productId, productData) => {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("previousPrice", productData.previousPrice.toString());
  formData.append("price", productData.price.toString());
  formData.append("categoryName", productData.categoryName); // Send category name

  if (productData.image) {
    formData.append("image", {
      uri: productData.image,
      name: "image.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  addProduct,
  getCategories,
  getProducts,
  getCategoryCounts,
  deleteProduct,
  updateProduct,
  getProductById,
  getRecommendations,
};
