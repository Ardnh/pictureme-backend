const fs = require("fs")
const path = require("path")
const { validationResult } = require('express-validator')
const Post = require('../models/post')

// get all posts by userId - Done
exports.getPosts = (req, res, next) => {
   const { userId } = req.body
   console.log(userId)
   Post.find({ creator: userId })
   .then(result => {
      if(!result){
         return res.status(404).json({
            message: 'Could not find posts!'
         })
      }
      res.status(200).json({
         message: "Posts fetched!",
         post: result
      })
   })
   .catch( err => {
      res.status(500).json({
         message: 'Cannot get post!',
         error: err
      })
   })
}

// get all posts without auth
exports.getAllPosts = (req, res, next) => {
   Post.find({}).exec()
   .then(result => {
      if(!result) res.status(404).json({
         message: 'Could not find posts'
      })
      res.status(200).json({
         message: 'Posts fetched',
         post: result
      })
   })
   .catch( err => {
      res.status(500).json({
         message: 'could not find posts',
         error: err
      })
   })
}

// get single post - Done
exports.getPostById = ( req, res, next ) => {
   // postId send via body
   const { postId } = req.body
   Post.findById(postId).exec()
   .then( result => {
      if(!result){
         return res.status(404).json({
            message: 'Could not find post!'
         })
      }
      res.status(200).json({
         message: 'Post with id fetched!',
         post: result
      })
   })
}

// create a new post - Done
exports.createPost = (req, res, next) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(422).json({
         message: "failed to create post",
         errors: errors.array()
      })
   }
   // must be a form-data
   const { title, description } = req.body
   const file = req.file.path

   console.log(file)

   if(!file){
      return res.status(422).json({
         message: 'No image provided!'
      })
   }

   const post = new Post({
      title: title,
      imageUrl: file,
      description: description,
      creator: req.userId
   })

   post.save()
   .then( result => {
      res.status(200).json({
         message: "post created successfully",
         post: result
      })
   })
   .catch( err => res.status(500).json(err) )
}

// update post with id user - Done
exports.updatePost = ( req, res, next) => {
   const { title, description, creator, postId } = req.body
   let imageUrl = req.body.image

   if(req.file) imageUrl = req.file.path
   if(!imageUrl) res.status(422).json({ message: "No image picked" })

   Post.findById(postId)
      .then(post => {
         if(!post) res.status(404).json({ message: "could not find post"})

         if(post.imageUrl !== imageUrl) clearImage(post.imageUrl)

         post.title = title
         post.description = description
         post.creator = creator
         post.imageUrl = imageUrl

         return post.save()
      })
      .then(result => {
         res.status(200).json({
            message: "post updated",
            result
         })
      })
      .catch(error => console.log(error))
}

// delete post with specific id - Done
exports.deletePost = ( req, res, next ) => {
   // send postId via body
   const { postId } = req.body
   Post.findById(postId)
      .then(post => {
         if(!post){
            res.status(404).json({
               message: `Post with id ${postId} not found`
            })
         }
         clearImage(post.imageUrl)
         return Post.findByIdAndRemove(postId)
      })
      .then(result => {
         res.status(200).json({
            message: "deleted post!"
         })
      })
      .catch(err => {
         res.status(500).json({
            message: "something went wrong!"
         })
      })
}

const clearImage = (filePath) => {
   filePath = path.join(__dirname, "../../", filePath)
   fs.unlink(filePath, err => console.log(err))
}