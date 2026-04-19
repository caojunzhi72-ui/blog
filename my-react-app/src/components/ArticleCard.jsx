const ArticleCard = ({ article }) => {
  const { date, tag, title, excerpt, readTime, views } = article;

  // 格式化日期为月份和日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  const { month, day } = formatDate(date);

  // 生成响应式图片URL，实际项目中应使用真实图片
  const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(title + ' 技术文章封面')}&image_size=square`;
  const smallImageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(title + ' 技术文章封面')}&image_size=portrait_4_3`;

  return (
    <div className="article-card">
      <div className="article-date">
        <div className="month">{month}</div>
        <div className="day">{day}</div>
      </div>
      <div className="article-content">
        <div className="article-image">
          <picture>
            <source media="(max-width: 640px)" srcSet={smallImageUrl} />
            <img 
              src={imageUrl} 
              alt={title} 
              loading="lazy" 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          </picture>
        </div>
        <span className="article-tag">{tag}</span>
        <div className="article-title">{title}</div>
        <div className="article-excerpt">{excerpt}</div>
        <div className="article-meta">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} 分钟阅读
          </span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {views}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;