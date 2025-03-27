#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 用于创建示例表和填充示例数据
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({
  path: path.join(__dirname, '..', '.env')
});

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

/**
 * 创建数据库和示例表
 */
async function setupDatabase() {
  const dbName = process.env.DB_NAME || 'mcp_demo';
  let connection;

  try {
    // 创建连接（不指定数据库）
    connection = await mysql.createConnection(dbConfig);
    
    // 创建数据库
    console.log(`创建数据库: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    // 使用新创建的数据库
    await connection.query(`USE ${dbName}`);
    
    // 创建示例表：用户表
    console.log('创建示例表: users');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        age INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建示例表：产品表
    console.log('创建示例表: products');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        in_stock BOOLEAN DEFAULT TRUE
      )
    `);
    
    // 插入示例数据
    console.log('插入示例数据到 users 表');
    await connection.query(`
      INSERT INTO users (name, email, age) VALUES
      ('张三', 'zhangsan@example.com', 30),
      ('李四', 'lisi@example.com', 25),
      ('王五', 'wangwu@example.com', 40)
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    
    console.log('插入示例数据到 products 表');
    await connection.query(`
      INSERT INTO products (name, price, description, in_stock) VALUES
      ('手机', 5999.99, '智能手机', TRUE),
      ('笔记本电脑', 8999.99, '轻薄本', TRUE),
      ('耳机', 899.99, '无线耳机', FALSE)
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    
    console.log('数据库设置完成！');
    
  } catch (error) {
    console.error('设置数据库出错:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行设置
setupDatabase(); 