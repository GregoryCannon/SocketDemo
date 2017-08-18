var express = require('express');
var app = express();
var webpackConfig = require('../webpack.config');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var socketConfig = require('./socket');

app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(express.static('../public'));

app.set('view engine', 'ejs');
app.set('views', "public")
app.get('*', function(req, res, next) {
  res.render('index');
})
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
});

const port = process.env.PORT || 3000;
const server = app.listen(port);
socketConfig(server);

console.log('Server is running on ' + port);
