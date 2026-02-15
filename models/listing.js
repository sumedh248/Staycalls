const mongoose = require("mongoose");

const listschema=new mongoose.Schema({
   title : {
      type : string,
      required : true
   },
   img : {
      type : string,
      default : "link",
   
   },
   location : {
      type : string,
      required : true
   }
   
});
const listing = mongoose.model("listing",listschema);
module.exports= listing;