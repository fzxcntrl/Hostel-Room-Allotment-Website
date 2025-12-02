import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await register(formData);
    if (!response.success) {
      setError(response.message);
      setSuccess(null);
      return;
    }
    setSuccess('Account created! You can login now.');
    setError(null);
  };

  return (
    <section className="auth">
      <div className="card auth__card">
        <h2>Let us welcome you</h2>
        <p className="muted">Create an account to unlock curated stays and instant booking.</p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="fullName">Full name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form__group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
