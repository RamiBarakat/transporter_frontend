import { useState, useEffect } from 'react';
import { Plus, X, Star, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDriverSearch } from '../../../drivers/api';

const StarRating = ({ value = 0, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                isActive
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {value > 0 ? `${value}/5` : 'Not rated'}
      </span>
    </div>
  );
};

const DriverCard = ({ driver, onRemove, onUpdate, index }) => {
  const handleRatingChange = (rating) => {
    onUpdate(driver.id, { ...driver, rating });
  };

  const handleCommentsChange = (e) => {
    onUpdate(driver.id, { ...driver, comments: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{driver.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {driver.isNew ? 'New Driver' : 'Existing Driver'}
          </p>
        </div>
        <button
          onClick={() => onRemove(driver.id)}
          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance Rating
          </label>
          <StarRating value={driver.rating || 0} onChange={handleRatingChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comments (optional)
          </label>
          <textarea
            value={driver.comments || ''}
            onChange={handleCommentsChange}
            placeholder="Add any comments about this driver's performance..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};

export const SimpleDriverForm = ({ drivers = [], onUpdateDrivers }) => {
  const [newDriverName, setNewDriverName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Search existing drivers when typing
  const { data: searchResults } = useDriverSearch(
    newDriverName, 
    { type: 'transporter' }, // Only search 3rd party drivers
    { enabled: newDriverName.length >= 2 }
  );

  useEffect(() => {
    setShowSuggestions(newDriverName.length >= 2 && searchResults?.data?.length > 0);
  }, [newDriverName, searchResults]);

  const addNewDriver = () => {
    if (!newDriverName.trim()) return;

    // Check for duplicates by name
    const driverName = newDriverName.trim().toLowerCase();
    const isDuplicate = drivers.some(d => d.name.toLowerCase() === driverName);
    
    if (isDuplicate) {
      alert('This driver is already added!');
      return;
    }

    const newDriver = {
      id: Date.now(),
      name: newDriverName.trim(),
      rating: 0,
      comments: '',
      isNew: true, // Mark as new driver
    };

    onUpdateDrivers([...drivers, newDriver]);
    setNewDriverName('');
    setShowSuggestions(false);
  };

  const addExistingDriver = (existingDriver) => {
    // Check for duplicates by ID or name
    const isDuplicateById = drivers.some(d => d.id === existingDriver.id);
    const isDuplicateByName = drivers.some(d => d.name.toLowerCase() === existingDriver.name.toLowerCase());
    
    if (isDuplicateById || isDuplicateByName) {
      alert('This driver is already added!');
      setNewDriverName('');
      setShowSuggestions(false);
      return;
    }

    const driver = {
      id: existingDriver.id,
      name: existingDriver.name,
      rating: 0,
      comments: '',
      isNew: false, // Mark as existing driver
    };

    onUpdateDrivers([...drivers, driver]);
    setNewDriverName('');
    setShowSuggestions(false);
  };

  const removeDriver = (driverId) => {
    onUpdateDrivers(drivers.filter(d => d.id !== driverId));
  };

  const updateDriver = (driverId, updatedDriver) => {
    onUpdateDrivers(drivers.map(d => d.id === driverId ? updatedDriver : d));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewDriver();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Drivers
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add drivers and rate their performance for this delivery
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          💡 Type to search existing 3rd party drivers, or add new ones. In-house drivers are managed separately.
        </p>
      </div>

      {/* Add Driver */}
      <div className="relative">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search existing driver or add new one..."
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => newDriverName.length >= 2 && setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={addNewDriver}
            disabled={!newDriverName.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Add as new driver"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking
          >
            <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Found {searchResults?.data?.length || 0} existing driver(s):
            </div>
            {searchResults?.data?.map((driver) => {
              // Check if already added
              const isAlreadyAdded = drivers.some(d => 
                d.id === driver.id || d.name.toLowerCase() === driver.name.toLowerCase()
              );
              
              return (
                <button
                  key={driver.id}
                  onClick={() => addExistingDriver(driver)}
                  disabled={isAlreadyAdded}
                  className={`w-full text-left px-3 py-2 transition-colors ${
                    isAlreadyAdded 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {driver.name} {isAlreadyAdded && '(Already added)'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {driver.transportCompany} • {driver.totalDeliveries} deliveries
                  </div>
                </button>
              );
            })}
            <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              Click + to add "{newDriverName}" as new driver
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="w-full p-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-200 dark:border-gray-700"
            >
              Close suggestions
            </button>
          </div>
        )}
      </div>

      {/* Driver List */}
      {drivers.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {drivers.map((driver, index) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onRemove={removeDriver}
                onUpdate={updateDriver}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {drivers.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No drivers added yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Add at least one driver to continue</p>
        </div>
      )}
    </div>
  );
};