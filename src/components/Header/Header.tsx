import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Header.css";

interface HeaderProps {
    title: string;
}

function Header({ title }: HeaderProps) {
    const navigate = useNavigate();
    const { logout, user, refreshAccessToken, isLoading } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.body.dataset.theme = isDarkMode ? "dark" : "light";
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleRefreshSession = async () => {
        try {
            await refreshAccessToken();
        } catch {
            navigate("/login");
        }
    };

    return (
        <header className="header">
            <div className="header-brand">
                <div className="brand-mark">A</div>
                <h1>{title}</h1>
            </div>

            <nav className="header-nav">
                <div className="header-links">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                    <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Users</NavLink>
                    <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
                    <NavLink to="/reset-password" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reset Password</NavLink>
                </div>
                <span className="header-user">{user?.username ?? "User"}</span>
                <button type="button" className="header-action" onClick={handleRefreshSession} disabled={isLoading}>
                    {isLoading ? "Refreshing..." : "Refresh session"}
                </button>
                <button type="button" className="theme-toggle" onClick={() => setIsDarkMode((currentValue) => !currentValue)}>
                    {isDarkMode ? "Light mode" : "Dark mode"}
                </button>
                <button type="button" className="header-action danger" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Header;
