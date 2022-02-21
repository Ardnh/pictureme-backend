const multer = require('multer');

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './src/images')
   },
   filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname)
   }
})

const fileFilter = (req, file, cb) => {
   if(file.mimetype === 'jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
      cb(null, true)
   } else {
      cb(null, false)
   }
}

module.exports = multer({ storage: fileStorage, fileFilter }).single('image');