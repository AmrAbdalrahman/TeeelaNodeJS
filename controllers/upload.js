const {uploadImage, imageFilter, resApi} = require("../helpers/utils");
const multer = require("multer");
const path = require('path');
const sharp = require('sharp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'teeela/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});


let imageUpload = multer({storage: storage, fileFilter: imageFilter}).fields([{
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
        try {
            let width = 100;
            let height = 100;
            let angel = 186;

            const imagePath = req.files.image[0].path;
            const imageName =
                req.files.image[0].filename.substring(0, req.files.image[0].filename.lastIndexOf(".")) ||
                req.files.image[0].filename;
            console.log(imagePath);
            console.log(imageName);
            //await resizeImage(imagePath, 'png', width, height).pipe(res);

            await sharp(imagePath)
                .resize({
                    height: height,
                    width: width
                })
                .rotate(angel)
                .toFile(`teeela/thum_${imageName}.png`);


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
