const fs = require("fs");
const cloudinary = require("../config/cloudinary");

function resApi(data, status, error, code, res) {
    return res.status(code).json({
        data: data,
        status: status,
        error: error
    });
}

function uploadImage(path, imageName) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            {public_id: `teeela/${imageName}`, tags: `teeela`},
            (err, url) => {
                if (err) return reject(err);
                //not remove uploaded card locally
                //fs.unlinkSync(path);
                return resolve(url);
            }
        );
    });
}

function imageFilter(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}


module.exports = {resApi, uploadImage, imageFilter};
