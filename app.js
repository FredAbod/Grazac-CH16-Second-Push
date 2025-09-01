const express = require('express');
const dotenv = require("dotenv");
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
