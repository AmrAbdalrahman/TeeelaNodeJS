const upload = require("./upload");

module.exports = app => {
    app.use("/api", upload);
};
