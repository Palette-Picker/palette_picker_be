import express from 'express';
import cors from 'cors';
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors())
app.use(express.json());

app.locals.title = 'Palette Picker';

app.get('/', (req, res) => {
  res.send('Welcome to Palette Picker!');
});