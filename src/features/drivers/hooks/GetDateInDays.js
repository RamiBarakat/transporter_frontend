export const getDateInDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Unknown period';
  
    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.round((endDate - startDate) / msInDay);
  
    switch (days) {
      case 6:
      case 7:
        return 'Last 7 days';
      case 13:
      case 14:
        return 'Last 14 days';
      case 29:
      case 30:
        return 'Last 30 days';
      default:
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  };
  