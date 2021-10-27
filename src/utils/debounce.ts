const debounce = (handler: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) return;
    const later = () => {
      timeout = null;
      handler(...args);
    };
    timeout = setTimeout(later, wait);
  };
};

export default debounce;
