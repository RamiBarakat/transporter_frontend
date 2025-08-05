// Driver type constants and rating criteria
export const DRIVER_TYPES = {
  IN_HOUSE: 'in_house',
  TRANSPORTER: 'transporter',
};

export const DRIVER_TYPE_LABELS = {
  [DRIVER_TYPES.IN_HOUSE]: 'In-House',
  [DRIVER_TYPES.TRANSPORTER]: 'Transporter',
};

export const DRIVER_TYPE_COLORS = {
  [DRIVER_TYPES.IN_HOUSE]: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    background: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800',
  },
  [DRIVER_TYPES.TRANSPORTER]: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    background: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-200 dark:border-green-800',
  },
};

// Rating criteria for each driver type
export const RATING_CRITERIA = {
  [DRIVER_TYPES.TRANSPORTER]: [
    { key: 'punctuality', label: 'Punctuality', description: 'On-time arrival and delivery' },
    { key: 'professionalism', label: 'Professionalism', description: 'Professional conduct and appearance' },
    { key: 'deliveryQuality', label: 'Delivery Quality', description: 'Care in handling and delivery' },
    { key: 'communication', label: 'Communication', description: 'Clear and timely communication' },
  ],
  
  [DRIVER_TYPES.IN_HOUSE]: [
    { key: 'punctuality', label: 'Punctuality', description: 'On-time arrival and adherence to schedule' },
    { key: 'professionalism', label: 'Professionalism', description: 'Professional conduct and appearance' },
    { key: 'safety', label: 'Safety Performance', description: 'Adherence to safety protocols' },
    { key: 'policyCompliance', label: 'Policy Adherence', description: 'Following company policies and procedures' },
    { key: 'fuelEfficiency', label: 'Fuel Efficiency', description: 'Efficient driving and fuel usage' },
  ],
};

// Common rating fields required for both types
export const COMMON_RATING_FIELDS = ['punctuality', 'professionalism'];

// Required rating fields by driver type
export const REQUIRED_RATING_FIELDS = {
  [DRIVER_TYPES.TRANSPORTER]: ['punctuality', 'professionalism', 'deliveryQuality', 'communication'],
  [DRIVER_TYPES.IN_HOUSE]: ['punctuality', 'professionalism', 'safety', 'policyCompliance', 'fuelEfficiency'],
};

// Form field configurations for each driver type
export const DRIVER_FORM_FIELDS = {
  [DRIVER_TYPES.TRANSPORTER]: [
    { key: 'transportCompany', label: 'Transport Company', required: true, type: 'text' },
    { key: 'phone', label: 'Phone Number', required: true, type: 'tel' },
    { key: 'licenseNumber', label: 'License Number', required: false, type: 'text' },
  ],
  
  [DRIVER_TYPES.IN_HOUSE]: [
    { key: 'employeeId', label: 'Employee ID', required: true, type: 'text' },
    { key: 'department', label: 'Department', required: true, type: 'text' },
    { key: 'hireDate', label: 'Hire Date', required: false, type: 'date' },
  ],
};

// Validation helpers
export const validateRatingByDriverType = (driverType, rating) => {
  const requiredFields = REQUIRED_RATING_FIELDS[driverType] || [];
  const missingFields = requiredFields.filter(field => !rating[field] || rating[field] < 1);
  
  return {
    isValid: missingFields.length === 0 && rating.overall >= 1,
    missingFields,
    errors: missingFields.map(field => {
      const criteria = RATING_CRITERIA[driverType]?.find(c => c.key === field);
      return `${criteria?.label || field} rating is required`;
    }),
  };
};

// Helper to get driver type configuration
export const getDriverTypeConfig = (driverType) => ({
  type: driverType,
  label: DRIVER_TYPE_LABELS[driverType],
  colors: DRIVER_TYPE_COLORS[driverType],
  ratingCriteria: RATING_CRITERIA[driverType] || [],
  formFields: DRIVER_FORM_FIELDS[driverType] || [],
  requiredRatingFields: REQUIRED_RATING_FIELDS[driverType] || [],
});