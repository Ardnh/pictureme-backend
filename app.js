require('dotenv').config()
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const corsConfig = require('./src/middleware/cors.config')
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/auth.js')
const postRoutes = require('./src/routes/post')

const app = express();

// middleware
app.use(bodyParser.json());
app.use(require('./src/middleware/multer.config'));
app.use('/images', express.static(path.join(__dirname, '/src/images')))

// CORS
app.use(corsConfig);

// register routes
app.use(authRoutes);
app.use('/post',postRoutes);

mongoose.connect(
  `mongodb+srv://ardan:${ process.env.COLLECTION_PWD }@express-cluster.vrt5p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
).then(result => {
  app.listen(8080);
  console.log("connected to database!")
}).catch(err => console.log(err));
