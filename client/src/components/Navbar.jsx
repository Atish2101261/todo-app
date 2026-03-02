import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">✦</span>
                <Link to="/dashboard" className="navbar-title">TaskFlow</Link>
            </div>
            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                    <span className="user-name">{user?.name}</span>
                </div>
                <button className="btn btn-ghost" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
