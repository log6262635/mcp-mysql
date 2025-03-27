import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * 注册MCP提示模板
 * @param {McpServer} server MCP服务器实例
 */
export function registerPrompts(server) {
  // 创建表提示
  server.prompt(
    'create-table-guide',
    { 
      tableName: z.string().optional().describe('表名')
    },
    ({ tableName = 'your_table' }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `我想创建一个名为 ${tableName} 的表，请指导我如何操作。
          
以下是一些常见的MySQL列类型：
- INT: 整数类型
- VARCHAR(n): 可变长度字符串，n为最大长度
- TEXT: 文本类型，可存储大量文本
- DATETIME: 日期时间类型
- DECIMAL(p,s): 精确小数，p为总位数，s为小数位数
- BOOLEAN: 布尔类型

示例1：创建用户表
\`\`\`
create-table tableName="users" schema="id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE, age INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
\`\`\`

示例2：创建产品表
\`\`\`
create-table tableName="products" schema="id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, in_stock BOOLEAN DEFAULT TRUE"
\`\`\`

请根据您的需求使用create-table工具创建表。`
        }
      }]
    })
  );

  // 插入数据提示
  server.prompt(
    'insert-data-guide',
    { 
      tableName: z.string().describe('表名')
    },
    ({ tableName }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `我想向 ${tableName} 表中插入数据，请指导我如何操作。
          
使用insert-data工具，您需要提供表名和数据，数据需要是JSON格式的字符串。

示例：
\`\`\`
insert-data tableName="${tableName}" data="{\\"name\\": \\"张三\\", \\"email\\": \\"zhangsan@example.com\\", \\"age\\": 30}"
\`\`\`

注意：数据中的键应与表中的列名对应。请根据您的表结构修改示例。`
        }
      }]
    })
  );

  // 数据库操作概览
  server.prompt(
    'database-operations',
    {},
    () => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `以下是MySQL数据库操作的常用命令：

## 资源操作
1. 查看所有表:
   \`mysql://tables\`

2. 查看表结构:
   \`mysql://schema/{表名}\`
   
3. 查看表数据:
   \`mysql://data/{表名}\`

## 工具操作
1. 创建表:
   \`create-table tableName="表名" schema="id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255)"\`

2. 删除表:
   \`drop-table tableName="表名"\`

3. 插入数据:
   \`insert-data tableName="表名" data="{\\"name\\": \\"张三\\", \\"age\\": 30}"\`

4. 更新数据:
   \`update-data tableName="表名" data="{\\"name\\": \\"李四\\"}" condition="{\\"id\\": 1}"\`

5. 删除数据:
   \`delete-data tableName="表名" condition="{\\"id\\": 1}"\`

6. 查询数据:
   \`query-data tableName="表名" fields="[\\"id\\",\\"name\\"]" condition="{\\"age\\": 30}"\`

7. 执行自定义SQL:
   \`execute-sql sql="SELECT * FROM users WHERE age > 18" params="[]"\`

您可以根据需要使用这些操作来管理您的MySQL数据库。`
        }
      }]
    })
  );
} 