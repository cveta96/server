import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB, corsOptions } from './config';
import { verifyJWT } from './middleware/verifyJWT';

import authRoute from './routes/auth';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

//Public routes
app.use('/api/auth', authRoute);
app.get('/', (req, res) => {
  res.json({ asd: 'Hello World!' });
});

//Private routes
app.use(verifyJWT);
app.get('/home', (req, res) => {
  res.json(req.username);
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
