# Backend API Requirements

This document outlines the API endpoints that the backend needs to implement for the Transportation Frontend to work properly.

**Base URL**: `http://localhost:3000/api` (configurable via `VITE_API_URL` environment variable)

## Authentication
- All requests include `Authorization: Bearer <token>` header if token exists in localStorage
- GET requests include `_t` timestamp parameter for cache busting

## API Endpoints Required

### 🚚 Requests Management

#### GET `/requests`
**Purpose**: Get all transportation requests with filtering
**Query Parameters**:
- `search` (string, optional): Search term for request content
- `status` (string, optional): Filter by status (pending, approved, in-progress, completed, cancelled)
- `priority` (string, optional): Filter by priority (low, medium, high)
- `_t` (number): Timestamp for cache busting

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "requestNumber": "REQ-2024-001",
      "origin": "Dallas",
      "destination": "Houston",
      "pickUpDateTime": "2024-08-15T10:00:00Z",
      "truckCount": 2,
      "truckType": "box",
      "estimatedDistance": 362,
      "estimatedCost": 1810,
      "urgencyLevel": "medium",
      "status": "planned",
      "loadDetails": "Electronics and computer equipment",
      "specialRequirements": null,
      "createdBy": "John Doe",
      "createdAt": "2024-08-01T09:00:00Z",
      "updatedAt": "2024-08-01T09:00:00Z"
    }
  ],
  "total": 1
}
```

#### GET `/requests/:id`
**Purpose**: Get single transportation request
**Response**: Single request object (same structure as above)

#### POST `/requests`
**Purpose**: Create new transportation request
**Body**:
```json
{
  "origin": "Dallas",
  "destination": "Houston", 
  "pickUpDateTime": "2024-08-15T10:00:00Z",
  "truckCount": 2,
  "loadDetails": "Electronics and computer equipment",
  "estimatedDistance": 362,
  "estimatedCost": 1810
}
```
**Response**: Created request object

#### PUT `/requests/:id`
**Purpose**: Update transportation request
**Body**: Same as POST (partial updates allowed)
**Response**: Updated request object

#### DELETE `/requests/:id`
**Purpose**: Delete transportation request
**Response**: Success confirmation

### 📦 Delivery Management

#### POST `/requests/:id/delivery`
**Purpose**: Log delivery completion with driver ratings
**Body**:
```json
{
  "actualPickupDateTime": "2024-08-15T10:30:00Z",
  "actualTruckCount": 2,
  "invoiceAmount": 1850,
  "deliveryNotes": "Delivered successfully",
  "drivers": [
    {
      "driver_id": 1,
      "punctuality": 4,
      "professionalism": 5,
      "deliveryQuality": 4,
      "communication": 5,
      "overall": 4,
      "comments": "Great service"
    },
    {
      "driver_id": 2,
      "punctuality": 5,
      "professionalism": 5,
      "deliveryQuality": 5,
      "communication": 4,
      "overall": 5,
      "comments": "Excellent driver"
    }
  ]
}
```

**Note**: Each driver object in the `drivers` array has:
- `driver_id` (number): The driver's ID (both existing and newly created drivers)
- Rating fields (flattened structure)

**Rating fields vary by driver type**:
- **Transporter drivers**: `punctuality`, `professionalism`, `deliveryQuality`, `communication`, `overall`, `comments`
- **In-house drivers**: `punctuality`, `professionalism`, `safety`, `policyCompliance`, `fuelEfficiency`, `overall`, `comments`
```
**Response**:
```json
{
  "success": true,
  "delivery": {
    "id": 1,
    "requestId": 1,
    "actualPickupDateTime": "2024-08-15T10:30:00Z",
    "actualTruckCount": 2,
    "invoiceAmount": 1850,
    "deliveryNotes": "Delivered successfully",
    "loggedAt": "2024-08-15T11:00:00Z",
    "loggedBy": "current_user"
  },
  "drivers": [
    {
      "id": 1,
      "rating": { /* rating object */ }
    }
  ]
}
```

#### PUT `/requests/:requestId/delivery/:deliveryId`
**Purpose**: Update existing delivery
**Body**: Same as POST delivery
**Response**: Updated delivery object

### 👨‍💼 Driver Management

