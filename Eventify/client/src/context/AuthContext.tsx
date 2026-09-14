import React, { createContext, useState, useContext, ReactNode } from 'react';
export interface User { id: number; name: string; email: string; }
interface AuthContextType { token: string | null; user: User | null; login: (t: string, u: User) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('eventify_token'));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('eventify_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const login = (t: string, u: User) => {
        setToken(t);
        setUser(u);
        localStorage.setItem('eventify_token', t);
        localStorage.setItem('eventify_user', JSON.stringify(u));
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('eventify_token');
        localStorage.removeItem('eventify_user');
    };
    return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
