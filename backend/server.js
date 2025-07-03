require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const db = require('./src/models');

const app = express();
const PORT = process.env.PORT || 5000;

// [SOLUSI] Konfigurasi CORS yang lebih spesifik
const allowedOrigins = [
    'http://localhost:5173', // Untuk development di laptop
    /https?:\/\/.*\.ngrok-free\.app/ // Regex untuk mengizinkan semua subdomain ngrok
];

const corsOptions = {
    origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti dari Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

// Gunakan konfigurasi CORS yang sudah kita buat
app.use(cors(corsOptions));

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import dan Gunakan Rute (tetap sama)
const userRoutes = require('./src/routes/user.routes');
const guestRoutes = require('./src/routes/guest.routes');
const checkinRoutes = require('./src/routes/checkin.routes');
const publicRoutes = require('./src/routes/public.routes');

app.get('/', (req, res) => {
  res.send('QR Event API Server is healthy!');
});

app.use('/api/users', userRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/public', publicRoutes);

// Server Start (tetap sama)
const startServer = async () => {
  await connectDB();
  await db.sync();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();