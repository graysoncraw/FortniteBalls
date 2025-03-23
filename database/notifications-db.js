// Global dictionary to store reminders
const notificationsDB = {};

module.exports = {
  notificationsDB,
  getKeyValue: (key) => {
    return notificationsDB[key] || null;
  },
  setKeyValue: (key, value) => {
    notificationsDB[key] = value;
  },
  deleteKey: (key) => {
    delete notificationsDB[key];
  },
  listKeys: () => Object.keys(notificationsDB),
};
