// API 请求工具函数，包含缓存和防抖功能

// 缓存对象
const cache = new Map();

// 防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// API 请求函数
const apiRequest = async (url, options = {}) => {
  // 生成缓存键
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  // 检查缓存
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // 存入缓存
    cache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 带防抖的 API 请求函数
const debouncedApiRequest = debounce(apiRequest, 300);

export { apiRequest, debouncedApiRequest };