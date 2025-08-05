import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  MessageSquare,
  Truck,
  Filter,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';
import { format, isValid } from 'date-fns';

// Helper function to safely format dates
const formatSafeDate = (dateValue, formatStr = 'MMM dd, yyyy', fallback = 'Invalid date') => {
  if (!dateValue) return fallback;
  
  const date = new Date(dateValue);
  if (!isValid(date)) return fallback;
  
  return format(date, formatStr);
};

const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={clsx(
            'text-yellow-400 fill-current',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
          )}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={clsx('text-gray-300', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={clsx('text-yellow-400 fill-current', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={clsx('text-gray-300', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className={clsx(
        'ml-1 text-gray-600 dark:text-gray-400',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const RatingCriteria = ({ driver, rating }) => {
  const criteria = driver.type === 'transporter' 
    ? ['punctuality', 'professionalism', 'deliveryQuality', 'communication']
    : ['punctuality', 'professionalism', 'safety', 'policyCompliance', 'fuelEfficiency'];

  const criteriaLabels = {
    punctuality: 'Punctuality',
    professionalism: 'Professionalism',
    deliveryQuality: 'Delivery Quality',
    communication: 'Communication',
    safety: 'Safety',
    policyCompliance: 'Policy Compliance',
    fuelEfficiency: 'Fuel Efficiency'
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {criteria.map(criterion => (
        <div key={criterion} className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {criteriaLabels[criterion]}
          </span>
          <StarRating rating={rating[criterion] || 0} size="sm" />
        </div>
      ))}
    </div>
  );
};

const RatingCard = ({ rating, index }) => {
  const [expanded, setExpanded] = useState(false);
  const getRatingTrend = () => {
    if (rating.trend > 0) return { icon: TrendingUp, color: 'text-green-500', text: '+' + rating.trend.toFixed(1) };
    if (rating.trend < 0) return { icon: TrendingDown, color: 'text-red-500', text: rating.trend.toFixed(1) };
    return { icon: BarChart3, color: 'text-gray-400', text: '0.0' };
  };

  const trend = getRatingTrend();
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Delivery #{rating.delivery.id}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatSafeDate(rating.delivery.actualPickupDateTime, 'MMM dd, yyyy', 'Date not available')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TrendIcon className={clsx('w-4 h-4', trend.color)} />
            <span className={clsx('text-sm font-medium', trend.color)}>
              {trend.text}
            </span>
          </div>
          <StarRating rating={rating.overall || 0} />
        </div>
      </div>

      {/* Route Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {rating.route || (rating.request && `${rating.request.origin} → ${rating.request.destination}`) || 'Route not available'}
      </div>

      {/* Detailed Ratings */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3"
        >
          <RatingCriteria driver={{ type: rating.fuelEfficiency ? 'in_house' : 'transporter' }} rating={rating} />
          
          {rating.comments && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Comments
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {rating.comments}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        {expanded ? 'Show Less' : 'Show Details'}
        <ChevronDown className={clsx('w-4 h-4 transition-transform', expanded && 'rotate-180')} />
      </button>
    </motion.div>
  );
};

const PerformanceOverview = ({ ratings, driver, performanceSummary }) => {
  const criteria = driver.type === 'transporter' 
    ? ['punctuality', 'professionalism', 'deliveryQuality', 'communication']
    : ['punctuality', 'professionalism', 'safety', 'policyCompliance', 'fuelEfficiency'];

  // Map frontend criteria names to backend field names
  const criteriaMapping = {
    punctuality: 'averagePunctuality',
    professionalism: 'averageProfessionalism',
    deliveryQuality: 'averageDeliveryQuality',
    communication: 'averageCommunication',
    safety: 'averageSafety',
    policyCompliance: 'averagePolicyCompliance',
    fuelEfficiency: 'averageFuelEfficiency'
  };

  // Use backend-provided averages if available, otherwise calculate from ratings
  const averages = criteria.reduce((acc, criterion) => {
    const backendFieldName = criteriaMapping[criterion];
    
    if (performanceSummary && performanceSummary[backendFieldName] !== undefined) {
      // Use backend average
      acc[criterion] = performanceSummary[backendFieldName] || 0;
    } else {
      // Fallback to frontend calculation
      const values = ratings.map(r => r[criterion]).filter(v => v != null);
      acc[criterion] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    }
    return acc;
  }, {});
  
  // Calculate overall average and total ratings from backend data
  const overallAverage = performanceSummary?.averageOverall ?? 
    (ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.overall || 0), 0) / ratings.length : 0);
  const totalRatings = performanceSummary?.totalRatings ?? ratings.length;

  const criteriaLabels = {
    punctuality: 'Punctuality',
    professionalism: 'Professionalism',
    deliveryQuality: 'Delivery Quality',
    communication: 'Communication',
    safety: 'Safety',
    policyCompliance: 'Policy Compliance',
    fuelEfficiency: 'Fuel Efficiency'
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Overview
      </h3>
      
      {/* Overall Rating */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {overallAverage.toFixed(1)}
        </div>
        <StarRating rating={overallAverage} size="md" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Average from {totalRatings} delivery{totalRatings !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Criteria Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map(criterion => (
          <div key={criterion} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {criteriaLabels[criterion]}
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={averages[criterion]} size="sm" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {averages[criterion].toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DriverRatingsHistory = ({ 
  driver, 
  ratings = [], 
  performanceSummary = null,
  isLoading = false,
  onGenerateInsights 
}) => {
  const [sortBy, setSortBy] = useState('date');

  const formatStringNewLine = (text) => {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  };



  // Sort ratings based on selected criteria
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.deliveryDate || b.createdAt) - new Date(a.deliveryDate || a.createdAt);
    } else if (sortBy === 'rating') {
      return (b.overall || 0) - (a.overall || 0);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ratings.length === 0 && !performanceSummary) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No ratings yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This driver hasn't received any performance ratings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <PerformanceOverview 
        ratings={sortedRatings} 
        driver={driver} 
        performanceSummary={performanceSummary} 
      />

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Performance Insights
          </h3>
          <button
            onClick={() => {
              if (!driver) {
                console.error('No driver object available');
                return;
              }
              if (!driver.id) {
                console.error('Driver ID is missing');
                return;
              }
              
              onGenerateInsights?.(driver, sortedRatings);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Generate Insights
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          {driver.aiInsights ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {driver.aiInsights}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Last updated: {formatSafeDate(driver.aiInsightsUpdatedAt || Date.now(), 'MMM dd, yyyy HH:mm', 'Never')}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Click "Generate Insights" to get AI-powered performance analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Performance History ({sortedRatings.length} delivery{sortedRatings.length !== 1 ? 's' : ''})
        </h4>
        
        {sortedRatings.map((rating, index) => (
          <RatingCard
            key={rating.deliveryId}
            rating={rating}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};