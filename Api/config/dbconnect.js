var mysql = require('mysql');

var DB_HOST_NAME = process.env.DB_HOST || 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
var USER = process.env.DB_USER || 'admin';
var PWD = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
var DATABASE = process.env.DB_NAME || 'jbac_jbac';
var PORT = Number(process.env.DB_PORT) || 3306;

var MAX_POOL_SIZE = 50;

var MySQLConPool = mysql.createPool({
    host: DB_HOST_NAME,
    port: PORT,
    user: USER,
    password: PWD,
    database: DATABASE,
    connectTimeout: 20000,
    connectionLimit: MAX_POOL_SIZE,
    debug: false,
    multipleStatements: true,
    charset: 'utf8mb4'
});

exports.MySQLConPool = MySQLConPool;