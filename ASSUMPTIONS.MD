# Assumptions & Technical Decisions

This document covers the assumptions and technical decisions I made while developing the School Admission System for requirements that were not fully explained in the assignment.

## 1. Student Identity Validation

- **Decision:** The `X-Student-Id` header must contain a 17-digit numeric string, following the Birth Registration Number format.
- **Reason:** I added validation on both the frontend and backend so invalid student IDs are rejected before processing requests.

## 2. Automatic Hold Expiration

- **Decision:** I implemented a background service using ASP.NET Core's `BackgroundService` to check for expired holds periodically.
- **Reason:** Expired reservations should release their seats automatically without requiring students to make another API request. The service finds expired `HELD` records and updates their status to `EXPIRED`.

## 3. Preventing Seat Overbooking

- **Decision:** I used PostgreSQL transactions with row-level locking (`SELECT ... FOR UPDATE`), along with database constraints.
- **Reason:** Multiple students may try to reserve the same seat at the same time. Database-level locking ensures that only requests with available seats can succeed, even when multiple backend instances are running.

## 4. ID Generation

- **Decision:** Class IDs use the `c_{uuid}` format, while hold IDs use the `h_{uuid}` format.
- **Reason:** I followed the ID patterns shown in the assignment while using UUIDs to ensure that generated IDs remain unique.

## 5. Keeping the UI Updated

- **Decision:** The frontend periodically fetches updated class and hold information, approximately every 5 seconds. Countdown timers update locally.
- **Reason:** This keeps seat availability and application statuses up to date without requiring users to refresh the page. I used polling instead of WebSockets to keep the implementation simple.

## 6. API Responses and Error Handling

- **Decision:** I used standard HTTP status codes to handle different API scenarios, such as `409 Conflict` for unavailable seats or duplicate reservations and `400 Bad Request` for invalid operations.
- **Reason:** Using appropriate status codes helps the frontend identify what went wrong and show users more relevant error messages.