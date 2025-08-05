# Backend API Requirements - Executive Dashboard Feature

This document outlines the complete backend API requirements for the Executive Dashboard feature in the Transportation Management System.

## 🎯 **Overview**

The Executive Dashboard provides real-time insights into transportation operations with AI-powered analytics, performance tracking, and intelligent recommendations. The frontend is fully implemented and requires these backend endpoints to function.

---

## 📊 **1. KPI Metrics API**

### **Endpoint:** `GET /api/dashboard/kpi`

**Purpose:** Fetch key performance indicators with trends and AI insights

**Query Parameters:**
- `startDate` (string, ISO date): Start of date range (default: 30 days ago)
- `endDate` (string, ISO date): End of date range (default: today)
- `period` (string, optional): Comparison period (`month`, `quarter`, `year`)

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "on-time-delivery",
      "title": "On-Time Delivery Rate",
      "value": 87.3,
      "unit": "%",
      "trend": 2.1,
      "comparison": {
        "change": 2.1,
        "period": "last month",
        "unit": "%"
      },
      "formattedValue": "87.3%",
      "aiInsight": "Performance improved due to better route optimization. Consider expanding successful routes to underperforming areas.",
      "lastUpdated": "2024-08-15T14:30:00Z"
    },
    {
      "id": "cost-variance",
      "title": "Cost Variance",
      "value": -5.2,
      "unit": "%",
      "trend": -1.8,
      "comparison": {
        "change": -1.8,
        "period": "last month",
        "unit": "%"
      },
      "formattedValue": "-5.2%",
      "aiInsight": "Costs are 5.2% under budget. Fuel efficiency improvements and negotiated rates are key drivers.",
      "lastUpdated": "2024-08-15T14:30:00Z"
    },
    {
      "id": "fleet-utilization",
      "title": "Fleet Utilization",
      "value": 78.9,
      "unit": "%",
      "trend": 0.7,
      "comparison": {
        "change": 0.7,
        "period": "last month",
        "unit": "%"
      },
      "formattedValue": "78.9%",
      "aiInsight": "Utilization is stable but could improve. Consider dynamic routing during peak hours.",
      "lastUpdated": "2024-08-15T14:30:00Z"
    },
    {
      "id": "driver-performance",
      "title": "Driver Performance",
      "value": 4.2,
      "unit": "/5",
      "trend": 0.3,
      "comparison": {
        "change": 0.3,
        "period": "last month",
        "unit": " points"
      },
      "formattedValue": "4.2/5",
      "aiInsight": "Driver ratings show steady improvement. Training programs are having positive impact.",
      "lastUpdated": "2024-08-15T14:30:00Z"
    }
  ]
}
```

**Business Logic:**
- **On-Time Delivery Rate**: `(Deliveries completed on or before scheduled time / Total deliveries) * 100`
- **Cost Variance**: `((Actual costs - Budgeted costs) / Budgeted costs) * 100`
- **Fleet Utilization**: `(Active vehicles / Total available vehicles) * 100`
- **Driver Performance**: Average of all driver ratings in the period

---

## 📈 **2. Performance Trends API**

### **Endpoint:** `GET /api/dashboard/trends`

**Purpose:** Fetch 30-day performance trends for chart visualization

**Query Parameters:**
- `startDate` (string, ISO date): Start of date range
- `endDate` (string, ISO date): End of date range
- `granularity` (string): `daily`, `weekly`, `monthly` (default: `daily`)

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-07-16",
      "dateFormatted": "Jul 16",
      "onTimeDelivery": 85.2,
      "costVariance": -3.1,
      "fleetUtilization": 76.8,
      "driverPerformance": 4.1,
      "totalDeliveries": 45,
      "averageCost": 1850.50
    },
    {
      "date": "2024-07-17",
      "dateFormatted": "Jul 17",
      "onTimeDelivery": 87.6,
      "costVariance": -5.2,
      "fleetUtilization": 78.3,
      "driverPerformance": 4.3,
      "totalDeliveries": 52,
      "averageCost": 1795.25
    }
    // ... 30 days of data
  ],
  "summary": {
    "averageOnTime": 87.3,
    "averageCostVariance": -4.2,
    "averageUtilization": 78.9,
    "averageDriverPerformance": 4.2,
    "totalDeliveries": 1456,
    "trend": "improving"
  }
}
```

**Database Queries Needed:**
```sql
-- Daily aggregation example
SELECT 
  DATE(delivery_date) as date,
  COUNT(*) as total_deliveries,
  AVG(CASE WHEN actual_delivery_time <= scheduled_delivery_time THEN 1 ELSE 0 END) * 100 as on_time_rate,
  AVG(cost_variance_percentage) as cost_variance,
  AVG(driver_ratings.overall_rating) as driver_performance
FROM deliveries d
LEFT JOIN driver_ratings dr ON d.id = dr.delivery_id
WHERE delivery_date BETWEEN ? AND ?
GROUP BY DATE(delivery_date)
ORDER BY date;
```

