const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);   
app.use(express.static(path.join(__dirname,"/public")));


const MONGOURL = "mongodb://127.0.0.1:27017/roadguests";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});
async function main() {
   await mongoose.connect(MONGOURL);
}



app.get("/", (req, res) => {
   res.send("app started");
});
app.get("/listing", async (req,res)=>{
   const allListings = await Listing.find({});
   
   res.render("listing/index.ejs",{allListings});
});
app.get("/listing/new", (req,res)=>{
   res.render("listing/new.ejs");
});
app.get("/listing/:id", async (req,res)=>{
   const {id} = req.params;
   const listingdata = await Listing.findById(id);
   res.render("listing/show.ejs",{listingdata});
});
app.post("/listing", async (req,res)=>{
   const ins = new Listing(req.body.listing);
   await ins.save();
   res.redirect("/listing");
});
app.get("/listing/:id/edit", async (req,res)=>{
   const {id}=req.params;
   const listing1 = await Listing.findById(id);
   res.render("listing/edit.ejs",{listing1});
});
app.put("/listing/:id",async (req,res)=>{
   const {id} = req.params;
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listing/${id}`);
});
app.get("/listing/:id/delete", async (req,res)=>{
   const {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect(`/listing`);
});



app.listen(8080, () => {
   console.log("server listening on port 8080");
});