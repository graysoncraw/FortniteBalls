const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'notifications.json');

function ensureStore() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]\n', 'utf8');
  }
}

function readStore() {
  ensureStore();
  const raw = fs.readFileSync(dataPath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse notifications store', error);
    return [];
  }
}

function writeStore(items) {
  fs.writeFileSync(dataPath, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

async function getUsername(item) {
  const match = readStore().find((entry) => entry.item === item);
  return match ? match.username : null;
}

async function insertItem(item, username) {
  const items = readStore();
  const existingIndex = items.findIndex((entry) => entry.item === item);
  const nextEntry = { item, username };

  if (existingIndex >= 0) {
    items[existingIndex] = nextEntry;
  } else {
    items.push(nextEntry);
  }

  writeStore(items);
  return true;
}

async function deleteItem(item) {
  const items = readStore();
  const nextItems = items.filter((entry) => entry.item !== item);

  if (nextItems.length === items.length) {
    return false;
  }

  writeStore(nextItems);
  return true;
}

async function listItems() {
  return readStore().map((entry) => entry.item);
}

module.exports = {
  getUsername,
  insertItem,
  deleteItem,
  listItems,
};
