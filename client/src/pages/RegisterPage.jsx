import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }

        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">✦</div>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Start managing your tasks today</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat password" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : 'Create Account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
