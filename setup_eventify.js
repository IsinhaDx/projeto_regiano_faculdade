const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'Eventify');

function write(filePath, content) {
    const fullPath = path.join(rootDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

console.log('Iniciando geração do repositório Eventify (React + Node + SQLite)...');

// ==========================================================
// DOCS (ARTEFATOS APF)
// ==========================================================
write('docs/APF_Report.md', [
    "# Artefatos do Trabalho em Equipe – APF",
    "## Projeto: Eventify (Gestão de Eventos e Participantes)",
    "",
    "### 1. Levantamento de Requisitos",
    "**RF1** - Manter Eventos (CRUD)",
    "**RF2** - Manter Participantes (CRUD)",
    "**RF3** - Inscrever Participante em Evento (1:N)",
    "",
    "### 2. Contagem APF (IFPUG)",
    "**Fronteiras:** Interna (Módulo Eventify), Externa (ViaCEP, Receita Federal).",
    "",
    "#### Funções de Dados",
    "- **ALI Evento:** Simples (7 PF)",
    "- **ALI Participante:** Simples (7 PF)",
    "- **AIE CEP_LOCAL:** Simples (5 PF)",
    "- **AIE CPF_RECEITA:** Simples (5 PF)",
    "",
    "#### Funções de Transação",
    "- **EE (Entradas Externas):** 16 transações médias (64 PF)",
    "- **CE (Consultas Externas):** 14 transações médias (56 PF)",
    "- **SE (Saídas Externas):** 0 transações",
    "",
    "#### Resultados",
    "- **Tamanho Bruto (PFB):** 144 PFB",
    "- **Fator de Ajuste (VFA):** 0.72 (Usabilidade 3, Desempenho 2, Processamento 2)",
    "- **Tamanho Ajustado (PFA):** 103.68 PFA",
    "- **Esforço Estimado:** 207.36 horas (2h / PF)",
    "- **Orçamento Estimado:** R$ 10.368,00 (R$ 50,00 / hora)"
].join('\n'));

// ==========================================================
// BACKEND - NODE.JS + SQLITE
// ==========================================================
write('server/package.json', JSON.stringify({
  "name": "eventify-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "db:init": "ts-node src/db/init.ts"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  }
}, null, 2));

write('server/tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}, null, 2));

write('server/src/db/schema.sql', [
    "CREATE TABLE IF NOT EXISTS users (",
    "    id INTEGER PRIMARY KEY AUTOINCREMENT,",
    "    name TEXT NOT NULL,",
    "    email TEXT UNIQUE NOT NULL,",
    "    password TEXT NOT NULL",
    ");",
    "CREATE TABLE IF NOT EXISTS events (",
    "    id INTEGER PRIMARY KEY AUTOINCREMENT,",
    "    name TEXT NOT NULL,",
    "    location TEXT NOT NULL,",
    "    zip_code TEXT NOT NULL,",
    "    created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    ");",
    "CREATE TABLE IF NOT EXISTS participants (",
    "    id INTEGER PRIMARY KEY AUTOINCREMENT,",
    "    name TEXT NOT NULL,",
    "    cpf TEXT UNIQUE NOT NULL,",
    "    email TEXT NOT NULL,",
    "    event_id INTEGER NOT NULL,",
    "    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE",
    ");"
].join('\n'));

write('server/src/db/database.ts', [
    "import sqlite3 from 'sqlite3';",
    "import { open, Database } from 'sqlite';",
    "import path from 'path';",
    "let dbInstance: Database | null = null;",
    "export const getDB = async (): Promise<Database> => {",
    "    if (!dbInstance) {",
    "        dbInstance = await open({",
    "            filename: path.join(__dirname, '../../database.sqlite'),",
    "            driver: sqlite3.Database",
    "        });",
    "        await dbInstance.exec('PRAGMA foreign_keys = ON;');",
    "    }",
    "    return dbInstance;",
    "};"
].join('\n'));

write('server/src/db/init.ts', [
    "import { getDB } from './database';",
    "import fs from 'fs';",
    "import path from 'path';",
    "import bcrypt from 'bcryptjs';",
    "const initDB = async () => {",
    "    try {",
    "        const db = await getDB();",
    "        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');",
    "        await db.exec(schema);",
    "        const adminEmail = 'admin@eventify.com';",
    "        const user = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);",
    "        if (!user) {",
    "            const hash = await bcrypt.hash('admin123', 10);",
    "            await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Admin', adminEmail, hash]);",
    "            console.log('Seed: Usuário Admin criado (admin@eventify.com / admin123)');",
    "        }",
    "        console.log('Banco de dados inicializado com sucesso.');",
    "    } catch (err) {",
    "        console.error('Erro ao inicializar BD:', err);",
    "    }",
    "};",
    "initDB();"
].join('\n'));

write('server/src/middlewares/authMiddleware.ts', [
    "import { Request, Response, NextFunction } from 'express';",
    "import jwt from 'jsonwebtoken';",
    "export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {",
    "    const authHeader = req.headers.authorization;",
    "    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });",
    "    const token = authHeader.split(' ')[1];",
    "    try {",
    "        const decoded = jwt.verify(token, 'super_secret_key');",
    "        (req as any).userId = (decoded as any).id;",
    "        next();",
    "    } catch (err) {",
    "        return res.status(401).json({ error: 'Token inválido' });",
    "    }",
    "};"
].join('\n'));

write('server/src/repositories/EventRepository.ts', [
    "import { getDB } from '../db/database';",
    "export interface Event { id?: number; name: string; location: string; zip_code: string; }",
    "export class EventRepository {",
    "    static async findAll(): Promise<Event[]> {",
    "        const db = await getDB();",
    "        return db.all('SELECT * FROM events ORDER BY id DESC');",
    "    }",
    "    static async create(event: Event): Promise<number> {",
    "        const db = await getDB();",
    "        const result = await db.run(",
    "            'INSERT INTO events (name, location, zip_code) VALUES (?, ?, ?)',",
    "            [event.name, event.location, event.zip_code]",
    "        );",
    "        return result.lastID as number;",
    "    }",
    "}"
].join('\n'));

write('server/src/routes.ts', [
    "import { Router } from 'express';",
    "import { getDB } from './db/database';",
    "import bcrypt from 'bcryptjs';",
    "import jwt from 'jsonwebtoken';",
    "import { authMiddleware } from './middlewares/authMiddleware';",
    "import { EventRepository } from './repositories/EventRepository';",
    "const router = Router();",
    "// Auth",
    "router.post('/login', async (req, res) => {",
    "    const { email, password } = req.body;",
    "    const db = await getDB();",
    "    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);",
    "    if (!user || !(await bcrypt.compare(password, user.password))) {",
    "        return res.status(401).json({ error: 'Credenciais inválidas' });",
    "    }",
    "    const token = jwt.sign({ id: user.id }, 'super_secret_key', { expiresIn: '1d' });",
    "    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });",
    "});",
    "// Events",
    "router.get('/events', authMiddleware, async (req, res) => {",
    "    const events = await EventRepository.findAll();",
    "    res.json(events);",
    "});",
    "router.post('/events', authMiddleware, async (req, res) => {",
    "    try {",
    "        const id = await EventRepository.create(req.body);",
    "        res.status(201).json({ id, ...req.body });",
    "    } catch (err) {",
    "        res.status(500).json({ error: 'Erro ao criar evento' });",
    "    }",
    "});",
    "export default router;"
].join('\n'));

write('server/src/server.ts', [
    "import express from 'express';",
    "import cors from 'cors';",
    "import routes from './routes';",
    "const app = express();",
    "app.use(cors());",
    "app.use(express.json());",
    "app.use('/api', routes);",
    "app.listen(3001, () => console.log('Backend rodando na porta 3001'));"
].join('\n'));

// ==========================================================
// FRONTEND - REACT + VITE + CSS MODULES
// ==========================================================
write('client/package.json', JSON.stringify({
  "name": "eventify-client",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}, null, 2));

write('client/tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}, null, 2));

write('client/vite.config.ts', [
    "import { defineConfig } from 'vite';",
    "import react from '@vitejs/plugin-react';",
    "export default defineConfig({",
    "  plugins: [react()],",
    "  server: { port: 3000 }",
    "});"
].join('\n'));

write('client/index.html', [
    "<!DOCTYPE html>",
    "<html lang=\"pt-BR\">",
    "  <head>",
    "    <meta charset=\"UTF-8\" />",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
    "    <title>Eventify - APF</title>",
    "  </head>",
    "  <body>",
    "    <div id=\"root\"></div>",
    "    <script type=\"module\" src=\"/src/main.tsx\"></script>",
    "  </body>",
    "</html>"
].join('\n'));

write('client/src/main.tsx', [
    "import React from 'react';",
    "import ReactDOM from 'react-dom/client';",
    "import App from './App';",
    "import './styles/global.css';",
    "ReactDOM.createRoot(document.getElementById('root')!).render(",
    "  <React.StrictMode>",
    "    <App />",
    "  </React.StrictMode>",
    ");"
].join('\n'));

write('client/src/styles/global.css', [
    "* { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }",
    "body { background-color: #f4f4f9; color: #333; }"
].join('\n'));

write('client/src/styles/Login.module.css', [
    ".container { display: flex; justify-content: center; alignItems: center; height: 100vh; }",
    ".card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }",
    ".title { margin-bottom: 1.5rem; text-align: center; }",
    ".formGroup { margin-bottom: 1rem; }",
    ".input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }",
    ".button { width: 100%; padding: 0.75rem; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }",
    ".button:hover { background: #0056b3; }"
].join('\n'));

write('client/src/styles/Dashboard.module.css', [
    ".container { padding: 2rem; max-width: 800px; margin: 0 auto; }",
    ".header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }",
    ".logout { background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }",
    ".card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }",
    ".eventItem { border-bottom: 1px solid #eee; padding: 1rem 0; }",
    ".eventItem:last-child { border-bottom: none; }"
].join('\n'));

write('client/src/context/AuthContext.tsx', [
    "import React, { createContext, useState, useContext, ReactNode } from 'react';",
    "interface AuthContextType { token: string | null; login: (t: string) => void; logout: () => void; }",
    "const AuthContext = createContext<AuthContextType>({} as AuthContextType);",
    "export const AuthProvider = ({ children }: { children: ReactNode }) => {",
    "    const [token, setToken] = useState<string | null>(localStorage.getItem('eventify_token'));",
    "    const login = (t: string) => { setToken(t); localStorage.setItem('eventify_token', t); };",
    "    const logout = () => { setToken(null); localStorage.removeItem('eventify_token'); };",
    "    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;",
    "};",
    "export const useAuth = () => useContext(AuthContext);"
].join('\n'));

write('client/src/pages/Login.tsx', [
    "import React, { useState } from 'react';",
    "import { useNavigate } from 'react-router-dom';",
    "import { useAuth } from '../context/AuthContext';",
    "import styles from '../styles/Login.module.css';",
    "export default function Login() {",
    "    const [email, setEmail] = useState('admin@eventify.com');",
    "    const [password, setPassword] = useState('admin123');",
    "    const { login } = useAuth();",
    "    const navigate = useNavigate();",
    "    const handleSubmit = async (e: React.FormEvent) => {",
    "        e.preventDefault();",
    "        const res = await fetch('http://localhost:3001/api/login', {",
    "            method: 'POST', headers: { 'Content-Type': 'application/json' },",
    "            body: JSON.stringify({ email, password })",
    "        });",
    "        if (res.ok) {",
    "            const data = await res.json();",
    "            login(data.token);",
    "            navigate('/dashboard');",
    "        } else {",
    "            alert('Falha no login');",
    "        }",
    "    };",
    "    return (",
    "        <div className={styles.container}>",
    "            <div className={styles.card}>",
    "                <h2 className={styles.title}>Eventify - Login</h2>",
    "                <form onSubmit={handleSubmit}>",
    "                    <div className={styles.formGroup}><input className={styles.input} type=\"email\" value={email} onChange={e => setEmail(e.target.value)} /></div>",
    "                    <div className={styles.formGroup}><input className={styles.input} type=\"password\" value={password} onChange={e => setPassword(e.target.value)} /></div>",
    "                    <button className={styles.button} type=\"submit\">Entrar</button>",
    "                </form>",
    "            </div>",
    "        </div>",
    "    );",
    "}"
].join('\n'));

write('client/src/pages/Dashboard.tsx', [
    "import React, { useEffect, useState } from 'react';",
    "import { useAuth } from '../context/AuthContext';",
    "import styles from '../styles/Dashboard.module.css';",
    "export default function Dashboard() {",
    "    const { token, logout } = useAuth();",
    "    const [events, setEvents] = useState<any[]>([]);",
    "    useEffect(() => {",
    "        fetch('http://localhost:3001/api/events', {",
    "            headers: { 'Authorization': 'Bearer ' + token }",
    "        }).then(res => res.json()).then(data => setEvents(data));",
    "    }, []);",
    "    return (",
    "        <div className={styles.container}>",
    "            <div className={styles.header}>",
    "                <h2>Dashboard de Eventos</h2>",
    "                <button className={styles.logout} onClick={logout}>Sair</button>",
    "            </div>",
    "            <div className={styles.card}>",
    "                {events.length === 0 ? <p>Nenhum evento encontrado.</p> : events.map(ev => (",
    "                    <div key={ev.id} className={styles.eventItem}>",
    "                        <strong>{ev.name}</strong> - {ev.location} (CEP: {ev.zip_code})",
    "                    </div>",
    "                ))}",
    "            </div>",
    "        </div>",
    "    );",
    "}"
].join('\n'));

write('client/src/App.tsx', [
    "import React from 'react';",
    "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';",
    "import { AuthProvider, useAuth } from './context/AuthContext';",
    "import Login from './pages/Login';",
    "import Dashboard from './pages/Dashboard';",
    "const PrivateRoute = ({ children }: { children: React.ReactNode }) => {",
    "    const { token } = useAuth();",
    "    return token ? <>{children}</> : <Navigate to=\"/\" />;",
    "};",
    "export default function App() {",
    "    return (",
    "        <AuthProvider>",
    "            <BrowserRouter>",
    "                <Routes>",
    "                    <Route path=\"/\" element={<Login />} />",
    "                    <Route path=\"/dashboard\" element={<PrivateRoute><Dashboard /></PrivateRoute>} />",
    "                </Routes>",
    "            </BrowserRouter>",
    "        </AuthProvider>",
    "    );",
    "}"
].join('\n'));

console.log('Arquivos gerados com sucesso!');
