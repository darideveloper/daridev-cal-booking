# Complete Backend API Documentation

This document provides a comprehensive specification for the APIs required to support the Booking System. It covers configuration, discovery, availability, and the booking workflow, including Stripe integration.

## General Principles

### Base URL
The API is single-tenant. The frontend communicates with the backend using a static base URL defined in the environment. The `Host` header is NOT used for tenant identification.

**Base URL Pattern:** `http://<api-domain>/api/`
*Example:* `http://localhost:8000/api/`

### Internationalization (i18n)
- **Header:** `Accept-Language` (Values: `es`, `en`).
- **Effect:** Localizes string fields like `title`, `description`, and error messages.

---

## 1. Public Configuration
Retrieve branding and business settings to initialize the frontend.

**Endpoint:** `GET /config/`

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
  "event_type_label": "Tipo de Actividad",
  "event_label": "Actividad",
  "availability_free_label": "Disponible",
  "availability_regular_label": "Estándar",
  "availability_no_free_label": "Completo",
  "extras_label": "Extras"
}
```

---

## 2. Business Hours
Global operating hours for the system. Used to constrain slot generation.

**Endpoint:** `GET /business-hours/`

**Response Example:**
```json
[
  { "weekday": 1, "start_time": "09:00:00", "end_time": "18:00:00" },
  { "weekday": 2, "start_time": "09:00:00", "end_time": "18:00:00" },
  ...
]
```

---

## 3. Services (Events) Discovery
List available bookable services/tours.

**Endpoint:** `GET /events/`

**Response Example:**
```json
{
  "count": 10,
  "results": [
    {
      "id": "tour-1",
      "title": "Alhambra Completa",
      "description": "Visita guiada por todo el recinto.",
      "price": "100.00",
      "duration_minutes": 180,
      "image": "http://api.example.com/media/tours/alhambra.jpg"
    }
  ]
}
```

---

## 4. Availability Engine

### A. Monthly Calendar View
Returns availability status for each day. Used to highlight bookable dates in the `BookingCalendar` component.

**Endpoint:** `GET /events/<id>/calendar/`
**Query Params:** `year`, `month`

**Response:**
```json
{
  "2026-04-01": false,
  "2026-04-02": true
}
```

### B. Daily Slots
Returns available time slots. Note: The frontend currently simulates this with "virtual availability" for 12 days, but the backend should provide real slots via this endpoint.

**Endpoint:** `GET /events/<id>/slots/`
**Query Params:** `date` (YYYY-MM-DD)

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

**Payload Mapping (Frontend -> Backend):**

| Frontend Field | Backend JSON Key | Description |
| :--- | :--- | :--- |
| `serviceId` | `event` | The ID of the selected tour/event. |
| `fullName` | `client_name` | User's full name. |
| `email` | `client_email` | User's email address. |
| `guests` | `guests` | Number of participants. |
| `selectedDate` | `start_time` | ISO8601 string of the selected slot. |
| `specialRequests` | `special_requests` | Optional notes from the user. |

**Example Payload:**
```json
{
  "event": "tour-1",
  "client_name": "John Doe",
  "client_email": "john@example.com",
  "guests": 2,
  "start_time": "2026-04-10T09:00:00+02:00",
  "special_requests": "Need a wheelchair access",
  "success_url": "http://frontend.com/success",
  "cancel_url": "http://frontend.com/cancel"
}
```

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

**Endpoint:** `POST /api/webhooks/stripe/`
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
