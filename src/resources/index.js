import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import dbOps from '../db/operations.js';

/**
 * 注册MCP资源
 * @param {McpServer} server MCP服务器实例
 */
export function registerResources(server) {
  // 列出所有表
  server.resource(
    'tables',
    'mysql://tables',
    async (uri) => {
      const result = await dbOps.listTables();
      if (!result.success) {
        return {
          contents: [{
            uri: uri.href,
            text: `错误: ${result.message}`
          }]
        };
      }

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(result.data, null, 2)
        }]
      };
    }
  );

  // 获取表结构
  server.resource(
    'schema',
    new ResourceTemplate('mysql://schema/{tableName}', { list: undefined }),
    async (uri, { tableName }) => {
      const result = await dbOps.getTableSchema(tableName);
      if (!result.success) {
        return {
          contents: [{
            uri: uri.href,
            text: `错误: ${result.message}`
          }]
        };
      }

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(result.data, null, 2)
        }]
      };
    }
  );

  // 查询表数据
  server.resource(
    'table-data',
    new ResourceTemplate('mysql://data/{tableName}', { list: undefined }),
    async (uri, { tableName }) => {
      const result = await dbOps.selectData(tableName);
      if (!result.success) {
        return {
          contents: [{
            uri: uri.href,
            text: `错误: ${result.message}`
          }]
        };
      }

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(result.data, null, 2)
        }]
      };
    }
  );
} 