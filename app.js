const dotenv = require('dotenv').config();
const cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
const bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
let mongoose = require("mongoose");
var expressLayouts = require('express-ejs-layouts');
var flush = require('connect-flash');
const swal = require('sweetalert');

// const adminpaths = [
//   { pathUrl: '/', routeFile: 'login'},
//   { pathUrl: '/dashboard', routeFile: 'dashboard'},
//   { pathUrl: '/apps', routeFile: 'apps'}
// ];
const backpaths = [
  {pathUrl: "/", routeFile: 'login'},
  {pathUrl: "/dashboard", routeFile: 'dashboard'},
  {pathUrl: "/contactus", routeFile: 'contactus'},
  {pathUrl: "/quote", routeFile: 'quote'},
  {pathUrl: "/offer", routeFile: 'offer'},
  {pathUrl: "/service", routeFile: 'service'},
  {pathUrl: "/create", routeFile: 'create'},
  {pathUrl: "/edit", routeFile: 'edit'},
  {pathUrl: "/remove", routeFile: 'remove'},
]
var app = express();
const oneDay = 1000 * 60 * 60 * 24;
app.use(cors());
app.use(
    session({
        cookie: { sameSite: "lax", maxAge: oneDay },
        resave: true,
        secret: process.env.AUTH_KEY,
        activeDuration: 5 * 60 * 1000,
        saveUninitialized: true
    })
);
// app.use((res, req, next) =>{
//     res.locals.message == req.session.message;
//     delete req.session.message;
//     next();
// })
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(flush());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'back/layouts/layout');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/angular", express.static(__dirname + "/node_modules/angular"));
mongoose.set('runValidators', true);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log("Well done! , connected with mongoDB database");
}).on('error', error => {
  console.log("Oops! database connection error:" + error);
});
// adminpaths.forEach((path) => {
// 	app.use(path.pathUrl, require('./routes/admin/' + path.routeFile));
// });
backpaths.forEach((path) => {
	app.use(path.pathUrl, require('./routes/back/' + path.routeFile));
});
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {layout: false});
});
module.exports = app;
