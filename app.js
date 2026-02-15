const express = require("express");
const app = express();
const mongoose = require("mongoose");


const MONGOURL = "mongodb://127.0.0.1:27017/airbnb";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});



app.get("/", (req, res) => {
   res.send("app started");
});


async function main() {
   await mongoose.connect(MONGOURL);
}
app.listen(8080, () => {
   console.log("server listening on port 8080");
});