var createError = require('http-errors');
var express = require('express');
var app = express();
const router = express.Router();
var path = require('path');
var session = require('express-session');
var flash = require('express-flash');
const FileStore = require('session-file-store')(session);
var handlebars = require('express-handlebars')
var cookieParser = require('cookie-parser');
var mysqlpool = require('./dbconfig');
///
var logger = require('morgan');
var mysql = require('mysql'); 
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.use(session({
    key: 'test',
    secret: 'test',
    resave: false,
    saveUninitialized: false
}));

///Routes
var indexRouter = require('./routes/index');
var LoginRouter = require('./routes/login');
var reportsRouter = require('./routes/reports');
var chartsRouter= require('./routes/charts');
var mapsRouter= require('./routes/maps');
var predRouter=require('./routes/prediction');

///: create coockie

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set("view engine",'ejs');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', LoginRouter);
app.use('/reports', reportsRouter);
app.use('/create', indexRouter);
app.use('/', indexRouter);
app.use('/charts',chartsRouter);
app.use('/maps',mapsRouter);
app.use('/prediction',predRouter);

app.use('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

//


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports =app;
