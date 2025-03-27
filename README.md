# MySQL数据库MCP服务

这是一个基于MCP（Model Context Protocol）的服务，允许通过Cursor与MySQL数据库进行交互，实现表的创建、查询、修改和删除等操作。

## 功能特点

- 创建和管理数据库表
- 执行CRUD操作（创建、读取、更新、删除）
- 执行自定义SQL查询
- 通过MCP协议与Cursor集成

## 安装和设置

### 前提条件

- Node.js 18.0.0 或更高版本
- MySQL 数据库服务器

### 安装步骤

1. 克隆或下载本仓库
2. 安装依赖：

```bash
npm install
```

3. 配置环境变量：
   - 复制 `.env.example` 文件为 `.env`
   - 编辑 `.env` 文件，填入您的MySQL数据库连接信息

```
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=您的数据库用户名
DB_PASSWORD=您的数据库密码
DB_NAME=您的数据库名称

# 服务器配置
PORT=3001
```

### 启动服务

```bash
npm start
```

服务器将在 http://localhost:3001 启动（或您在 `.env` 中指定的端口）。

## 在Cursor中使用

1. 在Cursor中，使用以下方法添加MCP服务：
   - 方法1: 在命令面板中搜索 "MCP" 并选择添加服务
   - 方法2: 在设置中找到 MCP 相关配置
   - 方法3: 直接使用命令 `/connect-mcp http://localhost:3001/sse`

2. 连接成功后，您可以通过资源和工具与MySQL数据库进行交互

## 可用功能

### 资源

1. 列出所有表：
   ```
   mysql://tables
   ```

2. 查看表结构：
   ```
   mysql://schema/表名
   ```

3. 查看表数据：
   ```
   mysql://data/表名
   ```

### 工具

1. 创建表：
   ```
   create-table tableName="表名" schema="id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255)"
   ```

2. 删除表：
   ```
   drop-table tableName="表名"
   ```

3. 插入数据：
   ```
   insert-data tableName="表名" data="{\"name\": \"张三\", \"age\": 30}"
   ```

4. 更新数据：
   ```
   update-data tableName="表名" data="{\"name\": \"李四\"}" condition="{\"id\": 1}"
   ```

5. 删除数据：
   ```
   delete-data tableName="表名" condition="{\"id\": 1}"
   ```

6. 查询数据：
   ```
   query-data tableName="表名" fields="[\"id\",\"name\"]" condition="{\"age\": 30}"
   ```

7. 执行自定义SQL：
   ```
   execute-sql sql="SELECT * FROM users WHERE age > 18" params="[]"
   ```

### 提示模板

1. 创建表指南：
   ```
   create-table-guide tableName="表名"
   ```

2. 插入数据指南：
   ```
   insert-data-guide tableName="表名"
   ```

3. 数据库操作概览：
   ```
   database-operations
   ```

## 示例场景

### 创建用户表并添加数据

1. 创建用户表：
   ```
   create-table tableName="users" schema="id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE, age INT"
   ```

2. 插入用户数据：
   ```
   insert-data tableName="users" data="{\"name\": \"张三\", \"email\": \"zhangsan@example.com\", \"age\": 30}"
   ```

3. 查询用户数据：
   ```
   mysql://data/users
   ```

## 项目架构

```
mcp-db-service/
├── src/
│   ├── db/              # 数据库连接和操作
│   ├── resources/       # MCP资源处理
│   ├── tools/           # MCP工具处理
│   ├── prompts/         # MCP提示模板
│   └── index.js         # 主程序入口
├── .env                 # 环境变量配置
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 安全注意事项

- 此服务未实现身份验证和授权机制，请勿在生产环境中使用
- 建议设置MySQL用户的权限，只允许必要的操作
- 不要在代码或环境变量中存储敏感的数据库凭据

## 许可证

MIT 