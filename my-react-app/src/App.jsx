import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './utils/themeContext.jsx';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import SearchModal from './components/SearchModal';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';

// 懒加载组件
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const ArticleList = lazy(() => import('./components/ArticleList'));
const ArticleForm = lazy(() => import('./components/ArticleForm'));

// 首页组件
function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 导入 API 请求工具
  const { apiRequest } = require('./utils/api');

  // 获取文章数据
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // 模拟 API 请求，实际项目中应使用真实 API 地址
        // const data = await apiRequest('https://api.example.com/articles');
        
        // 模拟 API 响应数据
        const data = [
          {
            id: 1,
            date: '2024-12-15',
            tag: 'React',
            title: '深入理解 React Server Components 的工作原理',
            excerpt: 'React Server Components 是 React 生态中的一项重大革新。本文将从底层原理出发，详细解析 RSC 的工作流程、优势以及在实际项目中的应用场景。',
            readTime: 8,
            views: '1.2k'
          },
          {
            id: 2,
            date: '2024-12-12',
            tag: 'CSS',
            title: '现代 CSS 布局技巧：Grid 与 Flexbox 的最佳实践',
            excerpt: 'Grid 和 Flexbox 是现代 CSS 布局的核心工具。本文通过多个实际案例，展示如何组合使用这两种布局方式，构建响应式且优雅的界面。',
            readTime: 6,
            views: '896'
          },
          {
            id: 3,
            date: '2024-12-08',
            tag: '设计',
            title: '极简主义设计原则：少即是多的视觉表达',
            excerpt: '极简主义不仅仅是一种美学风格，更是一种设计哲学。本文探讨如何在网页设计中运用留白、色彩和排版，创造清晰而有力量感的视觉体验。',
            readTime: 5,
            views: '732'
          },
          {
            id: 4,
            date: '2024-12-03',
            tag: 'TypeScript',
            title: 'TypeScript 高级类型体操：从入门到精通',
            excerpt: '类型系统是 TypeScript 的核心。本文通过一系列由浅入深的示例，帮助你掌握条件类型、模板字面量类型、infer 关键字等高级特性。',
            readTime: 12,
            views: '1.5k'
          }
        ];
        
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 提取所有标签
  const tags = ['全部', ...new Set(articles.map(article => article.tag))];

  // 筛选文章
  const filteredArticles = selectedTag === '全部' 
    ? articles 
    : articles.filter(article => article.tag === selectedTag);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSettingsOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App">
      <Header
        onSearchClick={() => setSearchOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
      />
      
      <main className="page">
        <section className="hero">
          <div className="hero-badge">持续更新中</div>
          <h1>记录思考，<span>分享技术</span></h1>
          <p>一个专注于前端开发、设计思维与技术分享的极简博客。用清晰的文字，记录成长的每一步。</p>
        </section>

        <section className="article-section">
          <div className="section-header">
            <h2 className="section-title">最新文章</h2>
            <a href="#" className="section-more">
              查看全部
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* 标签筛选 */}
          <div className="tag-filter">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 <a href="#">MyBlog</a> · 使用 ❤️ 与 ☕ 构建 · 保留所有权利</p>
      </footer>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

// 管理后台仪表盘
function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">仪表盘</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-blue-600">5</div>
          <div className="text-gray-600 mt-2">总文章数</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-green-600">3</div>
          <div className="text-gray-600 mt-2">已发布</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-yellow-600">2</div>
          <div className="text-gray-600 mt-2">草稿</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">加载中...</div>}>
          <Routes>
            {/* 前台路由 */}
            <Route path="/" element={<HomePage />} />
            
            {/* 管理后台路由 */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/articles" element={<AdminLayout><ArticleList /></AdminLayout>} />
            <Route path="/admin/articles/create" element={<AdminLayout><ArticleForm /></AdminLayout>} />
            <Route path="/admin/articles/edit/:id" element={<AdminLayout><ArticleForm /></AdminLayout>} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;