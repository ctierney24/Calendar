//wrapper to add functionality to js Date object

function myDate(day){
  this.date = new Date (day);
  this.eventName= '     ';
  this.eventDetails=null;
}

//take event record from db and set properties of myDate
myDate.prototype.setEvent = function(eventName, details) {
  this.eventName = eventName;
  this.eventDetails = details;

}

//debug print event eventDetails
myDate.prototype.getEvent = function(){
  return this.eventName;
}

myDate.prototype.getDeets = function(){
  return this.eventDetails;
}

module.exports= myDate;
