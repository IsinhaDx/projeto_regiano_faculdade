import { getDB } from '../db/database';
export interface Event { id?: number; name: string; location: string; zip_code: string; }
export class EventRepository {
    static async findAll(): Promise<Event[]> {
        const db = await getDB();
        return db.all('SELECT * FROM events ORDER BY id DESC');
    }
    static async create(e: Event): Promise<number> {
        const db = await getDB();
        const result = await db.run('INSERT INTO events (name, location, zip_code) VALUES (?, ?, ?)', [e.name, e.location, e.zip_code]);
        return result.lastID as number;
    }
    static async update(id: number, e: Event): Promise<void> {
        const db = await getDB();
        await db.run('UPDATE events SET name = ?, location = ?, zip_code = ? WHERE id = ?', [e.name, e.location, e.zip_code, id]);
    }
    static async delete(id: number): Promise<void> {
        const db = await getDB();
        await db.run('DELETE FROM events WHERE id = ?', [id]);
    }
}
