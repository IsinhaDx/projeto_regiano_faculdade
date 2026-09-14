import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Pages.module.css';
export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const initials = user?.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(name => name[0])
        .join('')
        .toUpperCase();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Sistema Eventify - Menu Principal</h2>
                <button className={styles.btnLinkDanger} onClick={logout}>Sair do Sistema</button>
            </div>
            <section className={styles.userPanel} aria-label="Painel do usuário">
                <div className={styles.userAvatar}>{initials || 'U'}</div>
                <div>
                    <span className={styles.userLabel}>Usuário conectado</span>
                    <h3>{user?.name || 'Usuário'}</h3>
                    <p>{user?.email || 'Conta Eventify'}</p>
                </div>
            </section>
            <div className={styles.cardsContainer}>
                <div className={styles.menuCard} onClick={() => navigate('/events')}>
                    <h3>Manter Eventos</h3>
                    <p>Gestão completa de eventos (CRUD). Busca automática de CEP via API ViaCEP.</p>
                </div>
                <div className={styles.menuCard} onClick={() => navigate('/participants')}>
                    <h3>Manter Participantes</h3>
                    <p>Gestão e Inscrição em Eventos. Validação rígida e matemática de CPF.</p>
                </div>
            </div>
        </div>
    );
}
