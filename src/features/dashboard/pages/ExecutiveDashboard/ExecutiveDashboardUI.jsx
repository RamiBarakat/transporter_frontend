import { motion } from 'framer-motion';
import { BarChart3, RefreshCw } from 'lucide-react';

import { 
  KPICard, 
  TrendsChart, 
  AIInsightsPanel, 
  TransporterComparisonTable,
  DateRangePicker 
} from '../../components';

export const ExecutiveDashboardUI = ({
  // Data
  kpiData,
  trendsData,
  aiInsights,
  transporterComparison,
  isLoading,
  error,
  
  // Actions
  onRefresh,
  onDateRangeChange,
  dateRange,
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
              Failed to Load Dashboard
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error.message || 'An unexpected error occurred while loading the dashboard.'}
            </p>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Executive Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time overview of your transportation operations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={onDateRangeChange}
            />
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(kpiData?.data || kpiData || []).map((kpi, index) => (
            <KPICard
              key={kpi.id}
              data={kpi}
              isLoading={isLoading}
              index={index}
              dateRange={dateRange}
            />
          ))}
        </div>
       
          {/* Trends Chart */}
          <div className="lg:col-span-2">
            <TrendsChart
              data={trendsData?.data || trendsData}
              isLoading={isLoading}
              dateRange={dateRange}
            />
          </div>
          
          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <AIInsightsPanel
              insights={aiInsights?.data || aiInsights}
              isLoading={isLoading}
            />
          </div>


        {/* Transporter Comparison */}
        <div>
          <TransporterComparisonTable
            data={transporterComparison?.data || transporterComparison}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
};