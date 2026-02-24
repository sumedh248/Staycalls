const mongoose = require("mongoose");
const initDB = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOURL = "mongodb://127.0.0.1:27017/roadguests";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});
async function main() {
   await mongoose.connect(MONGOURL);
}

const init = async () =>{
   await Listing.deleteMany({});
   await Listing.insertMany(initDB.data);
   console.log("data inserted");
}

init();