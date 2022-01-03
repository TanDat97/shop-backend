import mysql from 'mysql2/promise';
import config from './index';

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.host,
  post: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

export const clientConnect = async () => {
  return pool.getConnection()
};
