# Rang Travels CRM - API Specifications

All endpoints are prefixed with `/api/v1`. Communication is performed strictly via JSON payloads.

## Authentication Endpoints

### 1. User Local Login
* **Method**: `POST`
* **Path**: `/api/v1/auth/login`
* **Request Body** (Form Data):
  * `username`: Email Address
  * `password`: User Password
* **Response Status**: `200 OK`
* **JSON Response**:
```json
{
  "access_token": "ACCESS_JWT_TOKEN",
  "refresh_token": "REFRESH_JWT_TOKEN",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@rangtravels.com",
    "role": "admin",
    "name": "Rang Travels Admin"
  }
}
```

### 2. Token Rotation
* **Method**: `POST`
* **Path**: `/api/v1/auth/refresh?token={refresh_token}`
* **Response Status**: `200 OK`
* **JSON Response**:
```json
{
  "access_token": "NEW_ACCESS_JWT_TOKEN",
  "refresh_token": "NEW_REFRESH_JWT_TOKEN",
  "token_type": "bearer"
}
```

---

## Leads Management Endpoints

### 1. Retrieve all leads
* **Method**: `GET`
* **Path**: `/api/v1/leads/`
* **Headers**: `Authorization: Bearer <access_token>`
* **Params**: `skip` (default 0), `limit` (default 100)
* **Response Status**: `200 OK`

### 2. Create lead
* **Method**: `POST`
* **Path**: `/api/v1/leads/`
* **Headers**: `Authorization: Bearer <access_token>`
* **Request Body**:
```json
{
  "client_name": "Ashmit Singh",
  "email": "ashmit@example.com",
  "phone": "+919876543210",
  "destination": "Goa",
  "notes": "Interested in 4-star boutique luxury stay."
}
```
