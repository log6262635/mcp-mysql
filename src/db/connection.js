import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mcp_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * 执行SQL查询
 * @param {string} sql SQL语句
 * @param {Array} params 参数
 * @returns {Promise<Array>} 查询结果
 */
export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('SQL查询错误:', error.message);
    throw error;
  }
}

/**
 * 初始化数据库连接
 * @returns {Promise<void>}
 */
export async function initDB() {
  try {
    // 测试连接
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    return false;
  }
}

export default {
  query,
  initDB
}; 