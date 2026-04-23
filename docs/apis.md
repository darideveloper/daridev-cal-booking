# Complete Backend API Documentation

This document provides a comprehensive specification for the APIs required to support the Booking System. It covers configuration, discovery, availability, and the booking workflow, including Stripe integration.

## General Principles

### Base URL
The API is single-tenant. The frontend communicates with the backend using a static base URL defined in the environment. The `Host` header is NOT used for tenant identification.

**Base URL Pattern:** `http://<api-domain>/api/`
*Example:* `http://localhost:8000/api/`

### Internationalization (i18n)
- **Header:** `Accept-Language` (Values: `es`, `en`).
- **Effect:** Localizes string fields like `title`, `description`, and error messages. If the header is missing, the backend defaults to `es`.

---

## 1. Public Configuration
Retrieve branding and business settings to initialize the frontend.

**Endpoint:** `GET /config/`

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/config/" \
     -H "Accept-Language: en"
```

**Expected Response:**
```json
{
  "brand_color": "#a01313",
  "logo": "http://api.example.com/media/logos/logo.png",
  "currency": "EUR",
  "contact_email": "contact@company.com",
  "contact_phone": "+34123456789",
  "company_name": "Granada Tours",
  "timezone": "Europe/Madrid",
  "event_type_label": "Category",
  "event_label": "Activity",
  "availability_free_label": "Available",
  "availability_regular_label": "Standard",
  "availability_no_free_label": "Full",
  "extras_label": "Extras"
}
```

---

## 2. Business Hours
Global operating hours for the system. Used to constrain slot generation.

**Endpoint:** `GET /business-hours/`

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/business-hours/"
```

**Response Example:**
```json
[
  { "weekday": 1, "start_time": "09:00:00", "end_time": "18:00:00" },
  { "weekday": 2, "start_time": "09:00:00", "end_time": "18:00:00" }
]
```

---

## 3. Service Categories & Services Discovery
The system uses a two-step selection process: first select a category, then a service within that category.

### A. List All Categories (with nested services)
Returns all available categories and their associated services.

**Endpoint:** `GET /categories/`

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/categories/" \
     -H "Accept-Language: en"
```

**Response Example:**
```json
[
  {
    "id": "tours",
    "name": "Historical Tours",
    "services": [
      {
        "id": "tour-1",
        "title": "Alhambra Completa",
        "price": "100.00",
        "duration": "3h",
        "description": "Full guided tour."
      }
    ]
  },
  {
    "id": "events",
    "name": "Special Events",
    "services": []
  }
]
```

---

## 4. Availability Engine

### A. Monthly Calendar View
Returns availability status for each day. Used to highlight bookable dates in the `BookingCalendar` component.

**Endpoint:** `GET /services/<id>/calendar/`
**Query Params:** `year`, `month`

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/services/tour-1/calendar/?year=2026&month=04"
```

**Response:**
```json
{
  "2026-04-01": "full",
  "2026-04-02": "available",
  "2026-04-03": "limited"
}
```

### B. Daily Slots
Returns available time slots for a specific date.

**Endpoint:** `GET /services/<id>/slots/`
**Query Params:** `date` (YYYY-MM-DD)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/services/tour-1/slots/?date=2026-04-10"
```

**Response:**
```json
[
  "2026-04-10T09:00:00+02:00",
  "2026-04-10T11:00:00+02:00"
]
```

---

## 5. Booking & Payments (Stripe)

### Initiate Booking / Stripe Checkout
When the user submits the `BookingForm`, the frontend sends the following payload.

**Endpoint:** `POST /bookings/`

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/bookings/" \
     -H "Content-Type: application/json" \
     -d '{
           "service": "tour-1",
           "client_name": "John Doe",
           "client_email": "john@example.com",
           "guests": 2,
           "start_time": "2026-04-10T09:00:00+02:00",
           "special_requests": "Need a wheelchair access",
           "success_url": "http://frontend.com/success",
           "cancel_url": "http://frontend.com/cancel"
         }'
```

**Payload Mapping (Frontend -> Backend):**

| Frontend Field | Backend JSON Key | Description |
| :--- | :--- | :--- |
| `serviceId` | `service` | The ID of the selected service. |
| `fullName` | `client_name` | User's full name. |
| `email` | `client_email` | User's email address. |
| `guests` | `guests` | Number of participants. |
| `selectedDate` | `start_time` | ISO8601 string of the selected slot. |
| `specialRequests` | `special_requests` | Optional notes from the user. |

**Expected Responses:**

1.  **Direct Confirmation (Free/Post-paid):**
    ```json
    { "id": 123, "status": "CONFIRMED" }
    ```
2.  **Redirect to Payment (Pre-paid):**
    ```json
    { "id": 124, "status": "PENDING", "checkout_url": "https://checkout.stripe.com/..." }
    ```

---

## 6. Stripe Webhook (Internal)
The backend must update the booking status when payment is confirmed.

**Endpoint:** `POST /webhooks/stripe/`
**Key Event:** `checkout.session.completed`

---

## 7. Data Types Reference

| Field | Type | Description |
| :--- | :--- | :--- |
| `brand_color` | String | Hex, RGB, or OKLCH color code. |
| `start_time` | ISO8601 | Full date-time with offset (e.g., `2026-04-10T09:00:00+02:00`). |
| `price` | Decimal | Formatted as string `"0.00"`. |
| `status` | Enum | `PENDING`, `CONFIRMED`, `PAID`, `CANCELLED`. |
| `weekday` | Integer | 1 (Monday) to 7 (Sunday). |
| `id` | String | Unique slug or UUID (e.g., `tour-1`). |
| `name` | String | Localized name based on `Accept-Language`. |
