import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBookingById, fetchBookingsByUserId } from "../API/BookingAPI";
import { fetchEvents } from "../API/EventAPI";
import {
    addPayment,
    fetchPaymentsByUserId,
    markPaymentAsPaid,
    markPaymentAsFailed,
    refundPayment
} from "../API/PaymentAPI";

import PaymentActionMenu from "../components/PaymentActionMenu";
import PaymentForm from "../components/PaymentForm";

function PaymentsPage({ currentUser }) {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    // Opens the create payment section when bookingId is passed from the booking page
    const [activeSection, setActiveSection] = useState(
        bookingId ? "pay" : "all"
    );
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const userId = currentUser.userId;
    const [pendingBookings, setPendingBookings] = useState([]);
    const [selectedPaymentBookingId, setSelectedPaymentBookingId] = useState(
        bookingId ? Number(bookingId) : null
    );
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const [payments, setPayments] = useState([]);
    // Stores confirmation modal data for payment status actions
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "",
        actionType: "",
        paymentId: null,
    });


    // Creates a payment for the selected pending booking
    const handleCreatePayment = async (bookingId, payment) => {
        try {
            await addPayment(bookingId, payment);
            setMessage("Payment created successfully. Payment status is pending.");
            setSelectedPaymentBookingId(null);
            loadPaymentPageData();
        } catch (error) {
            setMessage("Failed to create payment. Payment may already exist or payment type is invalid.");
            console.error(error);
        }
    };

    // Shows the payment form for the selected booking
    const handleShowPaymentForm = (bookingId) => {
        setSelectedPaymentBookingId(bookingId);
    };

    // Hides the payment form without creating payment
    const handleCancelPaymentForm = () => {
        setSelectedPaymentBookingId(null);
    };


    // Loads bookings, payments, and events used by the payment page
    const loadPaymentPageData = async () => {
        try {
            setIsLoading(true);

            const bookingResult = await fetchBookingsByUserId(userId);
            const paymentResult = await fetchPaymentsByUserId(userId);
            const eventResult = await fetchEvents();

            const paymentsBookingIds = paymentResult.data.map(
                (payment) => Number(payment.bookingId)
            );

            const pendingWithoutPayment = bookingResult.data.filter(
                (booking) =>
                    booking.status === "Pending" &&
                    !paymentsBookingIds.includes(Number(booking.bookingId))
            );

            setBookings(bookingResult.data);
            setPendingBookings(pendingWithoutPayment);
            setPayments(paymentResult.data);
            setEvents(eventResult.data);

            if (bookingId) {
                const selectedResult = await fetchBookingById(bookingId);

                const alreadyHasPayment = paymentsBookingIds.includes(
                    Number(selectedResult.data.bookingId)
                );

                if (
                    selectedResult.data.status === "Pending" &&
                    !alreadyHasPayment
                ) {
                    setSelectedBooking(selectedResult.data);
                } else {
                    setSelectedBooking(null);
                }
            }

            setMessage("");
        } catch (error) {
            setMessage("Failed to load payment data.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    // Finds booking data linked to a payment
    const getBookingById = (bookingId) => {
        return bookings.find(
            (booking) => Number(booking.bookingId) === Number(bookingId)
        );
    };

    // Finds event data linked to a booking
    const getEventById = (eventId) => {
        return events.find(
            (event) => Number(event.eventId) === Number(eventId)
        );
    };

    // Gets event title displayed on each payment card
    const getEventTitleByPayment = (payment) => {
        const booking = getBookingById(payment.bookingId);
        const event = booking ? getEventById(booking.eventId) : null;

        return event ? event.title : "Event Payment";
    };

    // Gets booking code displayed on each payment card
    const getBookingCodeByPayment = (payment) => {
        const booking = getBookingById(payment.bookingId);

        return booking ? booking.bookingCode : "-";
    };

    // Filters payments based on selected payment status
    const getPaymentsByStatus = (status) => {
        return payments.filter((payment) => payment.status === status);
    };

    // Checks whether a booking already has a payment
    const getPaymentByBookingId = (bookingId) => {
        return payments.find((payment) => payment.bookingId === bookingId);
    };

    // Opens confirmation modal before marking payment as paid
    const handleMarkAsPaid = (paymentId) => {
        openConfirmModal({
            title: "Mark Payment As Paid",
            message: "Are you sure this payment has been paid? This will activate the related booking.",
            confirmText: "Mark As Paid",
            actionType: "paid",
            paymentId,
        });
    };

    // Opens confirmation modal before marking payment as failed
    const handleMarkAsFailed = (paymentId) => {
        openConfirmModal({
            title: "Mark this payment as failed?",
            message: "This will cancel the related booking and return the ticket to the event availability.",
            confirmText: "Mark As Failed",
            actionType: "failed",
            paymentId,
        });
    };


    // Stores existing payment for the selected booking when available
    const selectedBookingPayment = selectedBooking
        ? getPaymentByBookingId(selectedBooking.bookingId)
        : null;

    useEffect(() => {
        loadPaymentPageData();
    }, [bookingId]);


    // Formats backend date values to show only the date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
    };

    // Returns badge color based on payment status
    const getPaymentBadgeClass = (status) => {
        if (status === "Pending") {
            return "bg-[#F59E0B]";
        }

        if (status === "Paid") {
            return "bg-[#10B981]";
        }

        if (status === "Failed") {
            return "bg-[#EF4444]";
        }

        if (status === "Refunded") {
            return "bg-[#6366F1]";
        }

        return "bg-[#6B7280]";
    };

    // Renders a reusable payment card for each payment section
    const renderPaymentCard = (payment, showPendingActions = false, showRefundAction = false) => (
        <div
            key={payment.paymentId}
            className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
        >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <h3 className="font-bold text-xl text-[#111827] mb-3">
                        {getEventTitleByPayment(payment)}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#6B7280]">
                        <p>
                            <span className="font-medium text-[#111827]">Booking Code:</span>{" "}
                            {getBookingCodeByPayment(payment)}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Total Price:</span>{" "}
                            RM {payment.totalPrice}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Payment Type:</span>{" "}
                            {payment.paymentType}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Reference Bank:</span>{" "}
                            {payment.referenceBank}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Account Number:</span>{" "}
                            {payment.accountNumber}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Account Name:</span>{" "}
                            {payment.accountName}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Payment Date:</span>{" "}
                            {formatDate(payment.createdAt)}
                        </p>

                        {payment.status === "Paid" && (
                            <p>
                                <span className="font-medium text-[#111827]">Paid Date:</span>{" "}
                                {formatDate(payment.paidAt)}
                            </p>
                        )}

                        {payment.status === "Failed" && (
                            <p>
                                <span className="font-medium text-[#111827]">Failed Date:</span>{" "}
                                {formatDate(payment.failedAt)}
                            </p>
                        )}

                        {payment.status === "Refunded" && (
                            <p>
                                <span className="font-medium text-[#111827]">Refunded Date:</span>{" "}
                                {formatDate(payment.refundedAt)}
                            </p>
                        )}
                    </div>
                </div>

                <span
                    className={`${getPaymentBadgeClass(payment.status)} h-fit text-white text-xs px-3 py-1 rounded-full font-medium`}
                >
                    {payment.status}
                </span>
            </div>

            {showPendingActions && payment.status === "Pending" && (
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => handleMarkAsPaid(payment.paymentId)}
                        className="bg-[#10B981] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                    >
                        Mark As Paid
                    </button>

                    <button
                        onClick={() => handleMarkAsFailed(payment.paymentId)}
                        className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                    >
                        Mark As Failed
                    </button>
                </div>
            )}

            {showRefundAction && payment.status === "Paid" && (
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => handleRefundPayment(payment.paymentId)}
                        className="bg-[#F59E0B] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                    >
                        Refund Payment
                    </button>
                </div>
            )}
        </div>
    );

    // Renders pending booking card that can create a payment
    const renderBookingPaymentCard = (booking) => {
        return (
            <div
                key={booking.bookingId}
                className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
            >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-[#111827] mb-3">
                            {getEventTitleByBooking(booking)}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#6B7280]">
                            <p>
                                <span className="font-medium text-[#111827]">Booking Code:</span>{" "}
                                {booking.bookingCode}
                            </p>

                            <p>
                                <span className="font-medium text-[#111827]">Booking Date:</span>{" "}
                                {formatDate(booking.createdAt)}
                            </p>

                            <p>
                                <span className="font-medium text-[#111827]">Quantity:</span>{" "}
                                {booking.quantity}
                            </p>

                            <p>
                                <span className="font-medium text-[#111827]">Total Price:</span>{" "}
                                RM {(Number(booking.ticketPrice) * Number(booking.quantity)).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <span className="h-fit bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-medium">
                        {booking.status}
                    </span>
                </div>

                <button
                    onClick={() => handleShowPaymentForm(booking.bookingId)}
                    className="mt-5 bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                >
                    Create Payment
                </button>

                {selectedPaymentBookingId === booking.bookingId && (
                    <PaymentForm
                        bookingId={booking.bookingId}
                        onSubmit={handleCreatePayment}
                        onCancel={handleCancelPaymentForm}
                    />
                )}
            </div>
        );
    };

    // Opens confirmation modal with dynamic payment action details
    const openConfirmModal = ({ title, message, confirmText, actionType, paymentId }) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            confirmText,
            actionType,
            paymentId,
        });
    };

    // Resets and closes the confirmation modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            confirmText: "",
            actionType: "",
            paymentId: null,
        });
    };

    // Opens confirmation modal before refunding a paid payment
    const handleRefundPayment = (paymentId) => {
        openConfirmModal({
            title: "Refund Payment",
            message: "This will move the payment to refunded status. You can still view it in Refunded Payments.",
            confirmText: "Refund Payment",
            actionType: "refund",
            paymentId,
        });
    };

    // Confirms paid, failed, or refund action and refreshes payment data
    const handleConfirmAction = async () => {
        try {
            if (confirmModal.actionType === "paid") {
                await markPaymentAsPaid(confirmModal.paymentId);
                setMessage("Payment marked as paid successfully.");
            }

            if (confirmModal.actionType === "failed") {
                await markPaymentAsFailed(confirmModal.paymentId);
                setMessage("Payment marked as failed successfully.");
            }
            if (confirmModal.actionType === "refund") {
                await refundPayment(confirmModal.paymentId);
                setMessage("Payment refunded successfully.");
            }
            closeConfirmModal();
            loadPaymentPageData();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message || "Action failed. Please try again.";

            setMessage(backendMessage);
            console.error(error);
            closeConfirmModal();
        }
    };
    // Gets event title displayed on booking payment cards
    const getEventTitleByBooking = (booking) => {
        const event = getEventById(booking.eventId);

        return event ? event.title : "Unknown Event";
    };
    // Calculates total price from booking ticket price and quantity
    const calculateBookingTotalPrice = (booking) => {
        return Number(booking.ticketPrice) * Number(booking.quantity);
    };
    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#111827] mb-2">
                        Payments
                    </h1>

                    <p className="text-sm text-[#6B7280]">
                        Create payments and manage your payment status.
                    </p>
                </div>

                {message && (
                    <p className="mb-4 text-sm text-[#6B7280]">{message}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <PaymentActionMenu
                            activeSection={activeSection}
                            onChangeSection={(section) => {
                                setActiveSection(section);
                                setMessage("");  
                            }}
                        />
                    </div>

                    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        {activeSection === "pay" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Create Payment
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Create a payment for your pending booking.
                                </p>

                                {message && (
                                    <p className="mb-4 text-sm text-[#6B7280]">
                                        {message}
                                    </p>
                                )}

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading payment data...</p>
                                ) : (
                                    <>
                                        {bookingId && !selectedBooking && !isLoading && (
                                            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                                                This booking already has a payment or is no longer available for payment.
                                                Please check your payment status in <strong>My Payments</strong>.
                                            </div>
                                        )}

                                        {bookingId && selectedBooking && (
                                            <div className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm">
                                                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-[#111827] mb-3">
                                                            {getEventTitleByBooking(selectedBooking)}
                                                        </h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#6B7280]">
                                                            <p>
                                                                <span className="font-medium text-[#111827]">Booking Code:</span>{" "}
                                                                {selectedBooking.bookingCode}
                                                            </p>

                                                            <p>
                                                                <span className="font-medium text-[#111827]">Booking Date:</span>{" "}
                                                                {formatDate(selectedBooking.createdAt)}
                                                            </p>

                                                            <p>
                                                                <span className="font-medium text-[#111827]">Quantity:</span>{" "}
                                                                {selectedBooking.quantity}
                                                            </p>

                                                            <p>
                                                                <span className="font-medium text-[#111827]">Total Price:</span>{" "}
                                                                RM {calculateBookingTotalPrice(selectedBooking).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="h-fit bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-medium">
                                                        {selectedBooking.status}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleShowPaymentForm(selectedBooking.bookingId)}
                                                    className="mt-5 bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                                >
                                                    Create Payment
                                                </button>

                                                {selectedPaymentBookingId === selectedBooking.bookingId && (
                                                    <PaymentForm
                                                        bookingId={selectedBooking.bookingId}
                                                        onSubmit={handleCreatePayment}
                                                        onCancel={handleCancelPaymentForm}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {!bookingId && (
                                            <div className="space-y-4">
                                                {pendingBookings.length === 0 ? (
                                                    <p className="text-[#6B7280]">
                                                        No pending bookings available for payment.
                                                    </p>
                                                ) : (
                                                    pendingBookings.map((booking) =>
                                                        renderBookingPaymentCard(booking)
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {activeSection === "all" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    My Payments
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View all payments linked to your bookings.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading payments...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {payments.length === 0 ? (
                                            <p className="text-[#6B7280]">No payments found.</p>
                                        ) : (
                                            payments.map((payment) => renderPaymentCard(payment))
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "pending" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Pending Payments
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Mark pending payments as paid or failed.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading pending payments...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getPaymentsByStatus("Pending").length === 0 ? (
                                            <p className="text-[#6B7280]">No pending payments found.</p>
                                        ) : (
                                            getPaymentsByStatus("Pending").map((payment) =>
                                                renderPaymentCard(payment, true)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "paid" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Paid Payments
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View completed payments.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading paid payments...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getPaymentsByStatus("Paid").length === 0 ? (
                                            <p className="text-[#6B7280]">No paid payments found.</p>
                                        ) : (
                                            getPaymentsByStatus("Paid").map((payment) =>
                                                renderPaymentCard(payment, false, true)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "failed" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Failed Payments
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View failed payment records.
                                </p>

                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                                    This payment failed. The related booking has been cancelled. Please create a new booking if you want to try again.
                                </div>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading failed payments...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getPaymentsByStatus("Failed").length === 0 ? (
                                            <p className="text-[#6B7280]">No failed payments found.</p>
                                        ) : (
                                            getPaymentsByStatus("Failed").map((payment) =>
                                                renderPaymentCard(payment)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "refunded" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Refunded Payments
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View refunded payment history.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading refunded payments...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getPaymentsByStatus("Refunded").length === 0 ? (
                                            <p className="text-[#6B7280]">No refunded payments found.</p>
                                        ) : (
                                            getPaymentsByStatus("Refunded").map((payment) =>
                                                renderPaymentCard(payment)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Confirmation modal for payment status actions */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
                            <div className="p-6">
                                <div
                                    className={
                                        confirmModal.actionType === "paid"
                                            ? "w-12 h-12 rounded-full bg-green-50 text-[#10B981] flex items-center justify-center font-bold text-xl mb-4"
                                            : confirmModal.actionType === "refund"
                                                ? "w-12 h-12 rounded-full bg-yellow-50 text-[#F59E0B] flex items-center justify-center font-bold text-xl mb-4"
                                                : "w-12 h-12 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center font-bold text-xl mb-4"
                                    }
                                >
                                    !
                                </div>

                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    {confirmModal.title}
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    {confirmModal.message}
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeConfirmModal}
                                        className="bg-gray-200 text-[#111827] px-4 py-2 rounded-xl hover:bg-gray-300 font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleConfirmAction}
                                        className={
                                            confirmModal.actionType === "paid"
                                                ? "bg-[#10B981] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                                : confirmModal.actionType === "refund"
                                                    ? "bg-[#F59E0B] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                                    : "bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                        }
                                    >
                                        {confirmModal.confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PaymentsPage;