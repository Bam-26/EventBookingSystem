using Microsoft.AspNetCore.Mvc;
using EventBookingBackend.Models;
using EventBookingBackend.Services;
using EventBookingBackend.DTOs;

namespace EventBookingBackend.Controllers
{
    // Handles payment API requests and delegates payment business rules to the payment service
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPayment()
        {
            var payment = await _paymentService.GetAllPaymentsAsync();
            return Ok(new
            {
                message = "Payments retrieved successfully.",
                data = payment
            });
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentById(int paymentId)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(paymentId);
            if (payment == null)
            {
                return NotFound(new
                {
                    message = "Payment ID not found."
                });
            }

            return Ok(new
            {
                message = "Payment retrieved successfully.",
                data = payment
            });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPaymentByUserId(int userId)
        {
            var payments = await _paymentService.GetPaymentByUserIdAsync(userId);
            return Ok(new
            {
                message = "Payments retrieved successfully.",
                data = payments
            });
        }


        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetPaymentByBookingId(int bookingId)
        {
            var payment = await _paymentService.GetPaymentByBookingIdAsync(bookingId);
            if (payment == null)
            {
                return NotFound(new
                {
                    message = "Payment for this booking ID not found."
                });
            }

            return Ok(new
            {
                message = "Payment retrieved successfully.",
                data = payment
            });
        }

        [HttpPost("create/{bookingId}")]
        public async Task<IActionResult> CreateNewPayment([FromBody] CreatePaymentRequest request, int bookingId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }
            
            // Maps payment input from the request. Total price and default status are assigned by the service
            var paymentData = new Payment
            {
                BookingId = bookingId,
                PaymentType = request.PaymentType,
                ReferenceBank = request.ReferenceBank,
                AccountNumber = request.AccountNumber,
                AccountName = request.AccountName
            };

            var newPayment = await _paymentService.CreateNewPaymentAsync(paymentData);
            if (newPayment == null)
            {
                return BadRequest(new
                {
                    message = "Create payment failed. Booking may not exist, booking may be cancelled, payment already exists, or payment type is invalid."
                });
            }

            return CreatedAtAction(
                nameof(GetPaymentById),
                new { paymentId = newPayment.PaymentId },
                new
                {
                    message = "Payment created successfully.",
                    data = newPayment
                });
        }

        [HttpPut("update/{paymentId}")]
        public async Task<IActionResult> UpdatePayment(int paymentId)
        {
            // Payments are not updated directly to keep booking and payment status transitions consistent
            return BadRequest(new
            {
                message = "Payment cannot be updated directly. Use paid, failed, or refund endpoint."
            });
        }

        [HttpPut("paid/{paymentId}")]
        public async Task<IActionResult> MarkPaymentAsPaid(int paymentId)
        {
            // Marking a payment as paid also activates the related booking in the service
            var payment = await _paymentService.MarkPaymentAsPaidAsync(paymentId);
            if (payment == null)
            {
                return BadRequest(new
                {
                    message = "Mark payment as paid failed. Payment may not exist, payment is not pending, or booking is cancelled."
                });
            }

            return Ok(new
            {
                message = "Payment marked as paid successfully.",
                data = payment
            });
        }

        [HttpPut("failed/{paymentId}")]
        public async Task<IActionResult> MarkPaymentAsFailed(int paymentId)
        {
            // Marking a payment as failed also cancels the related booking and restores event tickets
            var payment = await _paymentService.MarkPaymentAsFailedAsync(paymentId);
            if (payment == null)
            {
                return BadRequest(new
                {
                    message = "Failed to mark payment as failed. Payment may not exist or payment is not pending."
                });
            }

            return Ok(new
            {
                message = "Payment marked as failed successfully.",
                data = payment
            });
        }

        [HttpPut("refund/{paymentId}")]
        public async Task<IActionResult> RefundPayment(int paymentId)
        {
            // Refunding a paid payment also cancels the related booking and restores event tickets
            var payment = await _paymentService.RefundPaymentAsync(paymentId);
            if (payment == null)
            {
                return BadRequest(new
                {
                    message = "Refund payment failed. Payment may not exist or payment is not paid."
                });
            }

            return Ok(new
            {
                message = "Payment refunded successfully.",
                data = payment
            });
        }

        [HttpDelete("delete/{paymentId}")]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            // Paid payments cannot be deleted directly because they may affect booking history
            var result = await _paymentService.DeletePaymentAsync(paymentId);
            if (result == false)
            {
                return BadRequest(new
                {
                    message = "Delete payment failed. Payment not found or paid payment cannot be deleted."
                });
            }

            return Ok(new
            {
                message = "Payment deleted successfully."
            });
        }

    }
}