---

## 🧠 **3. AI Insights API**

### **Endpoint:** `GET /api/dashboard/ai-insights`

**Purpose:** Fetch AI-generated insights and recommendations

**Query Parameters:**
- `startDate` (string, ISO date): Analysis period start
- `endDate` (string, ISO date): Analysis period end
- `severity` (string, optional): Filter by severity (`high`, `medium`, `low`)
- `limit` (number, optional): Max insights to return (default: 10)

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "route-optimization-001",
      "title": "Route Optimization Opportunity",
      "description": "Dallas-Houston route shows 15% efficiency improvement potential through traffic pattern analysis.",
      "severity": "medium",
      "confidence": 87,
      "category": "optimization",
      "impact": {
        "type": "cost_reduction",
        "estimatedSavings": 12500,
        "currency": "USD",
        "timeframe": "monthly"
      },
      "recommendation": "Implement dynamic routing during 7-9 AM and 5-7 PM time windows to reduce average delivery time by 23 minutes.",
      "dataPoints": [
        "156 deliveries analyzed",
        "Traffic pattern correlation: 0.78",
        "Weather impact factor: 0.23"
      ],
      "actionItems": [
        "Review traffic API integration",
        "Test dynamic routing on 3 trial routes",
        "Measure impact after 2 weeks"
      ],
      "relatedMetrics": ["on-time-delivery", "cost-variance"],
      "generatedAt": "2024-08-15T14:30:00Z",
      "expiresAt": "2024-08-22T14:30:00Z"
    },
    {
      "id": "cost-anomaly-002",
      "title": "Cost Anomaly Detected",
      "description": "Transporter ABC fuel costs are 12% higher than industry average for similar routes.",
      "severity": "high",
      "confidence": 94,
      "category": "anomaly",
      "impact": {
        "type": "cost_increase",
        "estimatedImpact": 8750,
        "currency": "USD",
        "timeframe": "monthly"
      },
      "recommendation": "Review fuel efficiency metrics and consider renegotiating rates or switching to alternative transporters.",
      "dataPoints": [
        "45 deliveries affected",
        "Cost deviation: +12.3%",
        "Industry benchmark: $3.45/mile"
      ],
      "actionItems": [
        "Audit Transporter ABC fuel reports",
        "Request competitive quotes",
        "Implement fuel efficiency monitoring"
      ],
      "relatedMetrics": ["cost-variance"],
      "generatedAt": "2024-08-15T14:15:00Z",
      "expiresAt": "2024-08-18T14:15:00Z"
    }
  ],
  "meta": {
    "totalInsights": 12,
    "severityBreakdown": {
      "high": 3,
      "medium": 6,
      "low": 3
    },
    "lastAnalysisRun": "2024-08-15T14:30:00Z",
    "nextAnalysisScheduled": "2024-08-15T18:30:00Z"
  }
}
```

**AI Analysis Categories:**
- **Anomaly Detection**: Unusual patterns in cost, timing, or performance
- **Optimization**: Efficiency improvement opportunities
- **Prediction**: Future trend forecasts
- **Risk Assessment**: Potential operational risks
- **Benchmarking**: Performance vs industry standards

---

## 🚛 **4. Transporter Comparison API**

### **Endpoint:** `GET /api/dashboard/transporter-comparison`

**Purpose:** Fetch AI-powered transporter performance comparison

**Query Parameters:**
- `startDate` (string, ISO date): Analysis period start
- `endDate` (string, ISO date): Analysis period end
- `minDeliveries` (number, optional): Minimum deliveries for inclusion (default: 10)
- `sortBy` (string): `aiScore`, `onTimeRate`, `costPerformance` (default: `aiScore`)

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc-logistics",
      "company": "ABC Logistics",
      "type": "transporter",
      "totalDeliveries": 245,
      "aiScore": 92.5,
      "scoreTrend": 1.2,
      "onTimeRate": 94.2,
      "onTimeTrend": 0.8,
      "costVariance": -3.1,
      "costTrend": -0.5,
      "driverRating": 4.6,
      "qualityScore": 89.3,
      "performance": {
        "punctuality": 94.2,
        "reliability": 91.8,
        "costEfficiency": 88.9,
        "customerSatisfaction": 4.6,
        "compliance": 96.1
      },
      "metrics": {
        "averageDeliveryTime": 2.3,
        "averageCostPerMile": 3.25,
        "damageClaims": 0.002,
        "fuelEfficiency": 7.8,
        "responseTime": 1.2
      },
      "aiInsights": [
        "Consistently exceeds delivery expectations",
        "Cost performance improved 15% vs last quarter",
        "Driver satisfaction scores trending upward"
      ],
      "contractDetails": {
        "preferredRoutes": ["Dallas-Houston", "Austin-San Antonio"],
        "rateNegotiation": "due_for_renewal",
        "volume": "high"
      },
      "lastDelivery": "2024-08-15T12:30:00Z"
    },
    {
      "id": "swift-transport",
      "company": "Swift Transport",
      "type": "transporter",
      "totalDeliveries": 189,
      "aiScore": 87.8,
      "scoreTrend": -0.3,
      "onTimeRate": 91.7,
      "onTimeTrend": -1.2,
      "costVariance": 2.4,
      "costTrend": 1.8,
      "driverRating": 4.3,
      "qualityScore": 85.6,
      "performance": {
        "punctuality": 91.7,
        "reliability": 88.4,
        "costEfficiency": 82.1,
        "customerSatisfaction": 4.3,
        "compliance": 89.7
      },
      "metrics": {
        "averageDeliveryTime": 2.6,
        "averageCostPerMile": 3.58,
        "damageClaims": 0.005,
        "fuelEfficiency": 7.2,
        "responseTime": 1.8
      },
      "aiInsights": [
        "Performance declining over last 2 months",
        "Cost variance increasing - investigate pricing",
        "Driver turnover affecting consistency"
      ],
      "contractDetails": {
        "preferredRoutes": ["Houston-Dallas", "Fort Worth-Austin"],
        "rateNegotiation": "stable",
        "volume": "medium"
      },
      "lastDelivery": "2024-08-14T16:45:00Z"
    }
  ],
  "meta": {
    "totalTransporters": 8,
    "totalDeliveries": 1456,
    "analysisDate": "2024-08-15T14:30:00Z",
    "benchmarks": {
      "industryAvgOnTime": 88.5,
      "industryAvgCost": 3.42,
      "industryAvgRating": 4.1
    }
  }
}
```

