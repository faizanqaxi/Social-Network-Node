// App root file (Starting point)

//External imports
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

//Internal imports
const config = require('../config/config');
const indexRouter = require('./api/routes/indexRouter');
const authRouter = require('./api/routes/authRouter');
const userRouter = require('./api/routes/userRouter');
const { requireAuth, checkUser } = require('./api/middlewares/authMiddleware');

// Initializing Express App
const app = express();

// Connecting to mongoDb Database and starting the server
const dbURI = config.mongoDbURI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('Connected to the mongoDb Database.. ');
    app.listen(config.serverPort);
    console.log('Listening to port ', config.serverPort);
  })
  .catch((err) => console.log(err));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routing
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', requireAuth, userRouter);

// Error Handling

// Catch 404 and forward to error handler - if all above routes fail
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

// Exporting the server app
module.exports = app;