

import express from 'express';
import userRoute from './routes/user.js';

const PORT = 3000;


const app = express();
app.use('/user', userRoute);



app.get('/', (req, res) => {
  res.send("<h1>Hello World</h1>")
})



app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})
