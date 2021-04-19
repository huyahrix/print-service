const express = require("express"),
  httpError = require('http-errors'),
  path = require("path"),
  favicon = require('serve-favicon'),
  logger = require("morgan"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  compress = require('compression'),
  routes = require("./routes"),
  cors = require('cors'),
  helmet = require('helmet'),
  app = express();

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'print.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compress());
app.use(express.static(path.join(__dirname, "public")));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());


app.use(function (req, res, next) {
  res.ok = (data) => {
      const d = data && typeof data.data !== 'undefined' ? data : {data: data};
      return res.json(Object.assign({code: 200, message: ''}, d));
  };
  res.badRequest = (data) => {
      if (data instanceof Error) {
          return res.json(Object.assign({ code: data.code || 'ERROR', message: data.message || '' }, { data: null }));
      }
      return res.json(Object.assign({ code: 'ERROR', message: '' }, data, { data: null }));
  };
  next();
});

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return next(new httpError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
