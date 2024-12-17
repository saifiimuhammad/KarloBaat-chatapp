

import express from 'express';
import { connectDb } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createMessagesInAChat } from './seeders/chat.js';


import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';



dotenv.config({
  path: './.env',
})


const mongoURI = process.env.MONGO_URI;

const PORT = process.env.PORT || 3000;


connectDb(mongoURI);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);



app.get('/', (req, res) => {
  res.send("<h1>Hello World</h1>")
})


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})
