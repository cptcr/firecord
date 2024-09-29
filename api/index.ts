import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// Example route
app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
