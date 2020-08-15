const {uploadImage, resApi} = require("../helpers/utils");
const sharp = require('sharp');

exports.uploadImage = async (req, res, next) => {

    try {
        const width = parseInt(req.body.imageDetails.width);
        const height = parseInt(req.body.imageDetails.height);
        const angel = parseInt(req.body.imageDetails.angel);
        const leftEdge = parseInt(req.body.imageDetails.startPoint[0]);
        const topEdge = parseInt(req.body.imageDetails.startPoint[1]);

        /*let width = 1675;
        let height = 1215;
        let angel = 186;
        let topEdge = 1558;
        let leftEdge = 2035;
        console.log(width);
        */

        const imagePath = req.files.image[0].path;
        const templatePath = req.files.template[0].path;
        //remove extension from image name
        const imageName = req.files.image[0].filename.substring(0, req.files.image[0].filename.lastIndexOf(".")) || req.files.image[0].filename;

        let kidImageSharped = `teeela/thum_${imageName}.png`;

        //kid rotate and resize image
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
};
