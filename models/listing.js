const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listschema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description:  {
      type: String
   },
   img: {
      type: String,
      default: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
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


