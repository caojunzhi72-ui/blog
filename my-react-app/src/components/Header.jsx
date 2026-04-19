import { useState } from 'react';


const Header = ({ onSearchClick, onSettingsClick, onLoginClick }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('首页');


  const navLinks = ['首页', '文章', '笔记', '归档', '留言板', '关于'];

  const handleNavClick = (link) => {
    setActiveNav(link);
    setMobileNavOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="logo">
          <div className="logo-icon">M</div>
          <span>MyBlog</span>
        </a>

        <nav className={`nav ${mobileNavOpen ? 'open' : ''}`} id="mainNav">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`nav-link ${activeNav === link ? 'active' : ''}`}
              onClick={() => handleNavClick(link)}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="actions">
          <button className="btn-login" onClick={onLoginClick}>
            登录
          </button>
          <button className="btn-register" onClick={() => alert('注册功能')}>
            注册
          </button>
          <div className="divider"></div>
          <button
            className="icon-btn"
            onClick={onSearchClick}
            aria-label="搜索"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={onSettingsClick}
            aria-label="设置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.07-.549.443-1.03.96-1.237a10.385 10.385 0 013.892 0c.517.207.89.688.96 1.237l.09.733c.085.684.62 1.216 1.284 1.358a8.93 8.93 0 001.558.643l.69-.276c.515-.206 1.106-.077 1.49.312a9.276 9.276 0 011.436 1.992c.39.384.518.975.312 1.49l-.276.69c.142.664.674 1.2 1.358 1.284l.733.09c.549.07 1.03.443 1.237.96a10.385 10.385 0 010 3.892c-.207.517-.688.89-1.237.96l-.733.09a1.73 1.73 0 00-1.358 1.284l.276.69c.206.515.077 1.106-.312 1.49a9.276 9.276 0 01-1.992 1.436c-.384.39-.975.518-1.49.312l-.69-.276a1.73 1.73 0 00-1.284 1.358l-.09.733c-.07.549-.443 1.03-.96 1.237a10.385 10.385 0 01-3.892 0c-.517-.207-.89-.688-.96-1.237l-.09-.733a1.73 1.73 0 00-1.284-1.358l-.69.276c-.515.206-1.106.077-1.49-.312a9.276 9.276 0 01-1.436-1.992c-.39-.384-.518-.975-.312-1.49l.276-.69a1.73 1.73 0 00-1.358-1.284l-.733-.09c-.549-.07-1.03-.443-1.237-.96a10.385 10.385 0 010-3.892c.207-.517.688-.89 1.237-.96l.733-.09c.684-.085 1.216-.62 1.358-1.284l-.276-.69z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;