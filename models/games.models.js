const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    const categories = result.rows;
    return categories;
  });
};

exports.selectReviewsById = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject("No review with such ID");
      }
      return results.rows[0];
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `
    SELECT 
    reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.review_body, reviews.designer,  
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY 
    reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
    ORDER BY created_at DESC;
    `
    )
    .then((result) => {
      const reviews = result.rows;
      return reviews;
    });
};

exports.selectCommentsByID = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject("No comment with such ID");
      }
      return results.rows;
    });
};

exports.insertComment = (newComment, review_id) => {
  const userId = Number(review_id);
  const { username, body } = newComment;

  if (!username || !body) {
    return Promise.reject("Fields are not filled in");
  }

  return db
    .query(
      `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [userId, username, body]
    )
    .then((results) => {
      return results.rows[0];
    });
};

exports.reviewVoteUpdate = (review_id, voteAmendBy) => {
  const userId = review_id * 1;
  const { inc_votes } = voteAmendBy;

  if (!inc_votes) {
    return Promise.reject("Fields are not filled in");
  }
  return db
  .query(
    `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
    [inc_votes, userId]
  )
  .then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject("No review with such ID")
    }
    return results.rows[0]
  })
}


exports.selectUsers = () => {
  return db
  .query(
    `SELECT users.username, users.name, users.avatar_url FROM users;`
    )
    .then((result) => {
    const users = result.rows;
    return users;
  });
};