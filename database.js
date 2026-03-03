const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function conectarDB() {
    return open({
        filename: './distribuidora.db',
        driver: sqlite3.Database
    });
}

module.exports = conectarDB;