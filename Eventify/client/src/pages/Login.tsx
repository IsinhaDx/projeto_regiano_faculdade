import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('admin@eventify.com');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                alert('Falha no login');
            }
        } catch {
            alert('Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.card}>
                <div className={styles.brandMark}>E</div>
                <span className={styles.overline}>EVENTIFY</span>
                <h1>Bem-vindo de volta</h1>
                <p className={styles.subtitle}>Entre na sua conta para continuar.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Senha</label>
                        <input id="password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                    </div>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <small className={styles.hint}>Acesse com suas credenciais do Eventify.</small>
            </section>
        </main>
    );
}
