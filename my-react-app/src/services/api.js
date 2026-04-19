// API服务文件

const API_BASE_URL = 'http://localhost:3000/api';

// 通用请求函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 获取认证token
const getToken = () => localStorage.getItem('token');

// 带认证的请求函数
async function authenticatedRequest(endpoint, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('未登录，请先登录');
  }
  
  return request(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// 文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;
    return request(endpoint);
  },

  // 获取文章详情
  getArticle: async (id) => {
    return request(`/articles/${id}`);
  },

  // 创建文章
  createArticle: async (data) => {
    return authenticatedRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新文章
  updateArticle: async (id, data) => {
    return authenticatedRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除文章
  deleteArticle: async (id) => {
    return authenticatedRequest(`/articles/${id}`, {
      method: 'DELETE',
    });
  },

  // 发布文章
  publishArticle: async (id) => {
    return authenticatedRequest(`/articles/${id}/publish`, {
      method: 'PUT',
    });
  },

  // 下架文章
  unpublishArticle: async (id) => {
    return authenticatedRequest(`/articles/${id}/unpublish`, {
      method: 'PUT',
    });
  },
};

// 认证相关API
export const authApi = {
  // 登录
  login: async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  // 注册
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
  },

  // 检查登录状态
  checkAuth: () => {
    return !!getToken();
  },
};

// 分类相关API
export const categoryApi = {
  // 获取分类列表
  getCategories: async () => {
    return request('/categories');
  },
};

// 搜索相关API
export const searchApi = {
  // 搜索内容
  search: async (query, type = 'all') => {
    const queryString = new URLSearchParams({ q: query, type }).toString();
    return request(`/search?${queryString}`);
  },
};

export default {
  articleApi,
  authApi,
  categoryApi,
  searchApi,
};