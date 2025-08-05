import { motion } from 'framer-motion';
import clsx from 'clsx';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';



export const SeverityIcon = ({ severity }) => {
    const icons = {
      high: AlertCircle,
      medium: Info,
      low: CheckCircle,
    };
    
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
    };
    
    const Icon = icons[severity] || Info;
    return <Icon className={clsx('w-4 h-4', colors[severity])} />;
  };

  
export const InsightCard = ({ insight, index }) => {
    const severityColors = {
      high: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
      medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={clsx(
            'border-l-4 p-4 rounded-r-lg h-full flex flex-col justify-between',
          severityColors[insight.severity] || severityColors.low
        )}
      >
        <div className="flex items-start gap-3">
          <SeverityIcon severity={insight.severity} />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              {insight.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {insight.description}
            </p>
            {insight.recommendation && (
              <div className="text-xs text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-800 rounded p-2 border">
                💡 {insight.recommendation}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={clsx(
            'text-xs px-2 py-1 rounded-full',
            insight.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
            insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          )}>
            {insight.severity.toUpperCase()}
          </span>
          {insight.confidence && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {insight.confidence}% confidence
            </span>
          )}
        </div>
      </motion.div>
    );
  };
  