import axios from "axios";
import productService from "@/services/productService";

const BASE_URL = "http://192.168.1.24:3000/api";

// Add a new offer
const addOffer = async (offerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/offers`, offerData);
    return response.data;
  } catch (error) {
    console.error("Error adding offer:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch all offers
const getOffers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/offers`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching offers:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch an offer by ID with product and user details
const getOfferById = async (offerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/offers/${offerId}`);
    const offer = response.data;

    // Fetch the product and user details
    const productResponse = await axios.get(
      `${BASE_URL}/products/${offer.productId}`
    );
    const userResponse = await axios.get(`${BASE_URL}/users/${offer.userId}`);

    return {
      ...offer,
      product: productResponse.data,
      user: userResponse.data,
    };
  } catch (error) {
    console.error(
      "Error fetching offer by ID with product and user details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update an offer
const updateOffer = async (offerId, offerData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/offers/${offerId}`,
      offerData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating offer:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete an offer
const deleteOffer = async (offerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/offers/${offerId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting offer:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchProductsWithOffers = async (category) => {
  try {
    const productsData = await productService.getProducts(category);
    const response = await axios.get(`${BASE_URL}/offers`);

    // Adjust based on the actual structure of response.data
    const offersData = response.data.offers || response.data; // Adjust based on actual structure

    // Check if offersData is an array
    if (!Array.isArray(offersData)) {
      console.error(
        "Expected offersData to be an array but received:",
        offersData
      );
      throw new Error("Invalid data format");
    }

    const productsWithOffers = productsData.map((product) => {
      const offers = offersData.filter(
        (offer) => offer.productId === product.id
      );
      return {
        ...product,
        offers,
      };
    });

    return productsWithOffers;
  } catch (error) {
    console.error("Error fetching products or offers:", error);
    throw error;
  }
};

export default {
  addOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  fetchProductsWithOffers,
};
