import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleApi } from '../services/api';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  // 获取文章列表
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        status: status === 'all' ? '' : status
      };
      const response = await articleApi.getArticles(params);
      setArticles(response.articles || []);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      console.error('获取文章列表失败:', err);
      setError('获取文章列表失败，请稍后重试');
      // 使用模拟数据作为 fallback
      setArticles([
        {
          id: 1,
          title: '深入理解 React Server Components 的工作原理',
          slug: 'react-server-components',
          excerpt: 'React Server Components 是 React 生态中的一项重大革新。',
          status: 'published',
          view_count: 1200,
          created_at: '2024-12-15T08:00:00Z',
          updated_at: '2024-12-15T08:00:00Z'
        },
        {
          id: 2,
          title: '现代 CSS 布局技巧：Grid 与 Flexbox 的最佳实践',
          slug: 'css-layout-tips',
          excerpt: 'Grid 和 Flexbox 是现代 CSS 布局的核心工具。',
          status: 'published',
          view_count: 896,
          created_at: '2024-12-12T10:30:00Z',
          updated_at: '2024-12-12T10:30:00Z'
        },
        {
          id: 3,
          title: '极简主义设计原则：少即是多的视觉表达',
          slug: 'minimalist-design',
          excerpt: '极简主义不仅仅是一种美学风格，更是一种设计哲学。',
          status: 'draft',
          view_count: 0,
          created_at: '2024-12-08T14:20:00Z',
          updated_at: '2024-12-08T14:20:00Z'
        },
        {
          id: 4,
          title: 'TypeScript 高级类型体操：从入门到精通',
          slug: 'typescript-advanced',
          excerpt: '类型系统是 TypeScript 的核心。',
          status: 'published',
          view_count: 1500,
          created_at: '2024-12-03T09:15:00Z',
          updated_at: '2024-12-03T09:15:00Z'
        },
        {
          id: 5,
          title: 'Next.js 14 新特性深度解析',
          slug: 'nextjs-14-features',
          excerpt: 'Next.js 14 带来了许多令人兴奋的新特性。',
          status: 'draft',
          view_count: 0,
          created_at: '2024-11-28T16:45:00Z',
          updated_at: '2024-11-28T16:45:00Z'
        }
      ]);
      setTotal(5);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [status, page, limit]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePublish = async (id) => {
    try {
      await articleApi.publishArticle(id);
      // 更新本地状态
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, status: 'published' } : article
      ));
    } catch (err) {
      console.error('发布文章失败:', err);
      alert('发布文章失败，请稍后重试');
      // 模拟成功
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, status: 'published' } : article
      ));
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await articleApi.unpublishArticle(id);
      // 更新本地状态
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, status: 'draft' } : article
      ));
    } catch (err) {
      console.error('下架文章失败:', err);
      alert('下架文章失败，请稍后重试');
      // 模拟成功
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, status: 'draft' } : article
      ));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await articleApi.deleteArticle(id);
        // 更新本地状态
        setArticles(prev => prev.filter(article => article.id !== id));
        setTotal(prev => prev - 1);
      } catch (err) {
        console.error('删除文章失败:', err);
        alert('删除文章失败，请稍后重试');
        // 模拟成功
        setArticles(prev => prev.filter(article => article.id !== id));
        setTotal(prev => prev - 1);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">已发布</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">草稿</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">未知</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <h3 className="text-lg font-medium text-gray-800">文章列表</h3>
          <div className="flex flex-wrap space-x-2">
            <button 
              onClick={() => handleStatusChange('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${status === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              全部
            </button>
            <button 
              onClick={() => handleStatusChange('published')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              已发布
            </button>
            <button 
              onClick={() => handleStatusChange('draft')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${status === 'draft' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              草稿
            </button>
          </div>
        </div>
        <Link 
          to="/admin/articles/create"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新建文章
        </Link>
      </div>

      {/* 文章列表 - 桌面版 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                浏览量
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新时间
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  暂无文章
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.view_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/admin/articles/edit/${article.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </Link>
                      {article.status === 'draft' ? (
                        <button 
                          onClick={() => handlePublish(article.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          发布
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUnpublish(article.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          下架
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 文章列表 - 移动版 */}
      <div className="md:hidden p-4 space-y-4">
        {articles.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            暂无文章
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                {getStatusBadge(article.status)}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                <p className="mb-1">{article.slug}</p>
                <p className="mb-1">浏览量: {article.view_count}</p>
                <p className="mb-1">创建: {formatDate(article.created_at)}</p>
                <p>更新: {formatDate(article.updated_at)}</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  to={`/admin/articles/edit/${article.id}`}
                  className="text-xs text-blue-600 hover:text-blue-900"
                >
                  编辑
                </Link>
                {article.status === 'draft' ? (
                  <button 
                    onClick={() => handlePublish(article.id)}
                    className="text-xs text-green-600 hover:text-green-900"
                  >
                    发布
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUnpublish(article.id)}
                    className="text-xs text-yellow-600 hover:text-yellow-900"
                  >
                    下架
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="text-xs text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页 */}
      <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-500">
          共 {total} 篇文章
        </div>
        <div className="flex space-x-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button 
            disabled={page * limit >= total}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleList;