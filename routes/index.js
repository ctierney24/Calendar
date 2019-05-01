var express = require('express');
var router = express.Router();
var DB = require('../public/javascripts/db.js');
var myDate = require('../public/javascripts/myDate.js');
const urlM = "mongodb+srv://dev1:pwrd123@cluster1-sp57y.mongodb.net/test?retryWrites=true"
const dbName = 'Calendar';
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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

  //query events to check for
  var mClient = new DB;

  mClient.connect(urlM)
  .then(
    async function(){

      var dbCal=mClient.client.db(dbName);
      var query= {month:selMonth, year:selYear};
      console.log(query);
      var monthEvents = await dbCal.collection('events').find(query).toArray();

      var week=0;
      while (day.getMonth() == selMonth){
        var thisDay = new myDate(day);

        //If day matches event set details to event details
        for(var i=0; i<monthEvents.length; i++){
          var doc=monthEvents[i];
          if (doc.day==thisDay.date.getDate()){
             thisDay.setEvent(doc.name, doc.details);
          }
        }

        //add date to month array
        days[week][day.getDay()]=thisDay;

        if (day.getDay() == 6){
          week=week+1;
        }
        day.setDate(day.getDate() + 1);


    }

      mClient.close();
      //console.log(days);
      //render index.js passing array of days
      res.render('index', {month:monthNames[selMonth], year:selYear, days: days});

      },
      function(err){
        console.log('Failed to connect to DB: '+ err);
        console.log(dbCal);
        mClient.close();
      }
  );
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

router.get('/getAll', function(req, res){
  var mClient= new DB;

  mClient.connect(urlM)
  .then(
      function(){

        var dbCal=mClient.client.db(dbName);
        var allEvents = dbCal.collection('events').find({}).forEach(function(doc){
          console.log(doc);
        });
        mClient.close();
        res.render('index');
    },
    function(err){
      console.log('Failed to connect to DB: '+ err);
      console.log(dbCal);
      mClient.close();
    }
  );
})



router.post('/createEvent', function(req, res){
  var mClient = new DB;
  var name = req.body.eventName,
      details=req.body.eventDetails;
      day = req.body.dayList,
      month = req.body.monthList,
      year = req.body.yearList;


  mClient.connect(urlM)
  .then(
      function(){
      var dbCal=mClient.client.db(dbName);

      dbCal.collection('events').insertOne({name: name, details: details, day: day, month:month, year:year});
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
        res.render('index', {title: 'jsCalendar w/ Express', days: days, month:monthNames[month], year:year});
      }else{
        res.render('index', {title: 'Added Event', month:monthNames[month], year:year});
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
