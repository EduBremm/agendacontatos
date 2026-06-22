import * as SQLite from 'expo-sqlite';
import { Contact } from '../models/Contact';

// Abre o banco de dados de forma síncrona; o arquivo é criado automaticamente se não existir
const db = SQLite.openDatabaseSync('contacts.db');

// Inicializa o schema imediatamente ao carregar o módulo para evitar race condition
// com useFocusEffect nas telas filhas (React executa efeitos dos filhos antes dos pais)
_criarSchema();

function _criarSchema(): void {
  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT    NOT NULL,
      phone    TEXT    NOT NULL,
      email    TEXT,
      birthday TEXT
    );
  `);
}

/**
 * Mantida como API pública. O schema já é criado no carregamento do módulo,
 * mas esta função pode ser chamada de App.tsx para documentar a intenção
 * explícita de inicialização — é idempotente (CREATE TABLE IF NOT EXISTS).
 *
 * Por que WAL: Write-Ahead Logging melhora a performance de escrita e permite
 * leituras concorrentes sem bloquear gravações.
 */
export function initDatabase(): void {
  // no-op — schema já inicializado via _criarSchema() no topo do módulo
}

// Retorna todos os contatos ordenados alfabeticamente por nome
export function getAllContacts(): Contact[] {
  return db.getAllSync<Contact>(
    'SELECT id, name, phone, email, birthday FROM contacts ORDER BY name ASC;'
  );
}

// Insere um novo contato e retorna o id gerado pelo banco
export function insertContact(contact: Omit<Contact, 'id'>): number {
  const result = db.runSync(
    'INSERT INTO contacts (name, phone, email, birthday) VALUES (?, ?, ?, ?);',
    [contact.name, contact.phone, contact.email ?? null, contact.birthday ?? null]
  );
  return result.lastInsertRowId;
}

// Atualiza todos os campos de um contato existente pelo id
export function updateContact(contact: Contact): void {
  db.runSync(
    'UPDATE contacts SET name = ?, phone = ?, email = ?, birthday = ? WHERE id = ?;',
    [contact.name, contact.phone, contact.email ?? null, contact.birthday ?? null, contact.id]
  );
}

// Remove permanentemente um contato pelo id
export function deleteContact(id: number): void {
  db.runSync('DELETE FROM contacts WHERE id = ?;', [id]);
}
