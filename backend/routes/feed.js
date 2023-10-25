const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//this get request is where we serve our posts
// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    //validation approval for title and content requires a minimum of 2 characters length,
    //character length specification (such as min: 2) needs to be the same on both server and client side validation, otherwise there will be validation errors
    body("title").trim().isLength({ min: 2 }),
    body("content").trim().isLength({ min: 2 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

//put allows us to add data and overwrite previous data (perfect for editing)

router.put(
  "/post/:postId",
  isAuth,
  [
    //image validation is not needed since it's done directly in the controller file, feed.js
    body("title").trim().isLength({ min: 2 }),
    body("content").trim().isLength({ min: 2 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
