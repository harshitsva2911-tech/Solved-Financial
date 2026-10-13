const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    console.log('401: No token provided for', req.originalUrl);
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      console.log('401: Admin not found for ID', decoded.id, 'on', req.originalUrl);
      return res.status(401).json({ message: 'Admin not found' });
    }
    next();
  } catch (err) {
    console.log('401: Token invalid for', req.originalUrl, '-', err.message);
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = { protect };
