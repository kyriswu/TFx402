import mysql from 'mysql2/promise';

const env = process.env.NODE_ENV;
const host = env === 'online' ? '172.17.0.1' : 'localhost';

const pool = mysql.createPool({
  host: host,      // 数据库主机
  user: 'root',  // 数据库用户名
  password: '123456', // 数据库密码
  database: 'snatchit', // 数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4', // 设置字符集为 utf8mb4
});

export default pool;