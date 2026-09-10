import { Router } from 'express';
import { getDB } from './db/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './middlewares/authMiddleware';
import { EventRepository } from './repositories/EventRepository';
import { ParticipantRepository } from './repositories/ParticipantRepository';
const router = Router();
// Auth
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await getDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id }, 'super_secret_key', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});
// Events
router.get('/events', authMiddleware, async (req, res) => res.json(await EventRepository.findAll()));
router.post('/events', authMiddleware, async (req, res) => {
    try { res.status(201).json({ id: await EventRepository.create(req.body) }); } catch(err) { res.status(500).json({error: 'Erro'}); }
});
router.put('/events/:id', authMiddleware, async (req, res) => {
    await EventRepository.update(Number(req.params.id), req.body); res.sendStatus(204);
});
router.delete('/events/:id', authMiddleware, async (req, res) => {
    await EventRepository.delete(Number(req.params.id)); res.sendStatus(204);
});
// Participants
router.get('/participants', authMiddleware, async (req, res) => res.json(await ParticipantRepository.findAll()));
router.post('/participants', authMiddleware, async (req, res) => {
    try { res.status(201).json({ id: await ParticipantRepository.create(req.body) }); } catch(err) { res.status(500).json({error: 'Erro (CPF Duplicado?)'}); }
});
router.put('/participants/:id', authMiddleware, async (req, res) => {
    await ParticipantRepository.update(Number(req.params.id), req.body); res.sendStatus(204);
});
router.delete('/participants/:id', authMiddleware, async (req, res) => {
    await ParticipantRepository.delete(Number(req.params.id)); res.sendStatus(204);
});
export default router;
