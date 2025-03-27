import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import dotenv from 'dotenv';

import { initDB } from './db/connection.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

// 加载环境变量
dotenv.config();

// 创建 MCP 服务器
const server = new McpServer({
  name: "MySQL数据库服务",
  version: "1.0.0",
  description: "一个用于通过Cursor与MySQL数据库交互的MCP服务"
});

// 注册资源、工具和提示
registerResources(server);
registerTools(server);
registerPrompts(server);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 用于保存会话传输的映射
const transports = {};

// SSE端点
app.get('/sse', async (_, res) => {
  // 创建SSE传输
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  
  // 关闭连接时清理
  res.on('close', () => {
    delete transports[transport.sessionId];
    console.log(`会话 ${transport.sessionId} 已关闭`);
  });
  
  // 连接MCP服务器
  await server.connect(transport);
});

// 消息处理端点
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('未找到会话');
  }
});

// 启动服务器
const startServer = async () => {
  // 初始化数据库连接
  const dbConnected = await initDB();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`MCP服务器运行在 http://localhost:${PORT}`);
      console.log('使用 GET /sse 获取SSE连接');
      console.log('使用 POST /messages?sessionId={sessionId} 发送消息');
    });
  } else {
    console.error('无法启动服务器：数据库连接失败');
    process.exit(1);
  }
};

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('未处理的Promise拒绝:', error);
});

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

// 启动服务器
startServer(); 