import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    // 从请求头获取 token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 格式: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ code: -1, message: 'Access token required' });
    }

    try {
        // 验证 token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 将用户信息挂载到 req 对象上，供后续路由使用
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            platform: decoded.platform
        };
        
        next(); // 验证通过，继续执行
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ code: -1, message: 'Token expired' });
        }
        return res.status(403).json({ code: -1, message: 'Invalid token' });
    }
}