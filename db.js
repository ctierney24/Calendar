//MongoDB connection
var MongoClient = require('mongodb').MongoClient;


function DB() {
  this.db = null;
}

DB.prototype.connect = function (url) {
  var _this = this;

  return new Promise(function(resolve, reject){
    if (_this.db) {
      //Already connected
      resolve();
    } else {
      var __this = _this;

      MongoClient.connect(url)
      .then(
        function(database){
          //store conn as part of DB object
          __this.db=database;
          //request complete, no params passed back
          console.log("DB connected");
          resolve();
        },
        function(err){
          //called if promise rejected
          //set err to error from connect method
          console.log("Error Connecting to DB: " + err.message);

          //indicate to caller that request failed
          //pass back err message
          reject(err.message);
        }
      )
    }

  })
}

DB.prototype.close = function() {

    // Close the database connection. This if the connection isn't open
    // then just ignore, if closing a connection fails then log the fact
    // but then move on. This method returns nothing – the caller can fire
    // and forget.

    if (this.db) {
        this.db.close()
        .then(
            function() {},
            function(error) {
                console.log("Failed to close the database: " + error.message)
            }
        )
    }
}

module.exports= DB;
