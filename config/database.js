const { createPool } = require('mysql');

const pool = createPool({
    port    :   process.env.RDS_PORT,
    host    :   process.env.RDS_HOSTNAME,
    user    :   process.env.RDS_USERNAME,
    password:   process.env.RDS_PASSWORD,
    database:   process.env.RDS_DB_NAME
});

module.exports = pool;
