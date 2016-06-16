module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var schemas = {
    user: new Schema({
      login: { type: String, required: true },
      password: { type: String, required: true }
    })
  }

  var models = {
    user: mongoose.model('user', schemas.user)
  }

  return models;
}
