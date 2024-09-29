import express from 'express';
import path from 'path';

const app = express();
const port = process.env.WEBSITE_PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to my website!' });
});

app.listen(port, () => {
  console.log(`Website running on port ${port}`);
});
