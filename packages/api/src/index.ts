import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { patientRoutes, mappingRoutes, authRoutes } from './routes';
import errorHandler from './middleware/errorHandler';
import { metricsMiddleware } from "./middleware/metrics";
import register from "./metrics";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(metricsMiddleware);

const DB_HOST = process.env.DB_HOST || '';
mongoose
  .connect(DB_HOST)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/patients', patientRoutes);
app.use("/api/mappings", mappingRoutes);

// Metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
