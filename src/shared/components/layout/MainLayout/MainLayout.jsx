import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { useUIStore } from '@/app/store';

export const MainLayout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900"
        >
          <div className="max-w-7xl mx-auto p-6 h-full">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};