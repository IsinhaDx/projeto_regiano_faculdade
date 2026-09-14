-- Schema com relacionamentos (baseado nas tabelas do print: events, participants, users)
-- SQLite

PRAGMA foreign_keys = ON;

-- Tabela de usuários (login/autenticação)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabela de eventos (relaciona N:1 com users -> quem organizou o evento)
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    zip_code TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    organizer_id INTEGER NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES users (id)
        ON DELETE RESTRICT
);

-- Tabela de participantes (relaciona N:1 com events)
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    email TEXT,
    event_id INTEGER NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (id)
        ON DELETE CASCADE
);
