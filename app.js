const experss = require("express");
const {getCategories} = require("./controllers/games.controllers")
const app = experss();

app.get("/api/categories", getCategories)

module.exports = app; 