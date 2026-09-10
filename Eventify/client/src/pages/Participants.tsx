import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Pages.module.css';
const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if(cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let add = 0; for (let i = 0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11); if (rev === 10 || rev === 11) rev = 0; if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0; for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11); if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(cpf.charAt(10));
};
export default function Participants() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('list');
    const [formData, setFormData] = useState({ id: null, name: '', cpf: '', email: '', event_id: '' });
    const loadData = async () => {
        const pRes = await fetch('http://localhost:3001/api/participants', { headers: { 'Authorization': 'Bearer ' + token } });
        setParticipants(await pRes.json());
        const eRes = await fetch('http://localhost:3001/api/events', { headers: { 'Authorization': 'Bearer ' + token } });
        setEvents(await eRes.json());
    };
    useEffect(() => { loadData(); }, []);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(!isValidCPF(formData.cpf)) return alert('CPF Inválido! A validação algorítmica falhou.');
        if(!formData.event_id) return alert('Selecione um evento para inscrever o participante.');
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id ? `http://localhost:3001/api/participants/${formData.id}` : 'http://localhost:3001/api/participants';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(formData) });
        if(!res.ok) return alert('Erro ao salvar participante. Verifique se o CPF já está cadastrado.');
        setView('list'); loadData();
    };
    const handleDelete = async (id: number) => {
        if(window.confirm('Excluir participante?')) {
            await fetch(`http://localhost:3001/api/participants/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
            loadData();
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gestão de Participantes</h2>
                <div>
                    <button onClick={() => navigate('/dashboard')} className={styles.btnSecondary}>Voltar</button>
                    {view === 'list' && <button onClick={() => { setFormData({ id: null, name: '', cpf: '', email: '', event_id: '' }); setView('form'); }} className={styles.btnPrimary}>Novo Participante</button>}
                </div>
            </div>
            {view === 'list' ? (
                <table className={styles.table}>
                    <thead><tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Evento Alocado</th><th>Ações</th></tr></thead>
                    <tbody>
                        {participants.map((p: any) => (
                            <tr key={p.id}>
                                <td>{p.name}</td><td>{p.cpf}</td><td>{p.email}</td><td>{p.event_name}</td>
                                <td>
                                    <button onClick={() => { setFormData(p); setView('form'); }} className={styles.btnLink}>Editar</button>
                                    <button onClick={() => handleDelete(p.id)} className={styles.btnLinkDanger}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}><label>Nome Completo</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>CPF (Apenas números)</label><input required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>E-mail</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    <div className={styles.formGroup}>
                        <label>Inscrever no Evento</label>
                        <select required value={formData.event_id} onChange={e => setFormData({...formData, event_id: e.target.value})}>
                            <option value="">-- Selecione um Evento --</option>
                            {events.map((ev: any) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                        </select>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setView('list')} className={styles.btnSecondary}>Cancelar</button>
                        <button type="submit" className={styles.btnPrimary}>Salvar Participante</button>
                    </div>
                </form>
            )}
        </div>
    );
}
