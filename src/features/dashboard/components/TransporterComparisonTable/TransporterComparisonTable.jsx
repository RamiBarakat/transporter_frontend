import { motion } from 'framer-motion';
import { Truck, Star, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

const ScoreBadge = ({ score, size = 'sm' }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={clsx(
      'font-medium rounded-full',
      getScoreColor(score),
      sizeClasses[size]
    )}>
      {score?.toFixed(1)}
    </span>
  );
};

const TrendIcon = ({ trend, className }) => {
  if (trend > 0) return <TrendingUp className={clsx('w-4 h-4 text-green-500', className)} />;
  if (trend < 0) return <TrendingDown className={clsx('w-4 h-4 text-red-500', className)} />;
  return null;
};

const TransporterRow = ({ transporter, index }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      {/* Company */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {transporter.company}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {transporter.totalDeliveries} deliveries
            </div>
          </div>
        </div>
      </td>

      {/* AI Score */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <ScoreBadge score={transporter.score} size="md" />
          <TrendIcon trend={transporter.scoreTrend} />
        </div>
      </td>

      {/* On-Time Rate */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {transporter.onTimeRate?.toFixed(1)}%
          </span>
          <TrendIcon trend={transporter.onTimeTrend} />
        </div>
      </td>

      {/* Cost Performance */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={clsx(
            'text-sm font-medium',
            transporter.costVariance < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {transporter.costVariance > 0 ? '+' : ''}{transporter.costVariance?.toFixed(1)}%
          </span>
          <TrendIcon trend={-transporter.costTrend} />
        </div>
      </td>

      {/* Driver Rating */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {transporter.driverRating?.toFixed(1)}
          </span>
        </div>
      </td>

      {/* Quality Score */}
      <td className="px-6 py-4 whitespace-nowrap">
        <ScoreBadge score={transporter.qualityScore} />
      </td>

    </motion.tr>
  );
};

export const TransporterComparisonTable = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const sortedData = data?.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transporter Performance Comparison
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sample Performance analysis and rankings
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Weighted Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                On-Time Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Cost Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Driver Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quality Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.length > 0 ? (
              sortedData.map((transporter, index) => (
                <TransporterRow 
                  key={transporter.id} 
                  transporter={transporter} 
                  index={index} 
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No transporter data available
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};