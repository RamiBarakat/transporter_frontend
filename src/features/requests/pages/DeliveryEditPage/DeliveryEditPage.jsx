import { useDeliveryEditPage } from './hooks';
import { DeliveryEditPageUI } from './DeliveryEditPageUI';

const DeliveryEditPage = () => {
  const {
    // Data
    request,
    isLoading,
    error,
    existingDelivery,
    existingDrivers,
    
    // Form
    register,
    handleSubmit,
    errors,
    watch,
    
    // State
    isSubmitting,
    canSubmit,
    
    // Actions
    handleDriversUpdate,
    calculateVariancePreview,
    goBack,
  } = useDeliveryEditPage();

  return (
    <DeliveryEditPageUI
      request={request}
      isLoading={isLoading}
      error={error}
      existingDelivery={existingDelivery}
      existingDrivers={existingDrivers}
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

export default DeliveryEditPage;