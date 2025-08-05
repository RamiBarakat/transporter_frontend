import { useRequestDetailPage } from './hooks';
import { RequestDetailPageUI } from './RequestDetailPageUI';

const RequestDetailPage = () => {
  const {
    request,
    isLoading,
    error,
    refetch,
    performanceMetrics,
    deliveryDrivers,
    permissions,
    goBack,
  } = useRequestDetailPage();

  return (
    <RequestDetailPageUI
      request={request}
      isLoading={isLoading}
      error={error}
      performanceMetrics={performanceMetrics}
      deliveryDrivers={deliveryDrivers}
      permissions={permissions}
      onRefresh={refetch}
      goBack={goBack}
    />
  );
};

export default RequestDetailPage;