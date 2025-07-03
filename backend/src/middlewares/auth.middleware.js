const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('--- Auth Middleware Triggered ---'); // LOG #1
  
  // LOG #2: Cetak semua header yang diterima oleh backend
  console.log('Request Headers Received:', JSON.stringify(req.headers, null, 2)); 

  const authHeader = req.headers.authorization;
  
  // LOG #3: Cek isi dari header 'authorization'
  console.log('Authorization Header Content:', authHeader); 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Auth Error: Header tidak ada atau format salah.'); // LOG #4
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];
  
  // LOG #5: Cek isi token setelah di-split
  console.log('Token Extracted:', token);

  try {
    const decoded = jwt.verify(token, process.env.API_SECRET);
    req.userId = decoded.id; 
    console.log('Auth Success: Token valid untuk user ID:', decoded.id); // LOG #6
    next();
  } catch (error) {
    console.error('Auth Error: Token tidak valid atau kadaluarsa.', error.message); // LOG #7
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;