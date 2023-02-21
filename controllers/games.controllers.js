const {selectCategories} = require("../models/games.models")

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        if (err.status === 404) {
          res.status(404).send({ msg: "404 Route Not Found" });
        } else {
          next(err);
        }
      });

};