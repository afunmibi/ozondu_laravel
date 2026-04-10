import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const location = useLocation();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
                setUser(null);
            }
        }

        const isAdminRoute = location.pathname.startsWith('/admin');

        // Avoid blocking public pages with auth refresh requests on slow hosts.
        if (!isAdminRoute) {
            setLoading(false);
            return;
        }

        let isActive = true;

        authService.getUser()
                .then(res => {
                    if (!isActive) {
                        return;
                    }

                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                })
                .catch(() => {
                    if (!isActive) {
                        return;
                    }

                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                })
                .finally(() => {
                    if (isActive) {
                        setLoading(false);
                    }
                });

        return () => {
            isActive = false;
        };
    }, [location.pathname]);

    const login = async (email, password) => {
        const res = await authService.login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