**AI Scoring Algorithm:**
```javascript
// Weighted AI Score Calculation
aiScore = (
  punctuality * 0.25 +           // 25% weight
  reliability * 0.20 +           // 20% weight  
  costEfficiency * 0.25 +        // 25% weight
  customerSatisfaction * 20 +    // 20% weight (4.5/5 = 90%)
  compliance * 0.10              // 10% weight
);
```

---

## 🗄️ **5. Database Schema Requirements**

### **New Tables Needed:**

#### **dashboard_kpi_cache**
```sql
CREATE TABLE dashboard_kpi_cache (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  on_time_delivery_rate DECIMAL(5,2),
  cost_variance_percentage DECIMAL(5,2),
  fleet_utilization_rate DECIMAL(5,2),
  driver_performance_avg DECIMAL(3,2),
  total_deliveries INTEGER,
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(date),
  INDEX idx_date (date)
);
```

#### **ai_insights**
```sql
CREATE TABLE ai_insights (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity ENUM('high', 'medium', 'low') NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  category VARCHAR(50) NOT NULL,
  recommendation TEXT,
  data_points JSON,
  action_items JSON,
  related_metrics JSON,
  estimated_impact DECIMAL(10,2),
  impact_type VARCHAR(50),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  status ENUM('active', 'resolved', 'ignored') DEFAULT 'active',
  
  INDEX idx_severity_generated (severity, generated_at),
  INDEX idx_category (category),
  INDEX idx_expires_at (expires_at)
);
```

#### **transporter_performance_cache**
```sql
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
  performance_metrics JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (transporter_id) REFERENCES transporters(id),
  UNIQUE(transporter_id, date),
  INDEX idx_transporter_date (transporter_id, date),
  INDEX idx_ai_score (ai_score DESC)
);
```

---

## ⚡ **6. Performance Optimization**

### **Caching Strategy:**
- **KPI Data**: Cache daily aggregations, refresh every 30 minutes
- **Trends Data**: Cache daily, refresh nightly at 2 AM
- **AI Insights**: Cache for 4 hours, regenerate based on new data
- **Transporter Comparison**: Cache daily, refresh every 6 hours

### **Database Optimization:**
```sql
-- Indexes for performance
CREATE INDEX idx_deliveries_date_status ON deliveries(delivery_date, status);
CREATE INDEX idx_driver_ratings_delivery_date ON driver_ratings(delivery_id, created_at);
CREATE INDEX idx_requests_created_status ON requests(created_at, status);

-- Materialized views for heavy aggregations
CREATE MATERIALIZED VIEW mv_daily_kpi AS
SELECT 
  DATE(delivery_date) as date,
  COUNT(*) as total_deliveries,
  AVG(CASE WHEN status = 'completed_on_time' THEN 1 ELSE 0 END) * 100 as on_time_rate,
  AVG(cost_variance_percentage) as avg_cost_variance,
  AVG(dr.overall_rating) as avg_driver_rating
FROM deliveries d
LEFT JOIN driver_ratings dr ON d.id = dr.delivery_id
WHERE delivery_date >= CURRENT_DATE - INTERVAL 90 DAY
GROUP BY DATE(delivery_date);

-- Refresh schedule
-- REFRESH MATERIALIZED VIEW mv_daily_kpi; -- Run every hour
```

