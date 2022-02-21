const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
   title: {
      type: String,
      required: true
   },
   imageUrl: {
      type: String,
      required: false
   },
   description: {
      type: String,
      required: true
   },
   creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
}, { timestamps: true } )

module.exports = mongoose.model('Post', postSchema)