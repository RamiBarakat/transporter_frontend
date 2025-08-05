import { useNavigate } from 'react-router-dom';
import { useRequestListPage } from './hooks';
import { RequestListPageUI } from './RequestListPageUI';

const RequestListPage = () => {
  const navigate = useNavigate();
  const {
    requests,
    isLoading,
    error,
    stats,
    filters,
    handleSearch,
    handleRefresh,
    
    // Pagination
    currentPage,
    paginationInfo,
    handlePageChange,
  } = useRequestListPage();

  const handleRequestClick = (request) => {
    navigate(`/requests/${request.id}`);
  };

  return (
    <RequestListPageUI
      requests={requests}
      isLoading={isLoading}
      error={error}
      stats={stats}
      filters={filters}
      onSearch={handleSearch}
      onRefresh={handleRefresh}
      onRequestClick={handleRequestClick}
      
      // Pagination
      currentPage={currentPage}
      paginationInfo={paginationInfo}
      onPageChange={handlePageChange}
    />
  );
};

export default RequestListPage;