#### GET `/drivers/search`
**Purpose**: Search drivers by name, company, or employee ID
**Query Parameters**:
- `q` (string): Search term (minimum 2 characters)
- `type` (string, optional): Filter by driver type (transporter, in_house)
- `_t` (number): Timestamp for cache busting

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "type": "transporter",
      "transportCompany": "ABC Logistics",
      "phone": "555-0123",
      "licenseNumber": "CDL-12345",
      "overallRating": 4.2,
      "totalDeliveries": 25,
      "lastDelivery": "2024-08-01T10:30:00Z",
      "createdAt": "2024-01-15T08:00:00Z"
    },
    {
      "id": 2,
      "name": "David Johnson",
      "type": "in_house",
      "employeeId": "EMP001",
      "department": "Transportation",
      "hireDate": "2023-06-01",
      "overallRating": 4.5,
      "totalDeliveries": 78,
      "lastDelivery": "2024-08-03T11:45:00Z",
      "createdAt": "2023-06-01T08:00:00Z"
    }
  ],
  "total": 2
}
```

#### GET `/drivers/recent`
**Purpose**: Get recently active drivers
**Query Parameters**:
- `limit` (number, optional): Limit results (default: 10)

**Response**: Same format as search

#### GET `/drivers/:id`
**Purpose**: Get single driver details
**Response**: Single driver object

#### POST `/drivers`
**Purpose**: Create new driver
**Body**:
```json
{
  "name": "Maria Garcia",
  "type": "transporter",
  "transportCompany": "XYZ Transport",
  "phone": "555-0456",
  "licenseNumber": "CDL-67890"
}
```
**OR for in-house drivers**:
```json
{
  "name": "Sarah Williams",
  "type": "in_house", 
  "employeeId": "EMP002",
  "department": "Transportation",
  "hireDate": "2023-09-15"
}
```
**Response**: Created driver object

#### PUT `/drivers/:id`
**Purpose**: Update driver information
**Body**: Same as POST (partial updates allowed)
**Response**: Updated driver object

#### DELETE `/drivers/:id`
**Purpose**: Delete driver
**Response**: Success confirmation

#### GET `/drivers/stats`
**Purpose**: Get driver statistics overview
**Response**:
```json
{
  "totalDrivers": 50,
  "transporterDrivers": 30,
  "inHouseDrivers": 20,
  "averageRating": 4.3,
  "activeThisMonth": 45
}
```

#### GET `/drivers/:id/performance`
**Purpose**: Get driver performance metrics
**Query Parameters**:
- `timeRange` (string, optional): Time range for metrics (30d, 90d, 1y)

**Response**:
```json
{
  "driverId": 1,
  "timeRange": "30d",
  "totalDeliveries": 15,
  "averageRating": 4.3,
  "onTimeDeliveries": 14,
  "onTimePercentage": 93.3,
  "ratingBreakdown": {
    "punctuality": 4.2,
    "professionalism": 4.5,
    "deliveryQuality": 4.3,
    "communication": 4.1
  }
}
```

#### GET `/drivers/:id/deliveries`
**Purpose**: Get driver's delivery history
**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "requestId": 1,
      "deliveryDate": "2024-08-01T14:30:00Z",
      "route": "Dallas → Houston",
      "rating": 4.5
    }
  ],
  "total": 1
}
```

## Error Handling

### Standard Error Response Format:
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

### HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Business Rules

### Driver Rating Validation:
- **Transporter drivers** require: `punctuality`, `professionalism`, `deliveryQuality`, `communication`, `overall`
- **In-house drivers** require: `punctuality`, `professionalism`, `safety`, `policyCompliance`, `fuelEfficiency`, `overall`
- All ratings must be integers from 1-5
- `overall` rating should be calculated as average of other ratings

### Request Status Flow:
1. `planned` → `approved` → `in-progress` → `completed`
2. Any status can go to `cancelled`
3. Only `planned` and `approved` requests can be edited
4. Only `planned`, `approved`, and `in-progress` requests can have deliveries logged

### Driver Management:
- New drivers can only be created as `transporter` type from the delivery logging interface
- In-house drivers must be created through admin interface
- Drivers cannot be deleted if they have delivery history
- Driver ratings affect their `overallRating` and performance metrics

## Frontend Configuration

Set the backend URL in your `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

## Testing

For testing without a backend, you can:
1. Use a mock server like JSON Server
2. Set up API mocking with MSW (Mock Service Worker)
3. Implement the actual backend using the specifications above

The frontend will show appropriate error messages if the backend is not available or returns errors.