import axios from "axios";

// Base URL for payment API endpoints
const API_URL = "http://localhost:5176/api/payment";

// Retrieves all payments
export const fetchPayments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Retrieves a payment by its ID
export const fetchPaymentById = async (paymentId) => {
  const response = await axios.get(`${API_URL}/${paymentId}`);
  return response.data;
};

// Retrieves the payment linked to a specific booking
export const fetchPaymentByBookingId = async (bookingId) => {
  const response = await axios.get(`${API_URL}/booking/${bookingId}`);
  return response.data;
};

// Retrieves payments that belong to a specific user
export const fetchPaymentsByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// Creates a payment for a booking
export const addPayment = async (bookingId, payment) => {
  const response = await axios.post(`${API_URL}/create/${bookingId}`, payment);
  return response.data;
};

// Marks a pending payment as paid
export const markPaymentAsPaid = async (paymentId) => {
  const response = await axios.put(`${API_URL}/paid/${paymentId}`);
  return response.data;
};

// Marks a pending payment as failed
export const markPaymentAsFailed = async (paymentId) => {
  const response = await axios.put(`${API_URL}/failed/${paymentId}`);
  return response.data;
};

// Refunds a paid payment
export const refundPayment = async (paymentId) => {
  const response = await axios.put(`${API_URL}/refund/${paymentId}`);
  return response.data;
};

// Deletes a payment record
export const deletePayment = async (paymentId) => {
  const response = await axios.delete(`${API_URL}/delete/${paymentId}`);
  return response.data;
};