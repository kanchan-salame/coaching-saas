require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
// Support a comma-separated list in CLIENT_ORIGIN or '*' to allow all origins in dev
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5001';
if (clientOrigin === '*') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  const allowedOrigins = clientOrigin.split(',').map((s) => s.trim());
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow non-browser tools (like curl/postman) that don't send origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
}
app.use(express.json());

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/saas_auth');

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