---

## 🤖 **7. AI/ML Integration Requirements**

### **AI Insights Generation:**
```python
# Example AI analysis pipeline
def generate_insights(date_range):
    insights = []
    
    # Anomaly Detection
    cost_anomalies = detect_cost_anomalies(date_range)
    performance_anomalies = detect_performance_drops(date_range)
    
    # Pattern Recognition
    route_patterns = analyze_route_efficiency(date_range)
    seasonal_patterns = detect_seasonal_trends(date_range)
    
    # Predictive Analytics
    demand_forecast = predict_demand(date_range)
    cost_predictions = predict_cost_trends(date_range)
    
    # Generate recommendations
    for anomaly in cost_anomalies:
        insights.append(create_cost_insight(anomaly))
    
    for pattern in route_patterns:
        insights.append(create_optimization_insight(pattern))
    
    return insights
```

### **ML Model Requirements:**
- **Anomaly Detection**: Isolation Forest or LSTM for time series
- **Demand Forecasting**: ARIMA or Prophet for seasonal patterns
- **Route Optimization**: Genetic Algorithm or Simulated Annealing
- **Performance Scoring**: Weighted ensemble model

---

## 🔧 **8. API Implementation Notes**

### **Error Handling:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_DATA",
    "message": "Not enough data available for the specified date range",
    "details": {
      "minDaysRequired": 7,
      "daysProvided": 3
    }
  }
}
```

### **Rate Limiting:**
- **KPI/Trends**: 60 requests/minute per user
- **AI Insights**: 20 requests/minute per user (computationally expensive)
- **Transporter Comparison**: 30 requests/minute per user

### **Security:**
- All endpoints require authentication
- Role-based access (executives can see all data, managers see filtered)
- Audit logging for sensitive performance data access

---

## 📋 **9. Testing Requirements**

### **Unit Tests:**
- KPI calculation accuracy
- Trend aggregation logic  
- AI scoring algorithms
- Date range validation

### **Integration Tests:**
- Full dashboard data pipeline
- Cache invalidation scenarios
- Performance under load
- Cross-metric consistency

### **Performance Tests:**
- Response time < 500ms for cached data
- Response time < 2s for real-time calculations
- Handle 100 concurrent dashboard requests
- Memory usage optimization for large datasets

---

## 🚀 **10. Deployment Checklist**

### **Environment Variables:**
```env
# AI/ML Configuration
AI_INSIGHTS_ENABLED=true
AI_MODEL_ENDPOINT=https://ml-api.company.com
AI_CONFIDENCE_THRESHOLD=70

# Caching Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL_KPI=1800
CACHE_TTL_TRENDS=86400
CACHE_TTL_INSIGHTS=14400

# Performance Configuration
DB_POOL_SIZE=20
QUERY_TIMEOUT=30000
ENABLE_QUERY_OPTIMIZATION=true
```

### **Database Migrations:**
1. Create new tables (dashboard_kpi_cache, ai_insights, transporter_performance_cache)
2. Add indexes for performance
3. Create materialized views
4. Set up refresh schedules

### **Monitoring:**
- API response times
- Cache hit rates
- AI insight generation success rate
- Database query performance
- Memory and CPU usage

---

## 📊 **11. Sample Data for Testing**

### **Mock KPI Data:**
```json
{
  "date": "2024-08-15",
  "on_time_delivery_rate": 87.3,
  "cost_variance": -5.2,
  "fleet_utilization": 78.9,
  "driver_performance": 4.2,
  "total_deliveries": 45,
  "total_cost": 83750.50
}
```

### **Mock AI Insight:**
```json
{
  "id": "route-opt-001",
  "title": "Route Optimization Opportunity",
  "description": "Dallas-Houston route efficiency can improve by 15%",
  "severity": "medium",
  "confidence": 87,
  "recommendation": "Implement dynamic routing during peak hours"
}
```

---

## 🎯 **Success Criteria**

✅ All endpoints return data in specified format  
✅ Response times meet performance requirements  
✅ AI insights are relevant and actionable  
✅ Caching strategy reduces database load  
✅ Dashboard updates in real-time  
✅ Historical data is accurately aggregated  
✅ Transporter comparisons are fair and consistent  

---

**This completes the backend requirements for the Executive Dashboard feature. The frontend is fully implemented and ready to consume these APIs once built!** 🚀