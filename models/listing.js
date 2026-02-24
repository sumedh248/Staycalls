const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listschema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String
   },
   img: {
      type: String,
      default: "https://unsplash.com/photos/kodak-store-with-vintage-photographs-displayed-fBaXoc045xs",
      set: (v) => v === "" ? "https://unsplash.com/photos/kodak-store-with-vintage-photographs-displayed-fBaXoc045xs" : v,
   },
   location: {
      type: String,
      required: true
   },
   price: String,
   country: String

});
const Listing = mongoose.model("Listing", listschema);
module.exports = Listing;

// app.get("/testlisting",async  (req,res)=>{
//    let sampletesting = new Listing({
//       title : "k.mahankal",
//       description : "village",
//       location : "sangli",
//       price : "300",
//       country : "ind"
//       });

//       await sampletesting.save();
//       res.send("data saved");
// });


