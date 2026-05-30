import axios from "axios";

// Base URL for event API endpoints
const API_URL = "http://localhost:5176/api/events";

// Retrieves all events
export const fetchEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Retrieves an event by its ID
export const fetchEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};

// Creates a new event for a user
export const addEvent = async (userId, event) => {
  const response = await axios.post(`${API_URL}/create/${userId}`, event);
  return response.data;
};

// Updates an existing event
export const editEvent = async (eventId, event) => {
  const response = await axios.put(`${API_URL}/update/${eventId}`, event);
  return response.data;
};

// Cancels an open event
export const cancelEvent = async (eventId) => {
  const response = await axios.put(`${API_URL}/cancel/${eventId}`);
  return response.data;
};

// Closes an event to prevent new bookings
export const closeEvent = async (eventId) => {
  const response = await axios.put(`${API_URL}/close/${eventId}`);
  return response.data;
};

// Deletes a cancelled event
export const deleteEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/delete/${eventId}`);
  return response.data;
};