exports.handle400Errors = (error, req, res, next) => {
  if ((error.code === "22P02")) {
    res.status(400).send({ msg: "Bad Request" })
  } else {
    next(error);
  }
};

exports.handle404Errors = (req, res) => {
  res.status(404).send({ msg: "404 Route Not Found" });
};

exports.handleCustomErrors = (error, req, res, next) => {
  if (error === `No review with such ID`) {
    res.status(404).send({ msg: "404 Route Not Found" });
  } else if ((error.code === "23503")) {
    res.status(404).send({ msg: "Route Not Found" })
  } else if ((error === "Fields are not filled in")) {
    res.status(400).send({ msg: "Required fields are not filled in"})
  } else if (error === "No comment with such ID") {
    res.status(404).send({ msg: "Review not found" });
  } else {
    next(error);
  }
};

exports.handle500Errors = (error, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
};

