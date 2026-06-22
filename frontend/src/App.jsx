import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  LogOut,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Loader2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/auth';

function App() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null); // holds logged in user details { name, email }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    // keep email, reset password and name for convenience
    setFormData((prev) => ({ ...prev, name: '', password: '' }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseText = await response.text();

      if (response.ok) {
        setSuccess('Registration successful! Please log in below.');
        // Switch to login tab and retain the email
        setActiveTab('login');
        setFormData({ name: '', email: formData.email, password: '' });
      } else {
        // This will display "User already exist" or other errors returned from backend
        setError(responseText || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseText = await response.text();

      if (response.ok) {
        // Backend returns "Login successful for user: <name>"
        const prefix = "Login successful for user: ";
        let userName = 'User';
        if (responseText.startsWith(prefix)) {
          userName = responseText.substring(prefix.length);
        }

        setUser({ name: userName, email: formData.email });
        setSuccess('Login successful!');
        setFormData({ name: '', email: '', password: '' });
      } else {
        // This will display "user not found , Please register" or invalid credentials
        setError(responseText || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSuccess('');
    setError('');
  };

  // Welcome Screen / Dashboard
  if (user) {
    return (
      <div className="container welcome-card">
        <div className="avatar-wrapper">
          <ShieldCheck className="avatar-icon" />
        </div>
        <h1 className="welcome-title">Welcome back, {user.name}!</h1>
        <p className="welcome-subtitle">You have successfully authenticated into your secure portal.</p>

        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value" style={{ color: 'var(--success)' }}>Active Session</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Database Connection</span>
            <span className="detail-value" style={{ color: 'var(--success)' }}>Connected</span>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    );
  }

  // Registration & Login Forms
  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Sign In
        </button>
        <button
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => handleTabChange('register')}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Mail className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <UserIcon className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Mail className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
