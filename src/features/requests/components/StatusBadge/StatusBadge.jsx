import clsx from 'clsx';

export const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      className: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800' 
    },
    approved: { 
      label: 'Approved', 
      className: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800' 
    },
    'in-progress': { 
      label: 'In Progress', 
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
    },
    completed: { 
      label: 'Completed', 
      className: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800' 
    },
    cancelled: { 
      label: 'Cancelled', 
      className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800' 
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};