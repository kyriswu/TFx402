import express, { json } from 'express';

import { getProductById, getProductsBySellerId, getProductsByStatus, getRandomProduct, addProduct, updateProduct, deleteProduct } from './db/db_products.js';

const app = express();
const PORT = 4000;

// 中间件示例：解析 JSON，增加请求体大小限制
app.use(json({ limit: '50mb' }));

// CORS 中间件：允许跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}); 

// 路由
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.post('/addProduct', async (req, res) => {
    const { seller_id, title, img, product_desc, price, ticket_price, number_digits, deadline } = req.body;
    if (!seller_id || !title || !img || !product_desc || !price || !ticket_price || !number_digits || !deadline) {
        return res.status(400).json({ code: -1, msg: 'Missing required fields: seller_id, title, img, product_desc, price, ticket_price, number_digits, deadline' });
    }
    try {
        const productId = await addProduct(req.body);
        res.status(201).json({ id: productId, message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});