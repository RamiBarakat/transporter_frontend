# Backend API Requirements - Driver Ratings & AI Insights

This document outlines the additional API endpoints needed for the driver ratings history, performance analytics, and AI insights functionality.

## 🆕 **New API Endpoints Required**

### **1. Get Driver Ratings History**
```
GET /api/drivers/:id/ratings?timeRange={period}&page={number}&limit={number}
```

**Query Parameters:**
- `timeRange` (string, optional): `30d`, `90d`, `1y`, `all` (default: `all`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "driverId": 1,
      "deliveryId": 123,
      "requestId": 45,
      "deliveryDate": "2024-08-15T14:30:00Z",
      "route": "Dallas → Houston",
      "origin": "Dallas",
      "destination": "Houston",
      "driverType": "transporter",
      
      // Rating scores (1-5)
      "punctuality": 4,
      "professionalism": 5,
      "deliveryQuality": 4,      // transporter only
      "communication": 5,        // transporter only
      "safety": null,            // in_house only
      "policyCompliance": null,  // in_house only
      "fuelEfficiency": null,    // in_house only
      "overall": 4,
      "comments": "Great service, on time delivery",
      
      // Metadata
      "ratedBy": "Sarah Johnson",
      "ratedAt": "2024-08-15T15:00:00Z",
      "trend": 0.5,              // compared to previous rating
      "createdAt": "2024-08-15T15:00:00Z"
    },
    {
      "id": 2,
      "driverId": 1,
      "deliveryId": 124,
      "requestId": 46,
      "deliveryDate": "2024-08-10T09:15:00Z",
      "route": "Austin → San Antonio",
      "origin": "Austin",
      "destination": "San Antonio",
      "driverType": "transporter",
      "punctuality": 3,
      "professionalism": 4,
      "deliveryQuality": 4,
      "communication": 4,
      "overall": 4,
      "comments": "Good overall, slight delay but communicated well",
      "ratedBy": "Mike Chen",
      "ratedAt": "2024-08-10T10:00:00Z",
      "trend": -0.5,
      "createdAt": "2024-08-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1
  },
  "averages": {
    "punctuality": 3.5,
    "professionalism": 4.5,
    "deliveryQuality": 4.0,
    "communication": 4.5,
    "overall": 4.0,
    "totalRatings": 2
  }
}
```

### **2. Generate AI Insights**
```
POST /api/drivers/:id/insights
```

**Request Body:**
```json
{
  "ratingsData": [
    {
      "id": 1,
      "deliveryDate": "2024-08-15T14:30:00Z",
      "punctuality": 4,
      "professionalism": 5,
      "deliveryQuality": 4,
      "communication": 5,
      "overall": 4,
      "comments": "Great service, on time delivery"
    }
    // ... more ratings
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": "Based on 15 deliveries over the past 3 months, John demonstrates consistently strong performance with an average rating of 4.2/5. His strengths include excellent professionalism (4.5) and reliable communication (4.5). Areas for improvement: punctuality has shown a slight decline from 4.2 to 3.8 over the last month, suggesting potential scheduling challenges. Recommendation: Consider route optimization and traffic analysis for better time management.",
    "analysisDate": "2024-08-15T16:00:00Z",
    "dataPoints": 15,
    "timeRange": "90d",
    "strengths": [
      "Professionalism",
      "Communication",
      "Delivery Quality"
    ],
    "improvements": [
      "Punctuality",
      "Time Management"
    ],
    "trends": {
      "overall": "stable",
      "punctuality": "declining",
      "professionalism": "improving"
    }
  }
}
```

### **3. Update Driver AI Insights**
```
PUT /api/drivers/:id/insights
```

**Request Body:**
```json
{
  "aiInsights": "Updated AI analysis text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "aiInsights": "Updated AI analysis text...",
    "aiInsightsUpdatedAt": "2024-08-15T16:00:00Z"
  }
}
```

## 📊 **Updated Driver Model**

Add these fields to the existing driver model:

```json
{
  // ... existing driver fields ...
  
  // AI Insights
  "aiInsights": "AI-generated performance analysis text",
  "aiInsightsUpdatedAt": "2024-08-15T16:00:00Z",
  
  // Performance averages (calculated from ratings)
  "averageRatings": {
    "punctuality": 4.2,
    "professionalism": 4.5,
    "deliveryQuality": 4.0,      // transporter only
    "communication": 4.5,        // transporter only  
    "safety": 4.3,               // in_house only
    "policyCompliance": 4.1,     // in_house only
    "fuelEfficiency": 3.9,       // in_house only
    "overall": 4.2,
    "totalRatings": 15
  },
  
  // Performance trends
  "performanceTrends": {
    "lastMonth": {
      "overall": 4.1,
      "trend": -0.1      // compared to previous month
    },
    "last3Months": {
      "overall": 4.3,
      "trend": 0.1
    }
  }
}
```

## 🎯 **Rating Data Structure**

### **Rating Object:**
```typescript
{
  id: number
  driverId: number
  deliveryId: number
  requestId: number
  deliveryDate: string (ISO date)
  route: string
  origin: string
  destination: string
  driverType: "transporter" | "in_house"
  
  // Common ratings (1-5 scale)
  punctuality: number
  professionalism: number
  overall: number
  comments: string
  
  // Transporter-specific
  deliveryQuality?: number
  communication?: number
  
  // In-house-specific  
  safety?: number
  policyCompliance?: number
  fuelEfficiency?: number
  
  // Metadata
  ratedBy: string
  ratedAt: string (ISO date)
  trend: number        // compared to previous rating
  createdAt: string (ISO date)
}
```

## 🔧 **Business Logic Requirements**

### **Rating Calculations:**
1. **Trend Calculation**: Compare each rating to the driver's previous rating for that criterion
2. **Average Calculations**: Real-time calculation of averages across all ratings
3. **Performance Levels**: 
   - Beginner: < 20 deliveries
   - Experienced: 20-50 deliveries  
   - Expert: > 50 deliveries

### **AI Insights Generation:**
1. **Input**: All ratings for a driver + metadata
2. **Analysis**: Look for patterns, trends, strengths, and areas for improvement
3. **Output**: Human-readable text analysis with actionable insights
4. **Update Frequency**: On-demand (when user clicks "Generate Insights")

### **Rating Type Validation:**
```javascript
// Transporter drivers must have:
- punctuality, professionalism, deliveryQuality, communication, overall, comments

