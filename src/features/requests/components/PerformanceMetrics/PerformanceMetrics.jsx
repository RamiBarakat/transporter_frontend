import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Truck, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const MetricCard = ({ title, icon: Icon, planned, actual, variance, percentage, type, index }) => {
  const getVarianceColor = (variance, type) => {
    if (variance === 0) return 'text-gray-600';
    
    // For trucks and cost, negative variance is better (less trucks used, less cost)
    // For time, negative variance is better (delivered early)
    const isPositive = variance > 0;
    const isBetter = type === 'time' ? !isPositive : !isPositive;
    
    return isBetter ? 'text-success-600' : 'text-danger-600';
  };

  const getVarianceIcon = (variance) => {
    if (variance === 0) return Minus;
    return variance > 0 ? TrendingUp : TrendingDown;
  };

  const VarianceIcon = getVarianceIcon(variance);
  const varianceColor = getVarianceColor(variance, type);

  const formatValue = (value, type) => {
    switch (type) {
      case 'cost':
        return `$${value?.toLocaleString()}`;
      case 'time':
        return format(new Date(value), 'MMM dd, HH:mm');
      case 'truck':
        return value?.toString();
      default:
        return value;
    }
  };

  const formatVariance = (variance, percentage, type) => {
    switch (type) {
      case 'cost':
        return variance >= 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`;
      case 'time':
        const hours = Math.floor(Math.abs(variance) / 60);
        const minutes = Math.abs(variance) % 60;
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        return variance >= 0 ? `+${timeStr}` : `-${timeStr}`;
      case 'truck':
        return variance >= 0 ? `+${variance}` : variance.toString();
      default:
        return variance;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className={clsx('flex items-center gap-1', varianceColor)}>
          <VarianceIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {formatVariance(variance, percentage, type)}
          </span>
          {percentage && (
            <span className="text-xs">
              ({percentage >= 0 ? '+' : ''}{percentage}%)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Planned</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatValue(planned, type)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Actual</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatValue(actual, type)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const PerformanceMetrics = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Performance Data Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Performance metrics will be available once delivery data is logged.
        </p>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Truck Count',
      icon: Truck,
      planned: metrics.truckVariance.planned,
      actual: metrics.truckVariance.actual,
      variance: metrics.truckVariance.variance,
      percentage: metrics.truckVariance.percentage,
      type: 'truck',
    },
    {
      title: 'Pickup Time',
      icon: Clock,
      planned: metrics.timeVariance.planned,
      actual: metrics.timeVariance.actual,
      variance: metrics.timeVariance.variance,
      type: 'time',
    },
    {
      title: 'Cost',
      icon: DollarSign,
      planned: metrics.costVariance.estimated,
      actual: metrics.costVariance.actual,
      variance: metrics.costVariance.variance,
      percentage: metrics.costVariance.percentage,
      type: 'cost',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>
    </div>
  );
};