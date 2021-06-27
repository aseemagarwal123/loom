/* eslint-disable linebreak-style */
const express = require('express');
const morganBody = require('morgan-body');
const logger = require('./logger');
const createError = require('http-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const appRoutes = require('./routes');
const app = express();

// createdAt:{$lte:Date("2021-01-31")}

app.use(cors());
app.use(cookieParser());
morganBody(app, {
  stream: logger.stream,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', async (req, res)=>{
  res.status(200).json({text: 'service up'});
});
// app.use(modifyResponseBody);
app.use('/', appRoutes);

// 404 error handler
app.use((req, res, next) => {
  next(createError(404));
});
// Main error handler for express app. All errors passed to next() are caught here.
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  return res.status(err.status || 500).send({message: err.message});
});

module.exports = app;
