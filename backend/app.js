const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    //split off at the . and then pop out the file name to leave only the extension and then append it to the filename
    let extension = file.originalname.split(".").pop();
    cb(null, uuidv4() + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    //these are the accepted file types for uploading a post
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//the setHeader settings help bypass CORS errors (and any other errors), while also outlining specific permissions
// * allows api access permission to any client on any domain
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//any url request that starts with /feed will enter the feed.js file of the routes folder and can access any functions from there
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  // the || 500 means that if error.statusCode is undefined, it will automatically take the 500 code
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  //data is sent as a json response in case there is an error, so we can see info on what the error is
  res.status(status).json({ message: message, data: data });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://Username:Password@cluster0.vdxrbyb.mongodb.net/messages"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
