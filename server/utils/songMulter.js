const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        // console.log(file);
        if (!file.mimetype.match('audio/mpeg|audio/mp3|audio/wav|audio/mp4')) {
            cb(new Error('File is not supported'), false);
            return;
        }
        // console.log(2)
        cb(null, true)
        // console.log(3);
    }
})