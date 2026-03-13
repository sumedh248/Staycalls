const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new Schema({
   email : {
      type : String
   }
});

userschema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User", userschema);