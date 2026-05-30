CREATE DATABASE DBAssignment;
GO


USE DBAssignment;
GO

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    eventUser_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    address VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    max_ticket INT NOT NULL,
    available_ticket INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    cancelled_at DATETIME NULL,

    CONSTRAINT FK_Events_Users 
        FOREIGN KEY(eventUser_id)
        REFERENCES Users(user_id),

    CONSTRAINT CK_Events_Status
        CHECK (status IN ('Open', 'Closed', 'Cancelled')),

    CONSTRAINT CK_Events_Ticket
        CHECK (max_ticket > 0 AND available_ticket >= 0 AND available_ticket <= max_ticket),

    CONSTRAINT CK_Events_Time
        CHECK (end_time > start_time)
);

CREATE TABLE Booking (
    booking_id INT IDENTITY(1,1) PRIMARY KEY,
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    bookingEvent_id INT NOT NULL,
    bookingUser_id INT NOT NULL,
    quantity INT NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    cancelled_at DATETIME NULL,

    CONSTRAINT FK_Booking_Events
        FOREIGN KEY(bookingEvent_id)
        REFERENCES Events(event_id),

    CONSTRAINT FK_Booking_Users
        FOREIGN KEY(bookingUser_id)
        REFERENCES Users(user_id),

    CONSTRAINT CK_Booking_Status
        CHECK (status IN ('Active', 'Pending', 'Cancelled')),

    CONSTRAINT CK_Booking_Quantity
        CHECK (quantity > 0)
);

CREATE TABLE Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    paymentBooking_id INT NOT NULL UNIQUE,
    total_price DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(30) NOT NULL,
    reference_bank VARCHAR(50) NULL,
    account_number VARCHAR(30) NULL,
    account_name VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    paid_at DATETIME NULL,
    failed_at DATETIME NULL,
    refunded_at DATETIME NULL,

    CONSTRAINT FK_Payment_Booking
        FOREIGN KEY(paymentBooking_id)
        REFERENCES Booking(booking_id),

    CONSTRAINT CK_Payment_Status
        CHECK (status IN ('Pending', 'Paid', 'Failed', 'Refunded')),

    CONSTRAINT CK_Payment_Type
        CHECK (payment_type IN ('Bank Transfer', 'Credit Card', 'E-Wallet', 'Cash')),

    CONSTRAINT CK_Payment_Total
        CHECK (total_price >= 0)
);
