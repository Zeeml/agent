module.exports = function(config) {

  var MongoClient = require("mongodb").MongoClient;

  this.uri = "mongodb://" + config.database.host + "/" + config.database.name

  this.collection = config.database.collection

  this.connect = function() {
    MongoClient.connect(this.uri, function(error, db) {
      //  if (error) return funcCallback(error);
      });

      console.log("Connecté à la base de données '" + config.database.name + "'");
  }

    this.add = function(data) {
        this.connect(function(err,db) {
          db.collection(this.collection).insert(data, null, function (error, results) {
            if (error) throw error;

            console.log("Le document a bien été inséré");
          });
      });
    }
}
