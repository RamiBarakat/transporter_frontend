import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/common';

// Lazy loaded pages
const ExecutiveDashboard = lazy(() => import('@/features/dashboard/pages/ExecutiveDashboard'));
const RequestListPage = lazy(() => import('@/features/requests/pages/RequestListPage'));
const CreateRequestPage = lazy(() => import('@/features/requests/pages/CreateRequestPage'));
const RequestDetailPage = lazy(() => import('@/features/requests/pages/RequestDetailPage'));
const DeliveryLoggingPage = lazy(() => import('@/features/requests/pages/DeliveryLoggingPage'));
const DeliveryEditPage = lazy(() => import('@/features/requests/pages/DeliveryEditPage'));
const DeliveryListPage = lazy(() => import('@/features/deliveries/pages/DeliveryListPage'));
const DriverListPage = lazy(() => import('@/features/drivers/pages/DriverListPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));

// Wrapper component for lazy loaded pages
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <ExecutiveDashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <ExecutiveDashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'requests',
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <RequestListPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'create',
            element: (
              <LazyWrapper>
                <CreateRequestPage />
              </LazyWrapper>
            ),
          },
          {
            path: ':id',
            element: (
              <LazyWrapper>
                <RequestDetailPage />
              </LazyWrapper>
            ),
          },
          {
            path: ':id/delivery',
            element: (
              <LazyWrapper>
                <DeliveryLoggingPage />
              </LazyWrapper>
            ),
          },
          {
            path: ':id/delivery/edit',
            element: (
              <LazyWrapper>
                <DeliveryEditPage />
              </LazyWrapper>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <LazyWrapper>
                <CreateRequestPage />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: 'deliveries',
        element: (
          <LazyWrapper>
            <DeliveryListPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'drivers',
        element: (
          <LazyWrapper>
            <DriverListPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'analytics',
        element: (
          <LazyWrapper>
            <AnalyticsPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <a 
            href="/" 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);