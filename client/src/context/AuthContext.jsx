import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (credentials) => {
        const { data } = await loginUser(credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! 👋`);
        return data;
    }, []);

    const register = useCallback(async (credentials) => {
        const { data } = await registerUser(credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
