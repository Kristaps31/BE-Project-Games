const experss = require("express");
const {getCategories, getReviewsById} = require("./controllers/games.controllers")
const app = experss();

app.get("/api/categories", getCategories)

app.get("/api/reviews/:review_id", getReviewsById)

module.exports = app; 