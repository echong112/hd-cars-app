const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';
const uuid = require('uuid/v4');

let db, dbAll, dbRun;

function init() {
  const dirName = require('path').dirname(location);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  return new Promise((acc, rej) => {
    db = new sqlite3.Database(location, err => {
      if (err) return rej(err);

      if (process.env.NODE_ENV !== 'test')
        console.log(`Using sqlite database at ${location}`);

      db.run(
        'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), make varchar(255), model varchar(255),  carPackage varchar(255), color varchar(255), year INT, category varchar(255), mileage INT, price INT)',
        (err, result) => {
          if (err) return rej(err);
          acc();
        },
      );
    });
  });
}

function initLogs() {
  const dirName = require('path').dirname(location);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  return new Promise((acc, rej) => {
    db = new sqlite3.Database(location, err => {
      if (err) return rej(err);

      if (process.env.NODE_ENV !== 'test')
        console.log(`Using sqlite database at ${location}`);

      db.run(
        'CREATE TABLE IF NOT EXISTS logs (id varchar(36), action varchar(255), carId varchar(36), make varchar(255), model varchar(255),  carPackage varchar(255), color varchar(255), year INT, category varchar(255), mileage INT, price INT)',
        (err, result) => {
          console.log('hi there', err, result);
          if (err) return rej(err);
          acc();
        },
      );
    });
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    db.close(err => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    db.all('SELECT * FROM todo_items', (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(item =>
          Object.assign({}, item, {
            make: item.make,
            model: item.model,
            carPackage: item.carPackage,
            color: item.color,
            year: item.year,
            category: item.category,
            mileage: item.mileage,
            price: item.price,

          }),
        ),
      );
    });
  });
}

async function getItem(id) {
  return new Promise((acc, rej) => {
    db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
      if (err) return rej(err);
      acc(
        console.log(rows),
        rows.map(item =>
          Object.assign({}, item, {
            make: item.make,
            model: item.model,
            carPackage: item.carPackage,
            color: item.color,
            year: item.year,
            category: item.category,
            mileage: item.mileage,
            price: item.price,
          })
        )[0],


      );
    });
  });
}

async function storeItem(item) {
  logItem(item, 'Adding');
  return new Promise((acc, rej) => {
    db.run(
      'INSERT INTO todo_items (id, make, model, carPackage, color, year, category, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [item.id, item.make, item.model, item.carPackage, item.color, item.year, item.category, item.mileage, item.price],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function updateItem(id, item) {
  return new Promise((acc, rej) => {
    db.run(
      'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
      [item.name, item.completed ? 1 : 0, id],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function removeItem(id) {
  return new Promise((acc, rej) => {
    db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
      if (err) return rej(err);
      acc();
    });
  });
}

async function logItem(item, action) {
  console.log(item, action);
  return new Promise((acc, rej) => {
    db.run(
      'INSERT INTO logs (id, action, carId, make, model, carPackage, color, year, category, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid(), action, item.id, item.make, item.model, item.carPackage, item.color, item.year, item.category, item.mileage, item.price],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function getLogs() {
  return new Promise((acc, rej) => {
    db.all('SELECT * FROM logs', (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(log =>
          Object.assign({}, log, {
            id: log.id,
            action: log.action,
            carId: log.carId,
            make: log.make,
            model: log.model,
            carPackage: log.carPackage,
            color: log.color,
            year: log.year,
            category: log.category,
            mileage: log.mileage,
            price: log.price,

          }),
        ),
      );
    });
  });
}

module.exports = {
  init,
  initLogs,
  teardown,
  getItems,
  getItem,
  storeItem,
  updateItem,
  removeItem,
  getLogs
};
