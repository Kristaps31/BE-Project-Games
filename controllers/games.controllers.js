const {
  selectCategories,
  selectReviews,
  selectReviewsById,
  insertComment,
} = require("../models/games.models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      throw err;
    });
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      reviews.forEach((review) => review);
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      throw err;
    });
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const newComment = req.body

  insertComment(newComment, review_id)

  .then((comment) => res.status(201)
  .send({comment}))
  .catch((err) => {
    next(err);
  });
}
