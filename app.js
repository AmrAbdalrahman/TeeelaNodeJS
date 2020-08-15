require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const multer = require("multer");
const compression = require('compression');
const path = require('path');
const {imageFilter, resApi} = require("./helpers/utils");

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'teeela/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});


app.use(bodyParser.json());

function uploadFile(req, res, next) {
    const upload = multer({storage: storage, fileFilter: imageFilter}).fields([{
        name: 'template', maxCount: 1
    }, {
        name: 'image', maxCount: 1
    }]);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading or use different names for image and template.
            return resApi(null, false, "validation error check the key and value", 422, res);
        } else if (err) {
            // An unknown error occurred when uploading.
            return resApi(null, false, "Not an image it must be png or jpg or jpeg image", 400, res);
        }
        // Everything went fine.
        next()
    })
}

app.use(uploadFile);
app.use(cors());


require('./routes/index')(app);

app.use(helmet());
app.use(compression());

app.use(((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({data: null, status: false, error: message});
}));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
