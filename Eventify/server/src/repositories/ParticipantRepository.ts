import { getDB } from '../db/database';
export interface Participant { id?: number; name: string; cpf: string; email: string; event_id: number; event_name?: string; }
export class ParticipantRepository {
    static async findAll(): Promise<Participant[]> {
        const db = await getDB();
        return db.all(`SELECT p.*, e.name as event_name FROM participants p LEFT JOIN events e ON p.event_id = e.id ORDER BY p.id DESC`);
    }
    static async create(p: Participant): Promise<number> {
        const db = await getDB();
        const result = await db.run('INSERT INTO participants (name, cpf, email, event_id) VALUES (?, ?, ?, ?)', [p.name, p.cpf, p.email, p.event_id]);
        return result.lastID as number;
    }
    static async update(id: number, p: Participant): Promise<void> {
        const db = await getDB();
        await db.run('UPDATE participants SET name = ?, cpf = ?, email = ?, event_id = ? WHERE id = ?', [p.name, p.cpf, p.email, p.event_id, id]);
    }
    static async delete(id: number): Promise<void> {
        const db = await getDB();
        await db.run('DELETE FROM participants WHERE id = ?', [id]);
    }
}
