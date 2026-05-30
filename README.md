## Project Overview

This project is only for assignment purpose only in course SWE310. This project is an event booking system that manages four main entities:
* Users
* Events
* Booking
* Payment

## Tech Stack

### Backend

* ASP.NET Core Web API
* .NET 9
* Entity Framework Core
* Microsoft SQL Server
* BCrypt.Net for password hashing

### Frontend

* React
* Vite
* Axios
* Tailwind CSS
* React Router DOM

### Database

* Microsoft SQL Server
* SQL script for schema creation
* HTTP request files for seed data


## Requirements

Before running the project, install the following software:

### Backend Requirements

* .NET SDK 9.0 or later
* Microsoft SQL Server
* SQL Server Management Studio or Azure Data Studio
* Visual Studio or Visual Studio Code

### Frontend Requirements

* Node.js
* npm
* Visual Studio Code

## Database Setup

1. Open SQL Server Management Studio or Azure Data Studio.
2. Create or select your SQL Server database.
3. Run the SQL script:

```text
Event Booking System SQL Query.sql
```

4. Make sure the database name matches the connection string in the backend `appsettings.json`.

Example connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EventBookingDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

If your SQL Server uses SQL Server Authentication, use this format:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EventBookingDB;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
}
```

## Backend Setup

1. Open the backend folder:

```bash
cd event-booking-backend
```

2. Restore NuGet packages:

```bash
dotnet restore
```

3. Update the database using Entity Framework migration if needed:

```bash
dotnet ef database update
```

4. Run the backend:

```bash
dotnet run
```

5. Check the backend URL shown in the terminal. For this project, the frontend API files are configured to use:

```text
http://localhost:5176/api
```

If your backend runs on a different port, update the frontend API base URLs in the files inside:

```text
event-booking-frontend/src/API/
```

The API URLs should use the same backend port. Example:

```javascript
const API_URL = "http://localhost:5176/api/events";
```

## Frontend Setup

1. Open the frontend folder:

```bash
cd event-booking-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm run dev
```

4. Open the frontend in browser using the URL shown in the terminal. Usually, Vite runs on:

```text
http://localhost:5173
```

## Seed Data Setup

Run the seed files in this order:

```text
1. seed-users.http
2. seed-events.http
3. seed-bookings.http
4. seed-payments.http
```

Make sure the backend is running before executing the HTTP request files.

The seed data includes:

* 10 users
* 15 events
* 20 bookings
* 15 payments

## Notes

* Do not upload `node_modules`, `bin`, or `obj` folders to GitHub.
* Run the backend before running seed request files.
* Run the backend before testing the frontend.
* If the frontend cannot connect to the backend, check the backend port and update the API URLs inside `src/API/`.
* Passwords are stored in hashed form using BCrypt.
* Seed data is inserted through API requests to ensure validation and business rules are applied.
