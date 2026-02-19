const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");




const MONGOURL = "mongodb://127.0.0.1:27017/roadguests";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});



app.get("/", (req, res) => {
   res.send("app started");
});

app.get("/testlisting",async  (req,res)=>{
   let sampletesting = new Listing({
      title : "k.mahankal",
      description : "village",
      location : "sangli",
      price : "300",
      country : "ind"
      });

      await sampletesting.save();
      res.send("data saved");
});


async function main() {
   await mongoose.connect(MONGOURL);
}
app.listen(8080, () => {
   console.log("server listening on port 8080");
});