module.exports = function() {
  var operations = {
    insertData: function(object, callback) {
      object.save(function (err, object) {
        if (err) return console.error(err);
        console.log('Inserted');
        if(typeof callback != 'undefined')
          callback();
      });
    },
    selectData: function(model, query, callback) {
      var object = query;
      model.find(object, function(err, result) {
        var result_object = {}
        if (err) result_object.data = err;
        else result_object.data = result;

        if(typeof callback != 'undefined')
          callback(result_object);
      });
    },
    deleteAllData: function(model, callback) {
      model.remove(function(err, data) {
        if (err) return console.error(err);
        console.log('Deleted');

        if(typeof callback != 'undefined')
          callback();
      });
    }
  }
  return operations;
}
