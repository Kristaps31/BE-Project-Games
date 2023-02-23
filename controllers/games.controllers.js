const {selectCategories, selectReviews, selectCommentsByID} = require("../models/games.models")


exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(err => {
    next(err)
    })
};

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        reviews.forEach(review => review)
        res.status(200).send({reviews})
    })
    .catch(err => {
        next(err)
    });
};

exports.getCommentsByID = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentsByID(review_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
      next(err);
    });
};