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
            // A Multer error occurred when uploading or use different names for image and template.
            return resApi(null, false, "validation error check the key and value", 422, res);
        } else if (err) {
            // An unknown error occurred when uploading.
            return resApi(null, false, "Not an image it must be png or jpg or jpeg image", 400, res);
        }
        try {
            const {width, height, angel} = req.body.imageDetails;
            const leftEdge = req.body.imageDetails.startPoint[0];
            const topEdge = req.body.imageDetails.startPoint[1];

            //console.log(leftEdge)
            /*console.log(width);
            let width = 1675;
            let height = 1215;
            let angel = 186;
            let topEdge = 1558;
            let leftEdge = 2035;*/


            const imagePath = req.files.image[0].path;
            const templatePath = req.files.template[0].path;
            //remove extension from image name
            const imageName = req.files.image[0].filename.substring(0, req.files.image[0].filename.lastIndexOf(".")) || req.files.image[0].filename;

            let kidImageSharped = `teeela/thum_${imageName}.png`;

            //kid small image
            await sharp(imagePath)
                .rotate(angel, {background: {r: 0, g: 0, b: 0, alpha: 0}})
                .flatten({background: {r: 255, g: 255, b: 255, alpha: 0}})
                .resize({
                    height: height,
                    width: width,
                })
                .withMetadata()
                .toFile(`${kidImageSharped}`);


            const imageCardPath = `teeela/card_${imageName}.png`;

            //composite image and template
            await sharp(templatePath)
                .composite([{input: kidImageSharped, top: topEdge, left: leftEdge, blend: 'saturate'}])
                .sharpen()
                .withMetadata()
                .toFile(imageCardPath);

            //upload to cloudinary
            const result = await uploadImage(imageCardPath, imageName);
            return res.status(200).json({
                finalTemplateURL: result.secure_url,
            });

        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            error.message = "Not an image it must be png or jpg or jpeg image";
            next(error);
        }
    });
};
