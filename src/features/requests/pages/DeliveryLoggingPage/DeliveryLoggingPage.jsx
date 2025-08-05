    import { useDeliveryLoggingPage } from './hooks';
import { DeliveryLoggingPageUI } from './DeliveryLoggingPageUI';

const DeliveryLoggingPage = () => {
  const {
    request,
    isLoading,
    error,
    selectedDrivers,
    register,
    handleSubmit,
    errors,
    watch,
    isSubmitting,
    canSubmit,
    handleDriversUpdate,
    calculateVariancePreview,
    goBack,
  } = useDeliveryLoggingPage();

  return (
    <DeliveryLoggingPageUI
      request={request}
      isLoading={isLoading}
      error={error}
      selectedDrivers={selectedDrivers}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      watch={watch}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
      handleDriversUpdate={handleDriversUpdate}
      calculateVariancePreview={calculateVariancePreview}
      goBack={goBack}
    />
  );
};

export default DeliveryLoggingPage;