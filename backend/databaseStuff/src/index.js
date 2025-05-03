const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA,
    },
};

const client = new pg.Client(config);
module.exports = client;