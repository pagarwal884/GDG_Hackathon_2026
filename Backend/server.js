import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());   
app.use(cors());


// API Endpoints
app.get('/', (req, res) => {
  res.send("API Working");
});


app.listen(port, '0.0.0.0', () => {
  console.log("Server started at: " + port);
});
