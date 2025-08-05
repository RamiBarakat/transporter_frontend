import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Performance insights and detailed analytics
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Advanced analytics coming soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive performance reports and data visualization will be available here.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;