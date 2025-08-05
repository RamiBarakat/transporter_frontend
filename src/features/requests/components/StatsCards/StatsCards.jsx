import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, TrendingUp, XCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, change, index }) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
    success: 'text-success-600 bg-success-50 dark:bg-success-900/20',
    warning: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20',
    danger: 'text-danger-600 bg-danger-50 dark:bg-danger-900/20',
    gray: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Requests',
      value: stats.total,
      icon: Package,
      color: 'primary',

    },
    {
      title: 'Planned',
      value: stats.planned,
      icon: Clock,
      color: 'warning',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'success',
    },

  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <StatCard key={card.title} {...card} index={index} />
      ))}
    </div>
  );
};