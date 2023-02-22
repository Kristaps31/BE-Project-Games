exports.handle404Errors = ((req, res) => {
res.status(404).send({msg: "404 Route Not Found"});
});