var express = require('express');
var router = express.Router();
var DB = require('../db.js');
const urlM = "mongodb+srv://dev1:pwrd123@cluster1-sp57y.mongodb.net/test?retryWrites=true"
const dbName = 'Calendar';


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'jsCalendar w/ Express' });
});

//Load the calendar based on the current day
router.get('/loadCal', function(req, res){
  let today = new Date();
  let curMonth = today.getMonth();
  let curYear = today.getYear();
  let selMonth = req.param('monthList');
  let selYear = req.param('yearList');

  console.log('month='+selMonth+' year='+selYear);

  //build array of calendar days for selected month
  var day= new Date(selYear, selMonth, 1);
  var days = {};
  //initialize array to blank
  for(let i=0; i<=5; i++){
    days[i]=[];
  };
  var week=0;
  while (day.getMonth() == selMonth){
    days[week][day.getDay()] = new Date(day);

    if (day.getDay() == 6){
      week=week+1;
    }
    day.setDate(day.getDate() + 1);

  }
  //console.log(days);
  //render index.js passing array of days
  console.log('Render Response');
  res.render('index', {title: 'jsCalendar w/ Express', days: days});

});

router.get('/connDB', function(req, res){
  var dbTest = new DB;

  dbTest.connect(urlM);


  dbTest.close();
});

//redirect to event creation
router.get('/eventRedir', function(req, res){
  res.render('event');
  res.end();
  })




router.post('/createEvent', function(req, res){
  var mClient = new DB;
  var name = req.param.eventName,
      day = req.param.dayList,
      month = req.param.monthList,
      year = req.param.yearList;


  mClient.connect(urlM)
  .then(
      function(){
      var dbCal=mClient.client.db(dbName);

      dbCal.collection('events').insertOne({name: name, day: day, month:month, year:year});
      console.log("Inserted Event");
    },
    function(err){
      console.log('Failed to connect to DB: '+ err);
      console.log(dbCal);
    }
  )
  //confirm successful write and render page with Events
  .then(
    function(){
      mClient.close();
      if ((typeof days) !== 'undefined'){
        res.render('index', {title: 'jsCalendar w/ Express', days: days});
      }else{
        res.render('index', {title: 'Added Event'});
      }
      res.end();
    }
    ,function(err){
      console.log("Failed to write record: " + err);
      mClient.close();

    }
  );


});


module.exports = router;
