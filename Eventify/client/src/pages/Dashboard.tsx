import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Pages.module.css';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <header className={styles.pageHeader}>
                <div>
                    <span className={styles.eyebrow}>VISÃO GERAL</span>
                    <h1>Olá, {user?.name?.split(' ')[0] || 'usuário'} 👋</h1>
                    <p>Gerencie seus eventos e participantes em um só lugar.</p>
                </div>
            </header>

            <section className={styles.dashboardGrid}>
                <button className={styles.actionCard} onClick={() => navigate('/events')}>
                    <div className={`${styles.cardIcon} ${styles.blue}`}><span>▦</span></div>
                    <div className={styles.actionText}>
                        <span className={styles.cardLabel}>GESTÃO</span>
                        <h2>Eventos</h2>
                        <p>Crie, edite e organize os eventos cadastrados.</p>
                    </div>
                    <span className={styles.arrow}>→</span>
                </button>

                <button className={styles.actionCard} onClick={() => navigate('/participants')}>
                    <div className={`${styles.cardIcon} ${styles.green}`}><span>♙</span></div>
                    <div className={styles.actionText}>
                        <span className={styles.cardLabel}>GESTÃO</span>
                        <h2>Participantes</h2>
                        <p>Cadastre participantes e faça inscrições em eventos.</p>
                    </div>
                    <span className={styles.arrow}>→</span>
                </button>
            </section>

            <section className={styles.infoCard}>
                <div className={styles.infoIcon}>i</div>
                <div>
                    <h3>Eventify</h3>
                    <p>Uma maneira simples de manter seus eventos e participantes organizados.</p>
                </div>
            </section>
        </div>
    );
}
