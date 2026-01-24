import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../animations/PageWrapper';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await login(formData);
    if (!response.success) {
      setError(response.message);
      return;
    }
    navigate('/book');
  };

  return (
    <PageWrapper>
      <section className="auth">
        <div className="card auth__card">
          <h2>Welcome back</h2>
          <p className="muted">Log in to manage your bookings and personalize your stay.</p>
          {error && <p className="error">{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form__group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Signing you in...' : 'Login'}
            </button>
          </form>
          <p className="muted">
            New to HostelBloom? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Login;
