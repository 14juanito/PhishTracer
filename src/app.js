const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'phishtracer_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // 10 minutes
}));

const scanRoutes = require('./routes/scan');
app.use(scanRoutes);

module.exports = app;
