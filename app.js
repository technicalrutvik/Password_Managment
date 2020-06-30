var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');

// var indexRouter = require('./routes/index');
// var dashboardRouter = require('./routes/dashboard');
// var addNewCatagory = require('./routes/addNewCatagory');
// var password_catagory = require('./routes/password_catagory');
// var addnewRouter=require('./routes/add-new-password');
// var viewallRouter=require('./routes/view-all-password');
// var passDetailRouter=require('./routes/password-details');

var PassCatApi=require('./api/add-category');
var ProductApi=require('./api/product');
var UserApi=require('./api/user');


// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'xFf@2QQDTYEC',resave:false,saveUninitialized:true}));

// app.use('/', indexRouter);
// app.use('/dashboard', dashboardRouter);
// app.use('/addNewCatagory', addNewCatagory);
// app.use('/password_catagory', password_catagory);
// app.use('/add-new-password', addnewRouter);
// app.use('/view-all-password', viewallRouter);
// app.use('/password-details', passDetailRouter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  next();
}); 


app.use('/api',PassCatApi);
app.use('/productApi',ProductApi);
app.use('/userApi',UserApi);

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.status(404).json({
  	error:"page not found"
  })
   res.status(500).json({
  	error:"Internal server error"
  })
});

module.exports = app;
