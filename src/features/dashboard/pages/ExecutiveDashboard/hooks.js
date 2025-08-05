import { useState, useEffect } from 'react';
import { useKPIData, useTrendsData, useAIInsights, useTransporterComparison } from '../../api/queries';

const useExecutiveDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const { data: kpiData, isLoading: isLoadingKPI, error: kpiError, refetch: refetchKPI } = useKPIData(dateRange);
  const { data: trendsData, isLoading: isLoadingTrends, error: trendsError, refetch: refetchTrends } = useTrendsData(dateRange);
  const { data: aiInsights, isLoading: isLoadingInsights, error: insightsError, refetch: refetchInsights } = useAIInsights(dateRange);
  const { data: transporterComparison, isLoading: isLoadingComparison, error: comparisonError, refetch: refetchComparison } = useTransporterComparison(dateRange);


  const isLoading = isLoadingKPI || isLoadingTrends || isLoadingInsights || isLoadingComparison;

  const refreshData = async () => {
    try {
      await Promise.all([
        refetchKPI(),
        refetchTrends(),
        refetchInsights(),
        refetchComparison()
      ]);
      
    } catch (error) {
    }
  };

  const error = kpiError || trendsError || insightsError || comparisonError;

  return {
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
  };
};

export { useExecutiveDashboard };