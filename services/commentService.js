import axios from "axios";

const BASE_URL = "http://192.168.1.24:3000/api";

// Add a new comment
const addComment = async (commentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch comments by listing ID
const getCommentsByListingId = async (listingId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/comments?listingId=${listingId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching comments by listing ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch a comment by ID
const getCommentById = async (commentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching comment by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a comment
const updateComment = async (commentId, commentData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/comments/${commentId}`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a comment
const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Example of fetching a product with its comments
const fetchProductWithComments = async (productId) => {
  try {
    // Fetch the product (assuming you have a productService)
    const productResponse = await axios.get(
      `${BASE_URL}/products/${productId}`
    );
    const product = productResponse.data;

    // Fetch comments for the product
    const commentsResponse = await axios.get(
      `${BASE_URL}/comments?listingId=${productId}`
    );
    const comments = commentsResponse.data;

    return {
      ...product,
      comments,
    };
  } catch (error) {
    console.error(
      "Error fetching product with comments:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  addComment,
  getCommentsByListingId,
  getCommentById,
  updateComment,
  deleteComment,
  fetchProductWithComments,
};
