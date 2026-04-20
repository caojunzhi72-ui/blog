import { useState, useEffect, useRef } from 'react';
import { searchApi } from '../services/api';

const SearchModal = ({ isOpen, onClose }) => {
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchApi.search(searchQuery);
      setSearchResults(response.results);
    } catch (err) {
      setError('搜索失败，请稍后重试');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div
      className={`search-overlay ${isOpen ? 'active' : ''}`}
      id="searchOverlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex="-1"
    >
      <div className="search-modal">
        <div className="search-input-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="搜索文章、笔记、标签..."
            id="searchInput"
            ref={searchInputRef}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <kbd style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px' }}>
            ESC
          </kbd>
        </div>
        
        {isLoading ? (
          <div className="search-hints">
            <div className="search-hint-title">搜索中...</div>
          </div>
        ) : error ? (
          <div className="search-hints">
            <div className="search-hint-title" style={{ color: '#ef4444' }}>{error}</div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="search-results">
            <div className="search-hint-title">搜索结果 ({searchResults.length})</div>
            {searchResults.map((result, index) => (
              <div key={index} className="search-result-item">
                <div className="search-result-title">{result.title}</div>
                {result.excerpt && (
                  <div className="search-result-excerpt">{result.excerpt}</div>
                )}
                <div className="search-result-meta">
                  <span>{result.type === 'article' ? '文章' : '文档'}</span>
                  <span>{formatDate(result.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="search-hints">
            <div className="search-hint-title">无搜索结果</div>
            <div className="search-hint-item">
              <span>尝试使用其他关键词</span>
            </div>
          </div>
        ) : (
          <div className="search-hints">
            <div className="search-hint-title">快捷提示</div>
            <div className="search-hint-item">
              <span>按标签搜索</span>
              <kbd>#</kbd>
            </div>
            <div className="search-hint-item">
              <span>按作者搜索</span>
              <kbd>@</kbd>
            </div>
            <div className="search-hint-item">
              <span>关闭</span>
              <kbd>ESC</kbd>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;