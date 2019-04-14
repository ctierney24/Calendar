var express = require('express');
var router = express.Router();

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



module.exports = router;
