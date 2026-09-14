import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
export default function Login() {
    const [email, setEmail] = useState('admin@eventify.com');
    const [password, setPassword] = useState('admin123');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            const data = await res.json();
            login(data.token, data.user);
            navigate('/dashboard');
        } else {
            alert('Falha no login');
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Eventify - Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}><input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    <div className={styles.formGroup}><input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                    <button className={styles.button} type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}
