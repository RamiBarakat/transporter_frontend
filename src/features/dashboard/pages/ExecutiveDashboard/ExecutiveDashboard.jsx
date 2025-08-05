import { useExecutiveDashboard } from './hooks';
import { ExecutiveDashboardUI } from './ExecutiveDashboardUI';

const ExecutiveDashboard = () => {
  const {
    // Data
    kpiData,
    trendsData,
    aiInsights,
    transporterComparison,
    isLoading,
    error,
    
    // Actions
    refreshData,
    setDateRange,
    dateRange,
  } = useExecutiveDashboard();

  return (
    <ExecutiveDashboardUI
      // Data
      kpiData={kpiData}
      trendsData={trendsData}
      aiInsights={aiInsights}
      transporterComparison={transporterComparison}
      isLoading={isLoading}
      error={error}
      
      // Actions
      onRefresh={refreshData}
      onDateRangeChange={setDateRange}
      dateRange={dateRange}
    />
  );
};

export default ExecutiveDashboard;