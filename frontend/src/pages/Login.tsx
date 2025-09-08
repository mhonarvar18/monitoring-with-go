import React, { useState } from 'react';
import '../LoginPage.css'; // Import the custom CSS for the page style

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logged in with:', username, password);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src="your-image-url" alt="background" className="login-background" />
        <div className="login-form-container">
          <div className="logo">
            <img src="your-logo-url" alt="Logo" />
          </div>
          <h1>سامانه هوشمند پازونیک</h1>
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <label htmlFor="username">نام کاربری</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">رمز عبور</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد نمایید"
              />
            </div>
            <div className="login-buttons">
              <button type="submit" className="login-button">
                ورود
              </button>
              <button type="button" className="register-button">
                ثبت نام
              </button>
            </div>
          </form>
          <div className="instructions">
            <p>قوانل زمانی کوتاه تغییر دهید.</p>
            <p>پس از انجام و پایان کار، حتما از سیستم خارج شوید.</p>
            <p>هنگام ورود، نام کاربری و کلمه عبور خود را در انتخاب دیگران قرار ندهید.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
