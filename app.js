require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');


const app = express();

app.use(bodyParser.json());
app.use(cors());


require('./routes/index')(app);

app.use(helmet());

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
