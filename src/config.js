import dotenv from 'dotenv';
import { connect } from 'mongoose';
dotenv.config();

//Mongo DB settings
const mongoDB = process.env.MONGO_DB;
const connectDB = async () => {
  try {
    await connect(mongoDB);
    console.log('Mongo DB connected.');
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unexpected error', error);
    }
  }
};

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

export { connectDB, corsOptions };
