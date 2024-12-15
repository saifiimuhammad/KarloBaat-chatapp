
import express from 'express';
import { login, newUser, getMyProfile, logout, searchUser } from '../controllers/user.js'
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';

const app = express.Router();



// http://localhost:3000/user

app.post('/new', singleAvatar, newUser)
app.post('/login', login)


// User must be login to access below routes
app.use(isAuthenticated);

app.get('/me', getMyProfile)
app.get('/logout', logout)
app.get('/search', searchUser)


export default app;
