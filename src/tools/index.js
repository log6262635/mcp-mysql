import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import dbOps from '../db/operations.js';

/**
 * 注册MCP工具
 * @param {McpServer} server MCP服务器实例
 */
export function registerTools(server) {
  // 创建表
  server.tool(
    'create-table',
    {
      tableName: z.string().min(1).describe('表名'),
      schema: z.string().min(1).describe('表结构，例如 "id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255)"')
    },
    async ({ tableName, schema }) => {
      const result = await dbOps.createTable(tableName, schema);
      return {
        content: [{
          type: 'text',
          text: result.success 
            ? `表 ${tableName} 创建成功` 
            : `创建表失败: ${result.message}`
        }],
        isError: !result.success
      };
    }
  );

  // 删除表
  server.tool(
    'drop-table',
    {
      tableName: z.string().min(1).describe('表名')
    },
    async ({ tableName }) => {
      const result = await dbOps.dropTable(tableName);
      return {
        content: [{
          type: 'text',
          text: result.success 
            ? `表 ${tableName} 删除成功` 
            : `删除表失败: ${result.message}`
        }],
        isError: !result.success
      };
    }
  );

  // 插入数据
  server.tool(
    'insert-data',
    {
      tableName: z.string().min(1).describe('表名'),
      data: z.string().min(1).describe('JSON格式的数据，例如 {"name": "John", "age": 30}')
    },
    async ({ tableName, data }) => {
      try {
        const parsedData = JSON.parse(data);
        const result = await dbOps.insertData(tableName, parsedData);
        return {
          content: [{
            type: 'text',
            text: result.success 
              ? `数据插入成功，ID: ${result.data?.insertId}，影响行数: ${result.data?.affectedRows}` 
              : `插入数据失败: ${result.message}`
          }],
          isError: !result.success
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `解析数据失败: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // 更新数据
  server.tool(
    'update-data',
    {
      tableName: z.string().min(1).describe('表名'),
      data: z.string().min(1).describe('JSON格式的更新数据，例如 {"name": "John", "age": 30}'),
      condition: z.string().min(1).describe('JSON格式的更新条件，例如 {"id": 1}')
    },
    async ({ tableName, data, condition }) => {
      try {
        const parsedData = JSON.parse(data);
        const parsedCondition = JSON.parse(condition);
        const result = await dbOps.updateData(tableName, parsedData, parsedCondition);
        return {
          content: [{
            type: 'text',
            text: result.success 
              ? `数据更新成功，影响行数: ${result.data?.affectedRows}` 
              : `更新数据失败: ${result.message}`
          }],
          isError: !result.success
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `解析数据失败: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // 删除数据
  server.tool(
    'delete-data',
    {
      tableName: z.string().min(1).describe('表名'),
      condition: z.string().min(1).describe('JSON格式的删除条件，例如 {"id": 1}')
    },
    async ({ tableName, condition }) => {
      try {
        const parsedCondition = JSON.parse(condition);
        const result = await dbOps.deleteData(tableName, parsedCondition);
        return {
          content: [{
            type: 'text',
            text: result.success 
              ? `数据删除成功，影响行数: ${result.data?.affectedRows}` 
              : `删除数据失败: ${result.message}`
          }],
          isError: !result.success
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `解析数据失败: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // 查询数据
  server.tool(
    'query-data',
    {
      tableName: z.string().min(1).describe('表名'),
      fields: z.string().optional().describe('查询字段，JSON数组格式，例如 ["id", "name"]，默认为 ["*"]'),
      condition: z.string().optional().describe('JSON格式的查询条件，例如 {"id": 1}')
    },
    async ({ tableName, fields, condition }) => {
      try {
        const parsedFields = fields ? JSON.parse(fields) : ['*'];
        const parsedCondition = condition ? JSON.parse(condition) : null;
        const result = await dbOps.selectData(tableName, parsedFields, parsedCondition);
        return {
          content: [{
            type: 'text',
            text: result.success 
              ? JSON.stringify(result.data, null, 2) 
              : `查询数据失败: ${result.message}`
          }],
          isError: !result.success
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `解析参数失败: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // 执行自定义SQL
  server.tool(
    'execute-sql',
    {
      sql: z.string().min(1).describe('SQL语句'),
      params: z.string().optional().describe('SQL参数，JSON数组格式，例如 ["param1", 2]')
    },
    async ({ sql, params }) => {
      try {
        const parsedParams = params ? JSON.parse(params) : [];
        const result = await dbOps.executeQuery(sql, parsedParams);
        return {
          content: [{
            type: 'text',
            text: result.success 
              ? JSON.stringify(result.data, null, 2) 
              : `执行SQL失败: ${result.message}`
          }],
          isError: !result.success
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `解析参数失败: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
} 