import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Pages.module.css';
export default function Events() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('list');
    const [formData, setFormData] = useState({ id: null, name: '', location: '', zip_code: '' });
    const loadEvents = async () => {
        const res = await fetch('http://localhost:3001/api/events', { headers: { 'Authorization': 'Bearer ' + token } });
        setEvents(await res.json());
    };
    useEffect(() => { loadEvents(); }, []);
    const handleCepBlur = async (e: any) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (!data.erro) setFormData({ ...formData, location: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}` });
            } catch (err) {}
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id ? `http://localhost:3001/api/events/${formData.id}` : 'http://localhost:3001/api/events';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(formData) });
        setView('list'); loadEvents();
    };
    const handleDelete = async (id: number) => {
        if(window.confirm('Tem certeza que deseja excluir este evento?')) {
            await fetch(`http://localhost:3001/api/events/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
            loadEvents();
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gestão de Eventos</h2>
                <div>
                    <button onClick={() => navigate('/dashboard')} className={styles.btnSecondary}>Voltar</button>
                    {view === 'list' && <button onClick={() => { setFormData({ id: null, name: '', location: '', zip_code: '' }); setView('form'); }} className={styles.btnPrimary}>Novo Evento</button>}
                </div>
            </div>
            {view === 'list' ? (
                <table className={styles.table}>
                    <thead><tr><th>ID</th><th>Nome</th><th>CEP</th><th>Local (ViaCEP)</th><th>Ações</th></tr></thead>
                    <tbody>
                        {events.map((ev: any) => (
                            <tr key={ev.id}>
                                <td>{ev.id}</td><td>{ev.name}</td><td>{ev.zip_code}</td><td>{ev.location}</td>
                                <td>
                                    <button onClick={() => { setFormData(ev); setView('form'); }} className={styles.btnLink}>Editar</button>
                                    <button onClick={() => handleDelete(ev.id)} className={styles.btnLinkDanger}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}><label>Nome do Evento</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>CEP (Digite e saia do campo para buscar)</label><input required value={formData.zip_code} onBlur={handleCepBlur} onChange={e => setFormData({...formData, zip_code: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>Local</label><input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setView('list')} className={styles.btnSecondary}>Cancelar</button>
                        <button type="submit" className={styles.btnPrimary}>Salvar Evento</button>
                    </div>
                </form>
            )}
        </div>
    );
}
