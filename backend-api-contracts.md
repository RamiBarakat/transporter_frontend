# Backend API Contracts - Transportation System

## 📋 **API Endpoints**

### **Driver Management**

#### 1. Search Drivers
```
GET /api/drivers?search={term}&type={type}
```
**Query Params:**
- `search` (optional): Name, company, or employee ID
- `type` (optional): `transporter` | `in_house` | `all`

**Response:**
```json
{
  "data": [Driver[]],
  "total": number
}
```

#### 2. Get Recent Drivers
```
GET /api/drivers/recent
```
**Response:**
```json
{
  "data": [Driver[]],
  "total": number
}
```

#### 3. Create Driver
```
POST /api/drivers
```
**Request Body:**
```json
{
  "name": "string (required, min 2 chars)",
  "type": "transporter | in_house (required)",
  
  // If transporter:
  "transportCompany": "string (required)",
  "phone": "string (required)",
  "licenseNumber": "string (required)",
  
  // If in_house:
  "employeeId": "string (required)",
  "department": "string (required)",
  "hireDate": "date (required)"
}
```

#### 4. Get Driver by ID
```
GET /api/drivers/{id}
```

### **Delivery Management**

#### 1. Log Delivery with Drivers
```
POST /api/requests/{requestId}/delivery
```
**Request Body:**
```json
{
  "actualPickupDateTime": "ISO datetime (required)",
  "actualTruckCount": "number (required, min 1)",
  "invoiceAmount": "number (required, min 0)",
  "deliveryNotes": "string (optional)",
  "drivers": [
    {
      "id": "number (if existing driver)",
      "name": "string (required)",
      "type": "transporter | in_house (required)",
      
      // Type-specific data (same as create driver)
      "transportCompany": "string",
      "phone": "string", 
      "licenseNumber": "string",
      "employeeId": "string",
      "department": "string",
      "hireDate": "date",
      
      // Ratings (required)
      "rating": {
        "punctuality": "number (1-5)",
        "professionalism": "number (1-5)",
        
        // Transporter only:
        "deliveryQuality": "number (1-5)",
        "communication": "number (1-5)",
        
        // In-house only:
        "safety": "number (1-5)",
        "policyCompliance": "number (1-5)", 
        "fuelEfficiency": "number (1-5)",
        
        "overall": "number (1-5, auto-calculated)",
        "comments": "string (optional)"
      }
    }
  ]
}
```

## 🗄️ **Database Schemas**

### **Driver Table**
```sql
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('transporter', 'in_house')),
  
  -- Transporter fields
  transport_company VARCHAR(255),
  phone VARCHAR(50),
  license_number VARCHAR(100),
  
  -- In-house fields  
  employee_id VARCHAR(50),
  department VARCHAR(100),
  hire_date DATE,
  
  -- Performance metrics
  overall_rating DECIMAL(2,1) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  last_delivery TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Delivery Table**
```sql
CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES requests(id),
  
  actual_pickup_datetime TIMESTAMP NOT NULL,
  actual_truck_count INTEGER NOT NULL,
  invoice_amount DECIMAL(10,2) NOT NULL,
  delivery_notes TEXT,
  
  logged_at TIMESTAMP DEFAULT NOW(),
  logged_by VARCHAR(255) NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Driver Ratings Table**
```sql
CREATE TABLE driver_ratings (
  id SERIAL PRIMARY KEY,
  delivery_id INTEGER NOT NULL REFERENCES deliveries(id),
  driver_id INTEGER NOT NULL REFERENCES drivers(id),
  
  -- Common ratings
  punctuality INTEGER NOT NULL CHECK (punctuality BETWEEN 1 AND 5),
  professionalism INTEGER NOT NULL CHECK (professionalism BETWEEN 1 AND 5),
  
  -- Transporter ratings
  delivery_quality INTEGER CHECK (delivery_quality BETWEEN 1 AND 5),
  communication INTEGER CHECK (communication BETWEEN 1 AND 5),
  
  -- In-house ratings  
  safety INTEGER CHECK (safety BETWEEN 1 AND 5),
  policy_compliance INTEGER CHECK (policy_compliance BETWEEN 1 AND 5),
  fuel_efficiency INTEGER CHECK (fuel_efficiency BETWEEN 1 AND 5),
  
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comments TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

## ✅ **Validation Rules**

### **Driver Creation**
- Name: Required, min 2 characters
- Type: Required, must be 'transporter' or 'in_house'
- **If transporter:** transportCompany, phone, licenseNumber required
- **If in_house:** employeeId, department, hireDate required

### **Delivery Logging**
- actualPickupDateTime: Required, cannot be future
- actualTruckCount: Required, min 1
- invoiceAmount: Required, min 0
- drivers: Required, min 1 driver
- **Each driver rating:** All rating fields 1-5, overall required

## 🔄 **Response Format**

### **Success Response**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

This covers the **complete backend contract** for the driver management and delivery logging system. Keep it simple!