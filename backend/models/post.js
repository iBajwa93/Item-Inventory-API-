const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  //timestamps key will automatically add timestamps whenever a new postSchema object is added to the database (such as: added on, created on, etc)
  { timestamps: true }
);

//post collection will be created in mongodb and it will contain postSchema objects
module.exports = mongoose.model("Post", postSchema);
