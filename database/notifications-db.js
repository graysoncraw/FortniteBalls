const { Pool } = require('pg');
const LOG_PREFIX = '[notifications-db]';

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initPromise = database
  .query(`
    CREATE TABLE IF NOT EXISTS notifications (
      item TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      user_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  .then(() =>
    database.query(`
      ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS user_id TEXT
    `)
  )
  .then(() => {
    console.log(`${LOG_PREFIX} connected to Postgres`);
  })
  .catch((err) => {
    console.error(`${LOG_PREFIX} failed to initialize`, err?.message || err);
  });

async function ensureInitialized() {
  await initPromise;
}

async function getUsername(item) {
  try {
    await ensureInitialized();
    const selectQuery = `SELECT username FROM notifications WHERE item = $1 LIMIT 1`;
    const result = await database.query(selectQuery, [item]);
    return result.rows[0] ? result.rows[0].username : null;
  } catch (err) {
    console.error(`${LOG_PREFIX} getUsername query failed (item=${item})`, err?.message || err);
    return null;
  }
}

async function insertItem(item, username, userId = null) {
  try {
    await ensureInitialized();
    const insertQuery = `
      INSERT INTO notifications (item, username, user_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (item) DO UPDATE
      SET username = EXCLUDED.username,
          user_id = EXCLUDED.user_id
    `;
    await database.query(insertQuery, [item, username, userId]);
    return true;
  } catch (err) {
    console.error(`${LOG_PREFIX} insertItem failed (item=${item}, username=${username}, userId=${userId})`, err?.message || err);
    return false;
  }
}

async function deleteItem(item) {
  try {
    await ensureInitialized();
    const deleteQuery = `DELETE FROM notifications WHERE item = $1`;
    await database.query(deleteQuery, [item]);
    return true;
  } catch (err) {
    console.error(`${LOG_PREFIX} deleteItem failed (item=${item})`, err?.message || err);
    return false;
  }
}

async function listItems() {
  try {
    await ensureInitialized();
    const selectQuery = `SELECT item FROM notifications`;
    const result = await database.query(selectQuery);
    return result.rows.map((row) => row.item);
  } catch (err) {
    console.error(`${LOG_PREFIX} listItems query failed`, err?.message || err);
    return [];
  }
}

async function listNotifications() {
  try {
    await ensureInitialized();
    const selectQuery = `
      SELECT item, username, user_id
      FROM notifications
      ORDER BY item ASC
    `;
    const result = await database.query(selectQuery);
    return result.rows.map((row) => ({
      item: row.item,
      username: row.username,
      userId: row.user_id || null,
    }));
  } catch (err) {
    console.error(`${LOG_PREFIX} listNotifications query failed`, err?.message || err);
    return [];
  }
}

module.exports = {
  getUsername,
  insertItem,
  deleteItem,
  listItems,
  listNotifications,
};
