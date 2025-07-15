const DB_USERNAME = process.env['DB_USERNAME'];
const DB_PASSWORD = process.env['DB_PASSWORD'];
const DB_HOST = process.env['DB_HOST'];
const DB_PORT = process.env['DB_PORT'];
const DB_NAME = process.env['DB_NAME'];
const DB_CONNSTRING = process.env['DB_CONNSTRING'];
const { Client: PgClient } = require('pg');

//const database = new PgClient({
  //user: DB_USERNAME,
  //password: DB_PASSWORD,
  //host: DB_HOST,
  //port: Number(DB_PORT),
  //database: DB_NAME,
  //ssl: {rejectUnauthorized: false},
//});

const database = new PgClient({
  connectionString: DB_CONNSTRING
});

database
  .connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database', err);
  });

async function getUsername(item){
  try {
    const selectQuery = `SELECT username FROM notifications WHERE item = $1 LIMIT 1`;
    const result = await database.query(selectQuery, [item]);
    return result.rows[0].username; // Maps object to array
  } catch (err) {
    console.error('Error executing query', err);
    return [];
  }
}

async function insertItem(item, username){
  const insertQuery = `INSERT INTO notifications (item, username) VALUES ($1, $2)`;
  database.query(insertQuery, [item, username], (err, result) => {
    if (err) {
      console.error('Error inserting data', err);
    } else {
      console.log('Data inserted successfully');
    }
  });
}

async function deleteItem(item){
  const deleteQuery = `DELETE FROM notifications WHERE item = $1`;
  database.query(deleteQuery, [item], (err, result) => {
    if (err) {
      console.error('Error deleting data', err);
    } else {
      console.log('Data deleted successfully');
    }
  });
}

async function listItems() {
  try {
    const selectQuery = `SELECT item FROM notifications`;
    const result = await database.query(selectQuery);
    return result.rows.map(row => row.item); // Maps object to array
  } catch (err) {
    console.error('Error executing query', err);
    return [];
  }
}

module.exports = {
  getUsername,
  insertItem,
  deleteItem,
  listItems,
};
