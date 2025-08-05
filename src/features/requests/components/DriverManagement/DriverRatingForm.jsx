import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const StarRating = ({ label, value = 0, onChange, required = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverValue || value);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              className={clsx(
                'p-1 rounded transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
            >
              <Star
                className={clsx(
                  'w-5 h-5 transition-colors',
                  isActive
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {value > 0 ? `${value}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  );
};

const transporterCriteria = [
  { key: 'punctuality', label: 'Punctuality', description: 'On-time arrival and delivery' },
  { key: 'professionalism', label: 'Professionalism', description: 'Professional conduct and appearance' },
  { key: 'deliveryQuality', label: 'Delivery Quality', description: 'Care in handling and delivery' },
  { key: 'communication', label: 'Communication', description: 'Clear and timely communication' },
];

const inHouseCriteria = [
  { key: 'punctuality', label: 'Punctuality', description: 'On-time arrival and adherence to schedule' },
  { key: 'professionalism', label: 'Professionalism', description: 'Professional conduct and appearance' },
  { key: 'safety', label: 'Safety Performance', description: 'Adherence to safety protocols' },
  { key: 'policyCompliance', label: 'Policy Adherence', description: 'Following company policies and procedures' },
  { key: 'fuelEfficiency', label: 'Fuel Efficiency', description: 'Efficient driving and fuel usage' },
];

export const DriverRatingForm = ({ 
  driver, 
  rating = {}, 
  onRatingChange, 
  className = "",
  collapsed = false,
  onToggleCollapse
}) => {
  const criteria = driver.type === 'transporter' ? transporterCriteria : inHouseCriteria;
  
  const handleRatingChange = (criterion, value) => {
    const newRating = { ...rating, [criterion]: value };
    
    // Auto-calculate overall rating as average of all criteria
    const ratedCriteria = criteria.filter(c => newRating[c.key] > 0);
    if (ratedCriteria.length > 0) {
      const sum = ratedCriteria.reduce((acc, c) => acc + (newRating[c.key] || 0), 0);
      newRating.overall = Math.round(sum / ratedCriteria.length);
    } else {
      newRating.overall = 0;
    }
    
    onRatingChange(newRating);
  };

  const handleCommentsChange = (e) => {
    onRatingChange({ ...rating, comments: e.target.value });
  };

  if (collapsed) {
    return (
      <div className={clsx("bg-gray-50 dark:bg-gray-700 rounded-lg p-4", className)}>
        <button
          onClick={onToggleCollapse}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Performance Rating
            </span>
            <div className="flex items-center gap-2">
              {rating.overall > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {rating.overall}/5
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Click to {rating.overall > 0 ? 'edit' : 'rate'}
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={clsx("bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4", className)}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Performance Rating
        </h4>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Collapse
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((criterion) => (
          <StarRating
            key={criterion.key}
            label={criterion.label}
            value={rating[criterion.key] || 0}
            onChange={(value) => handleRatingChange(criterion.key, value)}
            required
          />
        ))}
      </div>

      {/* Overall Rating - Auto-calculated */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <StarRating
          label="Overall Rating"
          value={rating.overall || 0}
          onChange={() => {}} // Read-only, calculated automatically
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Automatically calculated from individual ratings
        </p>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comments
        </label>
        <textarea
          value={rating.comments || ''}
          onChange={handleCommentsChange}
          placeholder={`Add comments about ${driver.name}'s performance...`}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
      </div>

      {/* Rating Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Rating Guidelines for {driver.type === 'transporter' ? 'Transporter' : 'In-House'} Drivers
        </h5>
        <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          {criteria.map((criterion) => (
            <div key={criterion.key}>
              <span className="font-medium">{criterion.label}:</span> {criterion.description}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};