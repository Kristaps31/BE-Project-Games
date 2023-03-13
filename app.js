const express = require("express");
const {getCategories, getReviews, getReviewsById, postCommentByReviewId, getCommentsByID, updateReviewVote, getUsersData} = require("./controllers/games.controllers")
const {handleCustomErrors, handle500Errors, handle400Errors, handle404Errors} = require ("./controllers/error.controllers")
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews/:review_id/comments", getCommentsByID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", updateReviewVote);

app.get("/api/users", getUsersData)

app.use(handleCustomErrors);
app.use(handle400Errors);
app.use(handle404Errors);
app.use(handle500Errors);

module.exports = app; 

