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
    return db.query(`
    SELECT 
    reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  
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

exports.insertComment = (newComment, review_id) => {

  const userId = Number(review_id)
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

}