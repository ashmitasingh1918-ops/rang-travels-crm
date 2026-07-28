# Thunder Client Request Examples

This document lists the example requests for the Settings module API endpoints.

Set your environment variables in Thunder Client:
- `{{host}}` = `http://localhost:5000/api/v1`
- `{{token}}` = `<YOUR_JWT_ACCESS_TOKEN>`

---

## 1. Profile

### GET Profile
Fetches the profile details of the currently authenticated session.

- **URL**: `{{host}}/settings/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "fullName": "System Admin",
    "email": "admin@rangtravels.com",
    "phone": "+91 98765 43210",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-07-28T09:27:32.000Z",
    "updatedAt": "2026-07-28T19:14:30.000Z"
  }
}
```

---

### PUT Profile
Updates the profile information of the current user.

- **URL**: `{{host}}/settings/profile`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`
- **Body**:
```json
{
  "fullName": "System Admin Updated",
  "email": "admin@rangtravels.com",
  "phone": "+91 99999 88888"
}
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "fullName": "System Admin Updated",
    "email": "admin@rangtravels.com",
    "phone": "+91 99999 88888",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-07-28T09:27:32.000Z",
    "updatedAt": "2026-07-28T19:20:00.000Z"
  }
}
```

**Duplicate Email Response (409 Conflict)**:
```json
{
  "success": false,
  "message": "A user with this email address already exists"
}
```

---

## 2. Security

### PUT Change Password
Modifies the password of the current user.

- **URL**: `{{host}}/settings/change-password`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`
- **Body**:
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewSecurePassword456",
  "confirmPassword": "NewSecurePassword456"
}
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

**Mismatched Passwords Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "New password and confirmation password do not match"
}
```

**Wrong Current Password Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Incorrect current password"
}
```

---

## 3. Company Details

### GET Company Details
Retrieves company info. Auto-creates a default record if the database is empty.

- **URL**: `{{host}}/settings/company`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Company details fetched successfully",
  "data": {
    "id": 1,
    "name": "Rang Travels",
    "email": "info@rangtravels.com",
    "phone": "+91 98765 43210",
    "gstNumber": null,
    "address": null,
    "logo": null,
    "createdAt": "2026-07-28T19:22:00.000Z",
    "updatedAt": "2026-07-28T19:22:00.000Z"
  }
}
```

---

### PUT Company Details
Updates company profile settings.

- **URL**: `{{host}}/settings/company`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`
- **Body**:
```json
{
  "name": "Rang Travels Pvt. Ltd.",
  "email": "bookings@rangtravels.com",
  "phone": "+91 11 4056 2200",
  "gstNumber": "07AAAAA1111A1Z1",
  "address": "12A, Connaught Place, New Delhi, 110001, India",
  "logo": "https://rangtravels.com/images/logo-dark.png"
}
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Company details updated successfully",
  "data": {
    "id": 1,
    "name": "Rang Travels Pvt. Ltd.",
    "email": "bookings@rangtravels.com",
    "phone": "+91 11 4056 2200",
    "gstNumber": "07AAAAA1111A1Z1",
    "address": "12A, Connaught Place, New Delhi, 110001, India",
    "logo": "https://rangtravels.com/images/logo-dark.png",
    "createdAt": "2026-07-28T19:22:00.000Z",
    "updatedAt": "2026-07-28T19:25:00.000Z"
  }
}
```
