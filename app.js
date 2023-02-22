const experss = require("express");
const {getCategories, getReviews} = require("./controllers/games.controllers")
const {handle404Errors} =require(`./controllers/error.controllers`)
const app = experss();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use(handle404Errors);

module.exports = app; 