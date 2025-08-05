import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import clsx from 'clsx';

const AlertCard = ({ type, title, message, severity, index }) => {
  const severityConfig = {
    low: {
      icon: Info,
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      borderClass: 'border-blue-200 dark:border-blue-800',
      iconClass: 'text-blue-600 dark:text-blue-400',
      textClass: 'text-blue-800 dark:text-blue-200',
    },
    medium: {
      icon: AlertTriangle,
      bgClass: 'bg-warning-50 dark:bg-warning-900/20',
      borderClass: 'border-warning-200 dark:border-warning-800',
      iconClass: 'text-warning-600 dark:text-warning-400',
      textClass: 'text-warning-800 dark:text-warning-200',
    },
    high: {
      icon: XCircle,
      bgClass: 'bg-danger-50 dark:bg-danger-900/20',
      borderClass: 'border-danger-200 dark:border-danger-800',
      iconClass: 'text-danger-600 dark:text-danger-400',
      textClass: 'text-danger-800 dark:text-danger-200',
    },
    success: {
      icon: CheckCircle,
      bgClass: 'bg-success-50 dark:bg-success-900/20',
      borderClass: 'border-success-200 dark:border-success-800',
      iconClass: 'text-success-600 dark:text-success-400',
      textClass: 'text-success-800 dark:text-success-200',
    },
  };

  const config = severityConfig[severity] || severityConfig.low;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border',
        config.bgClass,
        config.borderClass
      )}
    >
      <Icon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', config.iconClass)} />
      <div>
        <h4 className={clsx('font-medium', config.textClass)}>{title}</h4>
        <p className={clsx('text-sm mt-1', config.textClass)}>{message}</p>
      </div>
    </motion.div>
  );
};

export const VarianceAlerts = ({ metrics }) => {
  if (!metrics) return null;

  const alerts = [];

  // Truck variance alerts
  const truckVariance = metrics.truckVariance.variance;
  if (truckVariance !== 0) {
    const severity = Math.abs(truckVariance) >= 2 ? 'high' : 'medium';
    alerts.push({
      type: 'truck',
      title: truckVariance > 0 ? 'More Trucks Used' : 'Fewer Trucks Used',
      message: truckVariance > 0 
        ? `${truckVariance} more truck(s) than planned. This may indicate insufficient planning or unexpected cargo volume.`
        : `${Math.abs(truckVariance)} fewer truck(s) than planned. Excellent optimization!`,
      severity: truckVariance > 0 ? severity : 'success',
    });
  }

  // Time variance alerts
  const timeVariance = metrics.timeVariance.variance; // in minutes
  if (Math.abs(timeVariance) >= 30) { // 30+ minutes variance
    const hours = Math.floor(Math.abs(timeVariance) / 60);
    const minutes = Math.abs(timeVariance) % 60;
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    let severity = 'medium';
    if (Math.abs(timeVariance) >= 120) severity = 'high'; // 2+ hours
    
    alerts.push({
      type: 'time',
      title: timeVariance > 0 ? 'Delivery Delay' : 'Early Delivery',
      message: timeVariance > 0
        ? `Delivery was ${timeStr} late. Consider investigating traffic, loading delays, or route optimization.`
        : `Delivery was ${timeStr} early. Great time management!`,
      severity: timeVariance > 0 ? severity : 'success',
    });
  }

  // Cost variance alerts
  const costVariance = metrics.costVariance.variance;
  const costPercentage = Math.abs(parseFloat(metrics.costVariance.percentage));
  
  if (Math.abs(costVariance) >= 100 || costPercentage >= 10) {
    let severity = 'medium';
    if (costPercentage >= 25) severity = 'high';
    
    alerts.push({
      type: 'cost',
      title: costVariance > 0 ? 'Cost Overrun' : 'Cost Savings',
      message: costVariance > 0
        ? `Cost exceeded estimate by $${costVariance.toLocaleString()} (${metrics.costVariance.percentage}%). Review pricing accuracy and additional charges.`
        : `Saved $${Math.abs(costVariance).toLocaleString()} (${Math.abs(parseFloat(metrics.costVariance.percentage))}%) from estimate. Excellent cost management!`,
      severity: costVariance > 0 ? severity : 'success',
    });
  }

  // Overall performance alert
  const hasSignificantVariances = alerts.some(alert => alert.severity === 'high');
  const hasOnlyPositiveVariances = alerts.length > 0 && alerts.every(alert => alert.severity === 'success');

  if (alerts.length === 0) {
    alerts.push({
      type: 'overall',
      title: 'Perfect Execution',
      message: 'All metrics met expectations. Excellent planning and execution!',
      severity: 'success',
    });
  } else if (hasOnlyPositiveVariances) {
    alerts.push({
      type: 'overall',
      title: 'Outstanding Performance',
      message: 'All variances were positive improvements. Exceptional delivery management!',
      severity: 'success',
    });
  } else if (hasSignificantVariances) {
    alerts.push({
      type: 'overall',
      title: 'Review Required',
      message: 'Significant variances detected. Consider reviewing processes and updating future estimates.',
      severity: 'high',
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <AlertCard
            key={`${alert.type}-${index}`}
            {...alert}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};