const {uploadImage,imageFilter, resApi} = require("../helpers/utils");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'teeela/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const imageFileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/PNG" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/JPG" ||
        file.mimetype === "image/JPEG" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


let imageUpload = multer({ storage: storage, fileFilter: imageFilter }).fields([{
    name: 'template', maxCount: 1
}, {
    name: 'image', maxCount: 1
}]);


exports.uploadImage = (req, res, next) => {

    imageUpload(req, res, async function (err) {

        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return resApi(null, false, "validation error check the key and value", 422, res);
        } else if (err) {
            // An unknown error occurred when uploading.
            return resApi(null, false, "Not an image it must be png or jpg or jpeg image", 400, res);
        }
        console.log("asdd");
        console.log(req);
        try {
            //console.log(req);
            /*const imageUrl = req.file.path;
            //remove extension from name
            const imageName =
                req.file.filename.substring(0, req.file.filename.lastIndexOf(".")) ||
                req.file.filename;

            const result = await uploadImage(imageUrl, imageName);*/
            return resApi("success", true, null, 201, res);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            error.message = "Not an image it must be png or jpg or jpeg image";
            next(error);
        }
    });
};
