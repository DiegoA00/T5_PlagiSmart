export const formatDateTime = (dateTime: string | null | undefined): string => {
  if (!dateTime) return "-";
  
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "-";
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch (error) {
    return "-";
  }
};

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return "-";
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "-";
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "-";
  }
};