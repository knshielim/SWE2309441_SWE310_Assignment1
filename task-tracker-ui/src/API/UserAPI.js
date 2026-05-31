import axios from "axios";

const API_URL = "http://localhost:5180/api/Users";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch a specific user by ID
export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create a new user
export const addUser = async (user) => {
  try {
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update an existing user
export const editUser = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
