const upload = require("./upload");

module.exports = app => {

    app.get("/", (req, res) => {
        res.status(200).send({message: "please use /api/create post endpoint for testing"});
    });
    app.use("/api", upload);
};
