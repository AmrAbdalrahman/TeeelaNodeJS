const express = require("express");
const {check} = require('express-validator');
const validate = require('../middlewares/validate');
const UploadController = require("../controllers/upload");
const router = express.Router();

router.post("/create",
    [
        /*check('imageDetails.startPoint').isArray({min: 2, max: 2}).isNumeric().withMessage('Enter a valid startPoint'),
        check('imageDetails.width').not().isEmpty().isNumeric().withMessage('Enter a valid width number'),
        check('imageDetails.height').not().isEmpty().isNumeric().withMessage('Enter a valid height number'),
        check('imageDetails.angel').not().isEmpty().isNumeric().withMessage('Enter a valid angel number'),*/
    ], validate, UploadController.uploadImage);

module.exports = router;
