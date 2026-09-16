import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AppLayout.module.css';

type IconName = 'grid' | 'calendar' | 'users' | 'logout' | 'menu' | 'close';

function Icon({ name }: { name: IconName }) {
    const paths: Record<IconName, React.ReactNode> = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
        calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
        logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-6" /></>,
        menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
        close: <><path d="M6 6l12 12M18 6L6 18" /></>,
    };
    return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const initials = user?.name?.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={styles.shell}>
            {open && <button className={styles.overlay} aria-label="Fechar menu" onClick={() => setOpen(false)} />}
            <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
                <div className={styles.brand}>
                    <div className={styles.brandMark}>E</div>
                    <div>
                        <strong>Eventify</strong>
                        <span>Gestão de eventos</span>
                    </div>
                    <button className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Fechar menu">
                        <Icon name="close" />
                    </button>
                </div>

                <div className={styles.user}>
                    <div className={styles.avatar}>{initials}</div>
                    <div className={styles.userInfo}>
                        <strong>{user?.name || 'Usuário'}</strong>
                        <span>{user?.email || 'Conta Eventify'}</span>
                    </div>
                </div>

                <nav className={styles.nav} aria-label="Navegação principal">
                    <span className={styles.sectionLabel}>MENU</span>
                    <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                        <Icon name="grid" /><span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/events" onClick={() => setOpen(false)} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                        <Icon name="calendar" /><span>Eventos</span>
                    </NavLink>
                    <NavLink to="/participants" onClick={() => setOpen(false)} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                        <Icon name="users" /><span>Participantes</span>
                    </NavLink>
                </nav>

                <button className={styles.logout} onClick={handleLogout}>
                    <Icon name="logout" /><span>Sair do sistema</span>
                </button>
            </aside>

            <main className={styles.main}>
                <header className={styles.mobileHeader}>
                    <button className={styles.menuButton} onClick={() => setOpen(true)} aria-label="Abrir menu"><Icon name="menu" /></button>
                    <strong>Eventify</strong>
                </header>
                <div className={styles.content}>{children}</div>
            </main>
        </div>
    );
}
