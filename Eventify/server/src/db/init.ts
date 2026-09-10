import { getDB } from './database';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
const initDB = async () => {
    try {
        const db = await getDB();
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
        await db.exec(schema);
        const users = [
            { name: 'Admin', email: 'admin@eventify.com', pass: 'admin123' },
            { name: 'Gerente', email: 'gerente@eventify.com', pass: 'gerente123' },
            { name: 'Operador', email: 'operador@eventify.com', pass: 'operador123' }
        ];
        for (const u of users) {
            if (!(await db.get('SELECT * FROM users WHERE email = ?', [u.email]))) {
                await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [u.name, u.email, await bcrypt.hash(u.pass, 10)]);
            }
        }
        const eventsCount = await db.get('SELECT COUNT(*) as c FROM events');
        if (eventsCount.c === 0) {
            await db.run("INSERT INTO events (name, location, zip_code) VALUES ('Workshop de APF', 'Auditório Principal', '01001-000')");
            await db.run("INSERT INTO events (name, location, zip_code) VALUES ('Semana de Tecnologia 2026', 'Bloco B - Sala 10', '20040-002')");
            await db.run("INSERT INTO events (name, location, zip_code) VALUES ('Simpósio de Node.js', 'Centro de Convenções', '30140-071')");
        }
        console.log('Banco de dados inicializado/atualizado com sucesso.');
    } catch (err) {
        console.error('Erro ao inicializar BD:', err);
    }
};
initDB();
