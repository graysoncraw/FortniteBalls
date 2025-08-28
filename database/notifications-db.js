const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'notifications.sqlite');
const database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    database.run(
      `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item TEXT,
        username TEXT
      )`
    );
  }
});

async function getUsername(item) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT username FROM notifications WHERE item = ? LIMIT 1`;
    database.get(selectQuery, [item], (err, row) => {
      if (err) {
        console.error('Error executing query', err);
        resolve(null);
      } else {
        resolve(row ? row.username : null);
      }
    });
  });
}

async function insertItem(item, username) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT OR REPLACE INTO notifications (item, username) VALUES (?, ?)`;
    database.run(insertQuery, [item, username], function (err) {
      if (err) {
        console.error('Error inserting data', err);
        resolve(false);
      } else {
        console.log('Data inserted successfully');
        resolve(true);
      }
    });
  });
}

async function deleteItem(item) {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM notifications WHERE item = ?`;
    database.run(deleteQuery, [item], function (err) {
      if (err) {
        console.error('Error deleting data', err);
        resolve(false);
      } else {
        console.log('Data deleted successfully');
        resolve(true);
      }
    });
  });
}

async function listItems() {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT item FROM notifications`;
    database.all(selectQuery, [], (err, rows) => {
      if (err) {
        console.error('Error executing query', err);
        resolve([]);
      } else {
        resolve(rows.map(row => row.item));
      }
    });
  });
}

module.exports = {
  getUsername,
  insertItem,
  deleteItem,
  listItems,
};