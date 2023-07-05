const Database = require("@replit/database");
const db = new Database();

async function setKeyValue(key, value) {
    await db.set(key, value);
};

async function getKeyValue(key) {
    let value = await db.get(key);
    return value;
};

async function deleteKey(key) {
    await db.delete(key);
};

async function listKeys() {
    let keys = await db.list()
    return keys;
};

async function listKeyPrefix(prefix) {
    let matches = await db.list(prefix);
    return matches;
};

listKeys().then((keys) => console.log(keys));