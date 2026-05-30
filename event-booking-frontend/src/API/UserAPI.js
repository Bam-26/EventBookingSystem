import axios from "axios";

// Base URL for user API endpoints
const API_URL = "http://localhost:5176/api/user";

// Retrieves a user by its ID
export const fetchUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

// Registers a new user account
export const registerUser = async (user) => {
  const response = await axios.post(`${API_URL}/register`, user);
  return response.data;
};

// Logs in using username or email and password
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data;
};

// Updates user profile information
export const editUser = async (userId, user) => {
  const response = await axios.put(`${API_URL}/update/${userId}`, user);
  return response.data;
};

// Deletes a user account
export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/delete/${userId}`);
  return response.data;
};