import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';


export const TrendIcon = ({ trend, className }) => {
    if (trend > 0) return <TrendingUp className={clsx('w-4 h-4', className)} />;
    if (trend < 0) return <TrendingDown className={clsx('w-4 h-4', className)} />;
    return <Minus className={clsx('w-4 h-4', className)} />;
  };
  
export const getPerformanceColor = (performance) => {
if (performance >= 90) return 'green';
if (performance >= 70) return 'yellow';
return 'red';
};

export const getColorClasses = (color) => {
const colors = {
    green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: 'text-green-600 dark:text-green-400',
    trend: 'text-green-600 dark:text-green-400',
    },
    yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: 'text-yellow-600 dark:text-yellow-400',
    trend: 'text-yellow-600 dark:text-yellow-400',
    },
    red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'text-red-600 dark:text-red-400',
    },
};
return colors[color] || colors.green;
};
