/* This handles the database connection , and route incoming requests to relevant controllers */

const express = require('express');
const bodyParser = require("body-parser");
const db = require("./helpers/db-config");
const PORT = process.env.PORT || 3001;

var createError = require('http-errors');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



/* Install Express */
const app = express();

/* parses json data sent to us by the user */
app.use(bodyParser.json());
app.use(cors());

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* routing incoming requests to the controller */
let schoolRouter = require('./routes/school-controller');
app.use('/schools', schoolRouter);

/* setting up db connection */
db.connect((err)=>{
  if(err){
    console.log('unable to connect to database',err);
    process.exit(1);
  }
  else{
    app.listen(PORT, () =>
        console.log(`connected to database, Listening on ${ PORT }`)
    );
  }
});

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  next(createError(404));
});

/* error handler */
app.use(function(err, req, res, next) {
  /* set locals, only providing error in development*/
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
