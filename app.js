const experss = require("express");
const {getCategories} = require("./controllers/games.controllers")
const {handle404Errors} = require("./controllers/error.controllers")
const app = experss();

app.get("/api/categories", getCategories)

module.exports = app; 

app.use(handle404Errors);