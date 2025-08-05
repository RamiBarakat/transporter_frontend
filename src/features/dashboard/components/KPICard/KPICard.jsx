import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { getPerformanceColor, getColorClasses, TrendIcon } from './KPIMisc';
import { getDateInDays } from '@/features/drivers/hooks';

export const KPICard = ({ data, isLoading, index = 0, dateRange }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  const performanceColor = getPerformanceColor(data.value);
  const colors = getColorClasses(performanceColor);
  const IconComponent = data.icon || AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        'rounded-lg border p-6 transition-all hover:shadow-lg',
        colors.bg,
        colors.border
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', colors.bg)}>
          <IconComponent className={clsx('w-5 h-5', colors.icon)} />
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={data.trend} className={colors.trend} />
          <span className={clsx('text-sm font-medium', colors.trend)}>
            {data.trend > 0 && '+'}
            {data.trend?.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className={clsx('text-3xl font-bold', colors.text)}>
          {data.formattedValue || `${data.value?.toFixed(1)}${data.unit || '%'}`}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {data.title}
        </h3>
      </div>

      {/* Period Comparison */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {data.comparison && (
          <span>
          {data.comparison.change > 0 ? '+' : ''}
          {data.comparison.change?.toFixed(1)}
          {data.comparison.unit || '%'} in {getDateInDays(dateRange?.startDate, dateRange?.endDate)}
          </span>
        )}
      </div>

      {/* AI Insight */}
      {data.aiInsight && (
        <div className={clsx('p-3 rounded-lg border', colors.bg, colors.border)}>
          <p className={clsx('text-sm', colors.text)}>
            💡 {data.aiInsight}
          </p>
        </div>
      )}
    </motion.div>
  );
};