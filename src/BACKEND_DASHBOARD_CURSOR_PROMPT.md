# 🎯 Backend Dashboard Implementation - Cursor AI Prompt

**Copy and paste this into Cursor AI for backend development:**

---

## Build Executive Dashboard APIs for Transportation Management System

### **Context:**
I need to build backend APIs for an Executive Dashboard that shows transportation KPIs, performance trends, AI insights, and transporter comparisons. The frontend is already built and expects specific JSON response formats.

### **Tech Stack:** 
Node.js + Express + Sequelize (PostgreSQL) + Redis caching

### **Required Endpoints:**

#### **1. KPI Metrics API**
```javascript
GET /api/dashboard/kpi?startDate=2024-07-16&endDate=2024-08-15

// Response format:
{
  "success": true,
  "data": [
    {
      "id": "on-time-delivery",
      "title": "On-Time Delivery Rate", 
      "value": 87.3,
      "unit": "%",
      "trend": 2.1,
      "comparison": { "change": 2.1, "period": "last month" },
      "aiInsight": "Performance improved due to better route optimization"
    },
    {
      "id": "cost-variance",
      "title": "Cost Variance",
      "value": -5.2,
      "unit": "%", 
      "trend": -1.8,
      "comparison": { "change": -1.8, "period": "last month" },
      "aiInsight": "Costs are 5.2% under budget due to fuel efficiency"
    },
    {
      "id": "fleet-utilization", 
      "title": "Fleet Utilization",
      "value": 78.9,
      "unit": "%",
      "trend": 0.7,
      "comparison": { "change": 0.7, "period": "last month" },
      "aiInsight": "Stable utilization, consider dynamic routing"
    },
    {
      "id": "driver-performance",
      "title": "Driver Performance", 
      "value": 4.2,
      "unit": "/5",
      "trend": 0.3,
      "comparison": { "change": 0.3, "period": "last month" },
      "aiInsight": "Steady improvement from training programs"
    }
  ]
}
```

#### **2. Performance Trends API**
```javascript
GET /api/dashboard/trends?startDate=2024-07-16&endDate=2024-08-15

// Response: 30 days of daily metrics for charts
{
  "success": true,
  "data": [
    {
      "date": "2024-07-16",
      "dateFormatted": "Jul 16", 
      "onTimeDelivery": 85.2,
      "costVariance": -3.1,
      "fleetUtilization": 76.8,
      "driverPerformance": 4.1
    }
    // ... 30 days of data
  ]
}
```

#### **3. AI Insights API**  
```javascript
GET /api/dashboard/ai-insights?startDate=2024-07-16&endDate=2024-08-15

// Response: Smart insights with severity levels
{
  "success": true,
  "data": [
    {
      "id": "route-optimization-001",
      "title": "Route Optimization Opportunity",
      "description": "Dallas-Houston route shows 15% efficiency improvement potential",
      "severity": "medium", // high, medium, low
      "confidence": 87,
      "recommendation": "Implement dynamic routing during 7-9 AM and 5-7 PM"
    },
    {
      "id": "cost-anomaly-002", 
      "title": "Cost Anomaly Detected",
      "description": "Transporter ABC fuel costs 12% higher than average",
      "severity": "high",
      "confidence": 94,
      "recommendation": "Review fuel efficiency and consider renegotiating rates"
    }
  ]
}
```

#### **4. Transporter Comparison API**
```javascript
GET /api/dashboard/transporter-comparison?startDate=2024-07-16&endDate=2024-08-15

// Response: Ranked transporter performance
{
  "success": true,
  "data": [
    {
      "id": "abc-logistics",
      "company": "ABC Logistics",
      "totalDeliveries": 245,
      "aiScore": 92.5,       // Weighted performance score
      "scoreTrend": 1.2,     // Trend vs previous period
      "onTimeRate": 94.2,
      "onTimeTrend": 0.8,
      "costVariance": -3.1,
      "costTrend": -0.5,
      "driverRating": 4.6,
      "qualityScore": 89.3
    }
    // ... more transporters sorted by aiScore
  ]
}
```

### **Database Schema:**

