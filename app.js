require("babel-core/register")({
  "presets": ["es2015"]
});
require('babel-polyfill');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var mongoose = require('mongoose');
// the port might change
mongoose.connect('localhost:27017/airdb');

var routes = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var filesEndpoint = require('./routes/files');
var oauth = require('./routes/oauth');
var oauth2 = require('./controllers/oauth2.controller');
var auth = require('./controllers/auth.controller');

// It instantiates Express and assigns our app variable to it.
// The next section uses this variable to configure a bunch of Express stuff.
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: 'testKey',
  saveUninitialized: true,
  resave: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '4mb'}));
app.use(bodyParser.urlencoded({ limit: '4mb',extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// allow requests from frontend
app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://airweb");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(passport.initialize());

app.use('/', routes);
app.use('/api/oauth', oauth);
app.use('/api/users', users);
app.use('/messages', messages);
app.use('/files', filesEndpoint);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
