import { query } from './connection.js';

/**
 * 创建表
 * @param {string} tableName 表名
 * @param {string} schema 表结构，例如 "id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255)"
 * @returns {Promise<object>} 操作结果
 */
export async function createTable(tableName, schema) {
  try {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
    await query(sql);
    return { success: true, message: `表 ${tableName} 创建成功` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 删除表
 * @param {string} tableName 表名
 * @returns {Promise<object>} 操作结果
 */
export async function dropTable(tableName) {
  try {
    const sql = `DROP TABLE IF EXISTS ${tableName}`;
    await query(sql);
    return { success: true, message: `表 ${tableName} 删除成功` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 获取表结构
 * @param {string} tableName 表名
 * @returns {Promise<object>} 表结构信息
 */
export async function getTableSchema(tableName) {
  try {
    const sql = `DESCRIBE ${tableName}`;
    const result = await query(sql);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 列出所有表
 * @returns {Promise<object>} 表列表
 */
export async function listTables() {
  try {
    const sql = `SHOW TABLES`;
    const result = await query(sql);
    const tables = result.map(row => Object.values(row)[0]);
    return { success: true, data: tables };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 插入数据
 * @param {string} tableName 表名
 * @param {object} data 数据对象，如 {name: 'John', age: 30}
 * @returns {Promise<object>} 操作结果
 */
export async function insertData(tableName, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    
    return { 
      success: true, 
      message: `数据插入成功`, 
      data: { 
        insertId: result.insertId,
        affectedRows: result.affectedRows 
      } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 更新数据
 * @param {string} tableName 表名
 * @param {object} data 更新的数据，如 {name: 'John', age: 30}
 * @param {object} condition 更新条件，如 {id: 1}
 * @returns {Promise<object>} 操作结果
 */
export async function updateData(tableName, data, condition) {
  try {
    const dataEntries = Object.entries(data);
    const conditionEntries = Object.entries(condition);
    
    if (dataEntries.length === 0) {
      return { success: false, message: '更新数据不能为空' };
    }
    
    if (conditionEntries.length === 0) {
      return { success: false, message: '更新条件不能为空' };
    }
    
    const setClause = dataEntries.map(([key, _]) => `${key} = ?`).join(', ');
    const whereClause = conditionEntries.map(([key, _]) => `${key} = ?`).join(' AND ');
    const values = [...dataEntries.map(([_, value]) => value), ...conditionEntries.map(([_, value]) => value)];
    
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const result = await query(sql, values);
    
    return { 
      success: true, 
      message: `数据更新成功`, 
      data: { 
        affectedRows: result.affectedRows 
      } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 删除数据
 * @param {string} tableName 表名
 * @param {object} condition 删除条件，如 {id: 1}
 * @returns {Promise<object>} 操作结果
 */
export async function deleteData(tableName, condition) {
  try {
    const conditionEntries = Object.entries(condition);
    
    if (conditionEntries.length === 0) {
      return { success: false, message: '删除条件不能为空' };
    }
    
    const whereClause = conditionEntries.map(([key, _]) => `${key} = ?`).join(' AND ');
    const values = conditionEntries.map(([_, value]) => value);
    
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const result = await query(sql, values);
    
    return { 
      success: true, 
      message: `数据删除成功`, 
      data: { 
        affectedRows: result.affectedRows 
      } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 查询数据
 * @param {string} tableName 表名
 * @param {Array} fields 查询字段，如 ['id', 'name']，默认为 ['*']
 * @param {object} condition 查询条件，如 {id: 1}
 * @returns {Promise<object>} 查询结果
 */
export async function selectData(tableName, fields = ['*'], condition = null) {
  try {
    const fieldStr = fields.join(', ');
    let sql = `SELECT ${fieldStr} FROM ${tableName}`;
    let values = [];
    
    if (condition && Object.keys(condition).length > 0) {
      const conditionEntries = Object.entries(condition);
      const whereClause = conditionEntries.map(([key, _]) => `${key} = ?`).join(' AND ');
      values = conditionEntries.map(([_, value]) => value);
      sql += ` WHERE ${whereClause}`;
    }
    
    const result = await query(sql, values);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * 执行自定义SQL查询
 * @param {string} sql SQL语句
 * @param {Array} params SQL参数
 * @returns {Promise<object>} 查询结果
 */
export async function executeQuery(sql, params = []) {
  try {
    const result = await query(sql, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export default {
  createTable,
  dropTable,
  getTableSchema,
  listTables,
  insertData,
  updateData,
  deleteData,
  selectData,
  executeQuery
}; 