const experss = require("express");
const {getCategories, getReviews} = require("./controllers/games.controllers")
const app = experss();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

module.exports = app; 