```sql
-- KPI cache table for performance
CREATE TABLE dashboard_kpi_cache (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  on_time_delivery_rate DECIMAL(5,2),
  cost_variance_percentage DECIMAL(5,2), 
  fleet_utilization_rate DECIMAL(5,2),
  driver_performance_avg DECIMAL(3,2),
  total_deliveries INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI insights storage
CREATE TABLE ai_insights (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity ENUM('high', 'medium', 'low'),
  confidence INTEGER,
  recommendation TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  status ENUM('active', 'resolved') DEFAULT 'active'
);

-- Transporter performance cache
CREATE TABLE transporter_performance_cache (
  id SERIAL PRIMARY KEY,
  transporter_id INTEGER NOT NULL,
  date DATE NOT NULL,
  ai_score DECIMAL(5,2),
  on_time_rate DECIMAL(5,2),
  cost_variance DECIMAL(5,2),
  driver_rating DECIMAL(3,2),
  quality_score DECIMAL(5,2),
  total_deliveries INTEGER,
  UNIQUE(transporter_id, date)
);
```

### **Business Logic Calculations:**

```javascript
// KPI Calculations
const calculateKPIs = async (startDate, endDate) => {
  // On-Time Delivery Rate
  const onTimeRate = await db.query(`
    SELECT 
      COUNT(CASE WHEN actual_delivery_time <= scheduled_delivery_time THEN 1 END) * 100.0 / COUNT(*) as rate
    FROM deliveries 
    WHERE delivery_date BETWEEN ? AND ? AND status = 'completed'
  `, [startDate, endDate]);

  // Cost Variance  
  const costVariance = await db.query(`
    SELECT 
      AVG((actual_cost - estimated_cost) / estimated_cost * 100) as variance
    FROM requests
    WHERE pickup_date_time BETWEEN ? AND ? AND status = 'completed'
  `, [startDate, endDate]);

  // Fleet Utilization
  const utilization = await db.query(`
    SELECT 
      COUNT(DISTINCT vehicle_id) * 100.0 / (SELECT COUNT(*) FROM vehicles WHERE active = true) as rate
    FROM deliveries
    WHERE delivery_date BETWEEN ? AND ?
  `, [startDate, endDate]);

  // Driver Performance  
  const driverPerf = await db.query(`
    SELECT AVG(overall_rating) as avg_rating
    FROM driver_ratings dr
    JOIN deliveries d ON dr.delivery_id = d.id
    WHERE d.delivery_date BETWEEN ? AND ?
  `, [startDate, endDate]);

  return {
    onTimeDelivery: onTimeRate[0].rate,
    costVariance: costVariance[0].variance, 
    fleetUtilization: utilization[0].rate,
    driverPerformance: driverPerf[0].avg_rating
  };
};

// AI Score Calculation for Transporters
const calculateAIScore = (metrics) => {
  return (
    metrics.onTimeRate * 0.30 +      // 30% weight
    (100 + metrics.costVariance) * 0.25 +  // 25% weight (cost savings)
    metrics.driverRating * 20 +      // 20% weight (4.5/5 = 90%)
    metrics.qualityScore * 0.25      // 25% weight
  );
};
```

### **Caching Strategy:**
- Cache KPI data for 30 minutes using Redis
- Cache trends data for 6 hours  
- Cache AI insights for 4 hours
- Cache transporter comparison for 2 hours

### **Implementation Requirements:**

1. **Create API controllers** for each endpoint with proper error handling
2. **Implement caching layer** using Redis for performance
3. **Add database aggregation queries** for KPI calculations
4. **Generate mock AI insights** (or integrate with ML service)
5. **Add proper validation** for date ranges and parameters
6. **Include trend calculations** comparing current vs previous periods
7. **Implement transporter ranking** algorithm with weighted scoring
8. **Add proper logging** and monitoring for dashboard APIs

### **Sample Controller Structure:**
```javascript
// controllers/dashboardController.js
class DashboardController {
  static async getKPIData(req, res) {
    const { startDate, endDate } = req.query;
    
    // Check cache first
    const cacheKey = `kpi:${startDate}:${endDate}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    
    // Calculate KPIs
    const kpis = await calculateKPIs(startDate, endDate);
    const trends = await calculateTrends(startDate, endDate);
    const insights = await generateAIInsights(kpis);
    
    const response = formatKPIResponse(kpis, trends, insights);
    
    // Cache for 30 minutes
    await redis.setex(cacheKey, 1800, JSON.stringify(response));
    
    res.json(response);
  }
  
  // ... other methods
}
```

### **Error Handling:**
```javascript
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_DATA",
    "message": "Not enough data for specified date range"
  }
}
```

**Focus on getting the data structures right first, then optimize for performance. The frontend expects exactly these JSON formats!**