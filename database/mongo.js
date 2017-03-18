module.exports = function(config) {

  var MongoClient = require("mongodb").MongoClient;

  this.uri = "mongodb://" + config.database.host + "/" + config.database.name

  this.collection = config.database.collection

  this.connect = function(callback) {
    MongoClient.connect(this.uri, function(error, db) {
      console.log(error,db)

        return callback(error, db);
      });

      console.log("Connecté à la base de données '" + config.database.name + "'");
  }

    this.schedule = function(data) {
        this.connect(function(err,db) {
          console.log(db)
          db.collection('scheduled').insert(data, null, function (error, results) {
            if (error) throw error;

            console.log("Le document a bien été inséré")
          });
      });
    }
}
