const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validator
const validatePostInput = require("../../validation/post");

// @route   GET api/posts
// @desc    Get Post
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ no_posts_found: "Nothing Founds." }));
});

// @route   GET api/posts/:id
// @desc    Get Post by Id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ no_post_found: "No post found against the id." })
    );
});

// @route   Post api/posts
// @desc    Create Post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   Delete api/posts/:id
// @desc    Delete Post by Id
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          // Check post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              not_authorized: "User is not permitted to do this action."
            });
          }
          post
            .remove()
            .then(() => res.json({ success: true }))
            .catch(err =>
              res.status(404).json({ post_not_found: "No post found." })
            );
        });
      })
      .catch(err =>
        res.status(404).json({ no_post_found: "No post found against the id." })
      );
  }
);

// @route   POST api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profile: "No Profile founds" });
        }
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({ like: "User already liked." });
          }
          // add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json({ post }));
        });
      })
      .catch(() => res.status(404).json({ no_post_found: "No post found." }));
  }
);
// @route   POST api/posts/dislike/:id
// @desc    Dislikes Post
// @access  Private
router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profile: "No Profile founds" });
        }
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ not_liked_yet: "You have not liked this post yet." });
          }
          // remove user id to likes array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          // Splice out of likes array
          post.likes.splice(removeIndex, 1);
          // Save
          post.save().then(post => res.json(post));
        });
      })
      .catch(() => res.status(404).json({ no_post_found: "No post found." }));
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id).then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      // add to comment array
      post.comments.unshift(newComment);
      // save
      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(404));
    });
  }
);
// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Dislikes Post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profile: "No Profile founds" });
        }
        Post.findById(req.params.id).then(post => {
          // if comment exists
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ comment: "Comment does not exists." });
          }
          // Get remove index
          const removeIndex = post.comments
            .map(item => item.user.toString())
            .indexOf(req.params.comment_id);
          // Splice out of comments array
          post.comments.splice(removeIndex, 1);
          // Save
          post.save().then(post => res.json(post));
        });
      })
      .catch(() => res.status(404).json({ no_post_found: "No post found." }));
  }
);

module.exports = router;
