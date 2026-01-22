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
      complemento TEXT
    );
  `);

  console.log("✅ Banco e tabela prontos!");
}

// Inserir
export async function insertDenuncia(data) {
  const database = await getDb();
  const { nome, cpf, idade, sexo, endereco, cep, complemento = "" } = data;

  await database.runAsync(
    `INSERT INTO denuncias (nome, cpf, idade, sexo, endereco, cep, complemento)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
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
