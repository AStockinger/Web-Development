/*
Amy Stockinger
URL: http://flip1.engr.oregonstate.edu:9834/getpost
*/

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9834);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getpost', function(req, res){
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]});
  }
  var context = {};
  context.dataList = qParams;
  context.reqType = "GET";
  res.render('getpost', context);
});

app.post('/getpost', function(req, res){
  var qParams = [];
  for (var p in req.body){
    qParams.push({'name':p,'value':req.body[p]})
  }
  console.log(qParams);
  console.log(req.body);
  var context = {};
  context.dataList = qParams;
  context.reqType = "POST";
  res.render('getpost', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});