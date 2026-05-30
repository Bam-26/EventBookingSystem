import { useState } from "react";

// Default payment form values used when creating a new payment
const INITIAL_PAYMENT = {
    paymentType: "",
    referenceBank: "",
    accountNumber: "",
    accountName: "",
};

function PaymentForm({ bookingId, onSubmit, onCancel }) {
    const [payment, setPayment] = useState(INITIAL_PAYMENT);
    const [error, setError] = useState("");

    // Updates the matching payment field based on input name
    const handleChange = (e) => {
        const { name, value } = e.target;

        setPayment({
            ...payment,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensures all required payment fields are filled before submitting
        if (!payment.paymentType) {
            setError("Payment type is required.");
            return;
        }

        if (!payment.referenceBank) {
            setError("Reference bank is required.");
            return;
        }

        if (!payment.accountNumber) {
            setError("Account number is required.");
            return;
        }

        if (!payment.accountName) {
            setError("Account name is required.");
            return;
        }

        setError("");

        // Sends payment data to the parent page for API submission
        onSubmit(bookingId, payment);

        // Clears the payment form after successful submission
        setPayment(INITIAL_PAYMENT);
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded p-4 mt-4 bg-white">
            <h3 className="font-bold text-lg text-blue-600 mb-4">
                Create Payment for Booking ID: {bookingId}
            </h3>

            {error && (
                <p className="text-red-600 mb-3">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                    name="paymentType"
                    value={payment.paymentType}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="">Select Payment Type</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Cash">Cash</option>
                </select>

                <input
                    name="referenceBank"
                    value={payment.referenceBank}
                    onChange={handleChange}
                    placeholder="Reference Bank"
                    className="border p-2 rounded"
                />

                <input
                    name="accountNumber"
                    value={payment.accountNumber}
                    onChange={handleChange}
                    placeholder="Account Number"
                    className="border p-2 rounded"
                />

                <input
                    name="accountName"
                    value={payment.accountName}
                    onChange={handleChange}
                    placeholder="Account Name"
                    className="border p-2 rounded"
                />
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit Payment
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default PaymentForm;