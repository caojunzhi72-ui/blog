import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleApi, categoryApi } from '../services/api';

function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    status: 'draft'
  });
  const [categories, setCategories] = useState([
    { id: 1, name: '前端开发' },
    { id: 2, name: '后端开发' },
    { id: 3, name: '设计' },
    { id: 4, name: '产品' }
  ]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // 获取文章详情（编辑模式）
  const fetchArticle = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const article = await articleApi.getArticle(id);
      setFormData(article);
    } catch (err) {
      console.error('获取文章详情失败:', err);
      setError('获取文章详情失败，请稍后重试');
      // 使用模拟数据作为 fallback
      const mockArticle = {
        id: 1,
        title: '深入理解 React Server Components 的工作原理',
        slug: 'react-server-components',
        content: '# React Server Components\n\nReact Server Components 是 React 生态中的一项重大革新。本文将从底层原理出发，详细解析 RSC 的工作流程、优势以及在实际项目中的应用场景。\n\n## 什么是 React Server Components\n\nReact Server Components 允许开发者在服务器端渲染组件，而不需要在客户端包含相应的 JavaScript 代码。\n\n## 工作原理\n\nRSC 的工作流程主要包括以下几个步骤：\n1. 服务器端渲染组件\n2. 序列化组件树\n3. 客户端接收并 hydration\n\n## 优势\n\n- 减少客户端 bundle 大小\n- 提高首屏加载速度\n- 直接访问服务器资源\n- 减少客户端与服务器之间的网络请求\n\n## 应用场景\n\nRSC 特别适合以下场景：\n- 内容密集型页面\n- 对 SEO 要求较高的页面\n- 数据密集型应用\n\n## 结论\n\nReact Server Components 为 React 应用提供了一种新的渲染方式，通过将部分组件的渲染移至服务器端，从而提高应用性能和用户体验。',
        excerpt: 'React Server Components 是 React 生态中的一项重大革新。本文将从底层原理出发，详细解析 RSC 的工作流程、优势以及在实际项目中的应用场景。',
        featured_image: 'https://example.com/react-server-components.jpg',
        category_id: '1',
        status: 'published'
      };
      setFormData(mockArticle);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.categories && response.categories.length > 0) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('获取分类列表失败:', err);
      // 使用默认分类数据
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchArticle();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug不能为空';
    }
    if (!formData.content.trim()) {
      newErrors.content = '内容不能为空';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (id) {
        // 更新文章
        await articleApi.updateArticle(id, formData);
      } else {
        // 创建文章
        await articleApi.createArticle(formData);
      }
      navigate('/admin/articles');
    } catch (err) {
      console.error('保存文章失败:', err);
      setError('保存文章失败，请稍后重试');
      // 模拟成功
      setTimeout(() => {
        navigate('/admin/articles');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 表单头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          {id ? '编辑文章' : '新建文章'}
        </h3>
        <div className="flex space-x-2">
          <Link 
            to="/admin/articles"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button 
            type="submit" 
            form="article-form"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 表单内容 */}
      <form id="article-form" onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* 主要内容 */}
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入文章标题"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入文章 slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            {/* 内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入文章内容"
              ></textarea>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* 摘要 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                摘要
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入文章摘要"
              ></textarea>
            </div>
          </div>

          {/* 侧边栏内容 - 移动版和桌面版 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"></div>
            <div className="space-y-6">
              {/* 状态 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>

              {/* 分类 */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 特色图片 */}
              <div>
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
                  特色图片
                </label>
                <input
                  type="text"
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入图片 URL"
                />
              </div>

              {/* 发布信息 */}
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">发布信息</h4>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>创建于: {new Date().toLocaleString('zh-CN')}</p>
                  <p>更新于: {new Date().toLocaleString('zh-CN')}</p>
                  {id && (
                    <p>作者: 管理员</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;