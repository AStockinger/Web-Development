// http://flip1.engr.oregonstate.edu:9743/

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "classmysql.engr.oregonstate.edu",
  user: "cs290_stockina",
  password: "5350",
  database: "cs290_stockina"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9743);

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

// Create
app.get('/insert',function(req,res,next){
  var context = {}
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
  [req.query.name, 
  req.query.reps,
  req.query.weight,
  req.query.date,
  req.query.lbs], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    context.inserted = result.insertId;
    pool.query("SELECT * FROM `workouts` WHERE id=" + [result.insertId], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(JSON.stringify(result[0]));
    });
  });
});

// Read
app.get('/',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM `workouts` ORDER BY date DESC", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var params = [];                              
    for(var row in rows){
        var item = {
          'name': rows[row].name, 
          'reps': rows[row].reps, 
          'weight': rows[row].weight, 
          'date': rows[row].date,
          'id':rows[row].id};
        if(rows[row].lbs){
            item.lbs = "lb";
        }
        else{
            item.lbs = "kg";
        }
        var format = new Date(item.date);
        item.date = [('0' + (format.getMonth() + 1)).slice(-2),('0' + format.getDate()).slice(-2),format.getFullYear()].join("-");
        params.push(item);           
    }
    
    context.results = JSON.stringify(rows);
    context.data = params;
    res.render('home', context);
  });
});

app.get('/updateTable', function(req, res){
  var context = {};
  pool.query("SELECT * FROM `workouts` WHERE id=?", 
  [req.query.id], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    context.id = result[0].id;
    context.name = result[0].name;
    context.weight = result[0].weight;
    context.reps = result[0].reps;
    context.date = formatDate(result[0].date);
    context.lbs = result[0].lbs;
    res.render('updateTable', context);
  });
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

// Update
app.get('/update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM `workouts` WHERE id=?", 
  [req.query.id], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
        [req.query.name || curVals.name, 
        req.query.reps || curVals.reps,
        req.query.weight || curVals.weight,
        req.query.date || curVals.date, 
        req.query.lbs || curVals.lbs, 
        req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        pool.query("SELECT * FROM `workouts` ORDER BY date DESC", function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          var params = [];                              
          for(var row in rows){
              var item = {
                'name': rows[row].name, 
                'reps': rows[row].reps, 
                'weight': rows[row].weight, 
                'date': rows[row].date,
                'id':rows[row].id};
              if(rows[row].lbs){
                  item.lbs = "lb";
              }
              else{
                  item.lbs = "kg";
              }
              var format = new Date(item.date);
              item.date = [('0' + (format.getMonth() + 1)).slice(-2),('0' + format.getDate()).slice(-2),format.getFullYear()].join("-");
              params.push(item);           
          }
          
          context.results = JSON.stringify(rows);
          context.data = params;
          res.render('home', context);
        });
      });
    }
  });
});

// Delete
app.post('/delete', function(req,res,next){
    var context = {};
    pool.query("DELETE FROM `workouts` WHERE id=?",
    [req.body.id],
    function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Deleted " + result.changedRows + " rows.";
        res.render('home',context);
    })
});

app.post('/', function(req, res){
  res.render('home');
})

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

//Start Server
app.listen(app.get('port'), function(){
    console.log('Express started on localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});