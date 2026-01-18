import * as SQLite from "expo-sqlite";

let db = null;

// Abre/cria o banco SQLite
export async function openDatabase() {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("denuncias.db");
  return db;
}

export async function createTables() {
  const db = await openDatabase();

  // SQL para criar a tabela se não existir
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS denuncias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      idade INTEGER NOT NULL,
      sexo TEXT NOT NULL,
      endereco TEXT NOT NULL,
      cep TEXT NOT NULL,
      complemento TEXT
    );
  `);
  // ✅ LOG DE CONFIRMAÇÃO
  console.log("✅ Banco e tabela prontos!");
}
