import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
        setLoading(true);
        try {
            await login(form);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">✦</div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to your TaskFlow account</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : 'Sign In'}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
