import { useRequest, useDeliveryForEdit } from '../../api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const useRequestDetailPage = () => {
  const { id } = useParams();
  const { data: request, isLoading, error, refetch } = useRequest(id);
  const { data: deliveryData } = useDeliveryForEdit(request?.status === 'completed' ? id : null);
  const navigate = useNavigate();

  const deliveryDrivers = deliveryData?.data?.drivers || [];

  const performanceMetrics = request?.delivery ? {
    truckVariance: {
      planned: request.truckCount,
      actual: request.delivery.actualTruckCount,
      variance: request.delivery.actualTruckCount - request.truckCount,
      percentage: ((request.delivery.actualTruckCount - request.truckCount) / request.truckCount * 100).toFixed(1)
    },
    timeVariance: {
      planned: new Date(request.pickUpDateTime || request.pickupDate),
      actual: new Date(request.delivery.actualPickupDateTime),
      variance: Math.round((new Date(request.delivery.actualPickupDateTime) - new Date(request.pickUpDateTime || request.pickupDate)) / (1000 * 60)), // minutes
    },
    costVariance: {
      estimated: request.estimatedCost,
      actual: request.delivery.invoiceAmount,
      variance: request.delivery.invoiceAmount - request.estimatedCost,
      percentage: ((request.delivery.invoiceAmount - request.estimatedCost) / request.estimatedCost * 100).toFixed(1)
    }
  } : null;

  const canEditRequest = request?.status === 'planned' || request?.status === 'approved';
  const canEditDelivery = request?.status === 'completed';
  const canLogDelivery = request?.status === 'planned' || request?.status === 'approved' || request?.status === 'in-progress';

  const goBack = () => {
    navigate('/requests');
  };

  return {
    request,
    isLoading,
    error,
    refetch,
    performanceMetrics,
    deliveryDrivers,
    permissions: {
      canEditRequest,
      canEditDelivery,
      canLogDelivery,
    },
    goBack,
  };
};