// In-house drivers must have:  
- punctuality, professionalism, safety, policyCompliance, fuelEfficiency, overall, comments
```

## 📋 **Database Schema Additions**

### **New Tables:**

#### **driver_ratings**
```sql
CREATE TABLE driver_ratings (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES drivers(id),
  delivery_id INTEGER NOT NULL REFERENCES deliveries(id),
  request_id INTEGER NOT NULL REFERENCES requests(id),
  delivery_date TIMESTAMP NOT NULL,
  route VARCHAR(255),
  origin VARCHAR(255),
  destination VARCHAR(255),
  driver_type VARCHAR(20) NOT NULL,
  
  -- Common ratings
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comments TEXT,
  
  -- Type-specific ratings
  delivery_quality INTEGER CHECK (delivery_quality >= 1 AND delivery_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  safety INTEGER CHECK (safety >= 1 AND safety <= 5),
  policy_compliance INTEGER CHECK (policy_compliance >= 1 AND policy_compliance <= 5),
  fuel_efficiency INTEGER CHECK (fuel_efficiency >= 1 AND fuel_efficiency <= 5),
  
  -- Metadata
  rated_by VARCHAR(255),
  rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trend DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(driver_id, delivery_id)
);
```

#### **Update drivers table:**
```sql
ALTER TABLE drivers ADD COLUMN ai_insights TEXT;
ALTER TABLE drivers ADD COLUMN ai_insights_updated_at TIMESTAMP;
```

## 🚨 **Validation Rules**

1. **Rating Scores**: Must be integers between 1-5
2. **Type-Specific Fields**: 
   - Transporter: `delivery_quality`, `communication` required
   - In-house: `safety`, `policy_compliance`, `fuel_efficiency` required
3. **Unique Constraint**: One rating per driver per delivery
4. **AI Insights**: Maximum 2000 characters

## 🔄 **API Integration Points**

These endpoints integrate with the existing delivery logging system:

1. When delivery is logged with driver ratings → Create entries in `driver_ratings` table
2. Driver performance data → Calculate and update driver averages
3. AI insights → Generated on-demand and cached in driver record

This completes the rating and AI insights system for comprehensive driver performance tracking! 🎯