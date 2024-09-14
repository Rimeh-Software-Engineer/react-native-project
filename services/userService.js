import axios from "axios";

<<<<<<< HEAD
<<<<<<< HEAD
const BASE_URL = "http:///192.168.76.173:3000/api/users";
=======
const BASE_URL = "http://192.168.1.24:3000/api/users";
>>>>>>> 185fb92 (mywork)
=======
const BASE_URL = "http:///192.168.76.173:3000/api/users";
>>>>>>> d3478e5 (initial commit)

// Fetch all users
const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch a user by ID
const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Update a user
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
