import axios from "axios";

// Base URL for booking API endpoints
const API_URL = "http://localhost:5176/api/booking";

// Retrieves all bookings
export const fetchBookings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Retrieves a booking by its ID
export const fetchBookingById = async (bookingId) => {
  const response = await axios.get(`${API_URL}/${bookingId}`);
  return response.data;
};

// Retrieves bookings created by a specific user
export const fetchBookingsByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// Retrieves bookings linked to a specific event
export const fetchBookingsByEventId = async (eventId) => {
  const response = await axios.get(`${API_URL}/event/${eventId}`);
  return response.data;
};

// Creates a new booking for a user
export const addBooking = async (userId, booking) => {
  const response = await axios.post(`${API_URL}/create/${userId}`, booking);
  return response.data;
};

// Cancels an existing booking
export const cancelBooking = async (bookingId) => {
  const response = await axios.put(`${API_URL}/cancel/${bookingId}`);
  return response.data;
};

// Activates a booking after successful payment
export const activateBooking = async (bookingId) => {
  const response = await axios.put(`${API_URL}/activate/${bookingId}`);
  return response.data;
};

// Deletes a cancelled booking
export const deleteBooking = async (bookingId) => {
  const response = await axios.delete(`${API_URL}/delete/${bookingId}`);
  return response.data;
};