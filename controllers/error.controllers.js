const { response } = require("../app");

exports.handle404Errors = ((req, res) => {
res.status(404).send({msg: "404 Route Not Found"});
});

exports.hadle400Errors = ((error, req, res, next) => {
    if(error.code = "22P02"){
        response.status(400).send({msg: "Bed Request"})
    } else {
        next(error);
    }
})