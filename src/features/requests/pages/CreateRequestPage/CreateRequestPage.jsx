import { useCreateRequestPage } from './hooks';
import { CreateRequestPageUI } from './CreateRequestPageUI';

const CreateRequestPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    isValid,
    isSubmitting,
    estimatedDistance,
    isCalculatingDistance,
    isEditMode,
    isLoadingRequest,
    goBack,
  } = useCreateRequestPage();

  if (isEditMode && isLoadingRequest) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <CreateRequestPageUI
      register={register}
      handleSubmit={handleSubmit}
      watch={watch}
      errors={errors}
      isValid={isValid}
      isSubmitting={isSubmitting}
      estimatedDistance={estimatedDistance}
      isCalculatingDistance={isCalculatingDistance}
      isEditMode={isEditMode}
      goBack={goBack}
    />
  );
};

export default CreateRequestPage;