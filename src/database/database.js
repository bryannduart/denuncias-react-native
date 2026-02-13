import * as SQLite from "expo-sqlite";

let db = null;

async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("denuncias.db");
  return db;
}

export async function createTables() {
  const database = await getDb();

  await database.execAsync(`
  CREATE TABLE IF NOT EXISTS denuncias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    idade INTEGER NOT NULL,
    sexo TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cep TEXT NOT NULL,
    complemento TEXT,

    syncStatus TEXT NOT NULL DEFAULT 'PENDING',
    attempts INTEGER NOT NULL DEFAULT 0,
    lastAttemptAt TEXT
  );
`);

  const cols = await database.getAllAsync(`PRAGMA table_info(denuncias);`);
  const has = (name) => cols.some((c) => c.name === name);

  if (!has("syncStatus")) {
    await database.execAsync(
      `ALTER TABLE denuncias ADD COLUMN syncStatus TEXT NOT NULL DEFAULT 'PENDING';`,
    );
  }

  if (!has("attempts")) {
    await database.execAsync(
      `ALTER TABLE denuncias ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;`,
    );
  }

  if (!has("lastAttemptAt")) {
    await database.execAsync(
      `ALTER TABLE denuncias ADD COLUMN lastAttemptAt TEXT;`,
    );
  }

  console.log("✅ Banco e tabela prontos!");
}

// Inserir
export async function insertDenuncia(data) {
  const database = await getDb();
  const { nome, cpf, idade, sexo, endereco, cep, complemento = "" } = data;

  await database.runAsync(
    `INSERT INTO denuncias (nome, cpf, idade, sexo, endereco, cep, complemento, syncStatus, attempts, lastAttemptAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 0, NULL);`,
    [nome, cpf, idade, sexo, endereco, cep, complemento],
  );
}

// Listar
export async function getDenuncias() {
  const database = await getDb();
  const rows = await database.getAllAsync(
    `SELECT * FROM denuncias ORDER BY id DESC;`,
  );
  return rows;
}

// Deletar
export async function deleteDenuncia(id) {
  const database = await getDb();
  await database.runAsync(`DELETE FROM denuncias WHERE id = ?;`, [id]);
}

// Pegar pendentes (para sincronizar)
export async function getPendingDenuncias() {
  const database = await getDb();
  return await database.getAllAsync(
    `SELECT * FROM denuncias WHERE syncStatus = 'PENDING' ORDER BY id ASC;`,
  );
}

// Marcar como enviado
export async function markAsSent(id) {
  const database = await getDb();
  await database.runAsync(
    `UPDATE denuncias SET syncStatus = 'SENT' WHERE id = ?;`,
    [id],
  );
}

// Registrar tentativa (quando falhar)
export async function registerAttempt(id) {
  const database = await getDb();
  await database.runAsync(
    `UPDATE denuncias
     SET attempts = attempts + 1,
         lastAttemptAt = ?
     WHERE id = ?;`,
    [new Date().toISOString(), id],
  );
}
