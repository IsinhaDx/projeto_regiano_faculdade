import React, { createContext, useState, useContext, ReactNode } from 'react';
interface AuthContextType { token: string | null; login: (t: string) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('eventify_token'));
    const login = (t: string) => { setToken(t); localStorage.setItem('eventify_token', t); };
    const logout = () => { setToken(null); localStorage.removeItem('eventify_token'); };
    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
