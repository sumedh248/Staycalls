const mongoose = require("mongoose");
const Review = require("./review.js");
const { listingschema } = require("../schema");
const Schema = mongoose.Schema;

const defaultImg = "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=60";

const listschema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },

   description: String,

   image: {
      filename: {
         type: String,
         default: "listingimage"
      },
      url: {
         type: String,
         default: defaultImg,
         set: (v) => v === "" ? defaultImg : v
      }
   },

   location: {
      type: String,
      required: true
   },

   price: Number,
   country: String,
   Review : [
         {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
         },
   ],
   owner : 
      {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User"
      },
   
});
listschema.post("findOneAndDelete", async(listing) => {
   if(listing){
      await Review.deleteMany({_id : {$in : listing.Review}} );
   }
})
module.exports = mongoose.model("Listing", listschema);




