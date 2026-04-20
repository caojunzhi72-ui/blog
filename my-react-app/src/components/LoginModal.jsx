import { useState } from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      console.log('登录成功', formData);
      // 这里可以添加实际的登录逻辑，比如调用API
      
      // 登录成功后关闭模态框
      onClose();
    } catch (error) {
      setLoginError('登录失败，请检查邮箱和密码');
      console.error('登录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOnBg = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`login-overlay ${isOpen ? 'active' : ''}`} onClick={handleCloseOnBg}>
      <div className="login-modal">
        <div className="login-header">
          <h2 className="login-title">登录</h2>
          <button className="login-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {loginError && (
            <div className="login-error">{loginError}</div>
          )}
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="请输入邮箱地址"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="请输入密码"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>记住我</span>
            </label>
            <a href="#" className="forgot-password">忘记密码？</a>
          </div>
          <button 
            type="submit" 
            className="login-btn" 
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
          <div className="register-link">
            还没有账号？<a href="#">立即注册</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;