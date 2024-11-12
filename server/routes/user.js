
import express from 'express';
import { login, newUser } from '../controllers/user.js'

const app = express.Router();



// http://localhost:3000/user

app.get('/new', newUser)
app.post('/login', login)


export default app;
