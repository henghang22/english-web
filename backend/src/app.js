const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Import Routes
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const aiRoutes = require('./routes/ai.routes');
const progressRoutes = require('./routes/progress.routes');
const path = require('path');
const teacherRoutes = require('./routes/teacher.routes');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Middlewares
app.use(cors()); // Allow all origins in development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Morgan to use Winston for logging
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }
  )
);

// Serve Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/teacher', teacherRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/progress', progressRoutes);

// Đăng ký route upload để xử lý tải file/ảnh lên hệ thống
app.use('/api/v1/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to English Learning API',
    version: '1.0.0'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the error
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    trace_id: req.id || 'system'
  });
});


module.exports = app;
