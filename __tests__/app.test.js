const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("GET /api/categories", () => {
    test("200: responds with array with properties slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });

    test("404: responds with route that does not exist", () => {
      return request(app)
        .get("/api/notCategory")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Route Not Found");
        });
    });

    describe("GET /api/reviews", () => {
      test("200: responds with array of objects, each having following properties, owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toHaveLength(13);

            for (let i = 0; i < reviews.length - 1; i++) {
              let dateNow = new Date(reviews[i].created_at).getTime();
              let dateNext = new Date(reviews[i + 1].created_at).getTime();
              expect(dateNow).toBeGreaterThanOrEqual(dateNext);
            }

            reviews.forEach((review) => {
              expect(review).toHaveProperty("owner", expect.any(String));
              expect(review).toHaveProperty("title", expect.any(String));
              expect(review).toHaveProperty("review_id"), expect.any(Number);
              expect(review).toHaveProperty("category", expect.any(String));
              expect(review).toHaveProperty(
                "review_img_url",
                expect.any(String)
              );
              expect(review).toHaveProperty("created_at", expect.any(String));
              expect(review).toHaveProperty("votes", expect.any(Number));
              expect(review).toHaveProperty("designer", expect.any(String));
              expect(review).toHaveProperty(
                "comment_count",
                expect.any(String)
              );
            });
          });
      });
    });

    describe("GET /api/reviews/:review_id", () => {
      test("200: responds with single object containing properties {review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at}", () => {
        const outcome = {
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        };
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual(outcome);
          });
      });

      test("404: GET review_id out of range", () => {
        return request(app)
          .get("/api/reviews/100")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404 Route Not Found");
          });
      });

      test("400: GET invalid review_id", () => {
        return request(app)
          .get("/api/reviews/apple")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: checks length of the array and its properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((entry) => {
          expect(entry).toHaveProperty("comment_id", expect.any(Number)),
            expect(entry).toHaveProperty("body", expect.any(String)),
            expect(entry).toHaveProperty("review_id", expect.any(Number)),
            expect(entry).toHaveProperty("author", expect.any(String)),
            expect(entry).toHaveProperty("votes", expect.any(Number)),
            expect(entry).toHaveProperty("created_at", expect.any(String));
        });
      });
  });
  test("should return 404 if review_id is not found", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .expect({ msg: "Review not found" });
  });

  test("should return an Bad Request if there are no comments for a review", () => {
    return request(app)
      .get("/api/reviews/apple/comments")
      .expect(400)
      .expect({ msg: "Bad Request" });
  });
});

describe("POST", () => {
  describe("POST /api/reviews/:review_id/comments", () => {
    test("201: responds with posted comment", () => {
      const newComment = {
        username: "bainesface",
        body: "This is amazing game, unfortunately no spider characters though!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(Object.keys(body.comment).length).toBe(6);
          expect(body.comment).toHaveProperty("comment_id"), expect.any(Number);
          expect(body.comment).toHaveProperty("body", expect.any(String));
          expect(body.comment).toHaveProperty("review_id"), expect.any(Number);
          expect(body.comment).toHaveProperty("author", expect.any(String));
          expect(body.comment).toHaveProperty("votes", expect.any(Number));
          expect(body.comment).toHaveProperty("created_at", expect.any(String));
        });
    });

    test("201: responds with posted comment, and ignores extra information", () => {
      const firstComment = {
        username: "bainesface",
        body: "This is an amazing game, unfortunately no spider characters though!",
        favorite_food: "Pizza",
        personal_hobbies: "fishing and picking nose",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(firstComment)
        .expect(201)
        .then(({ body }) => {
          expect(Object.keys(body.comment).length).toBe(6);
          expect(body.comment).toHaveProperty("comment_id"), expect.any(Number);
          expect(body.comment).toHaveProperty("body", expect.any(String));
          expect(body.comment).toHaveProperty("review_id"), expect.any(Number);
          expect(body.comment).toHaveProperty("author", expect.any(String));
          expect(body.comment).toHaveProperty("votes", expect.any(Number));
          expect(body.comment).toHaveProperty("created_at", expect.any(String));
        });
    });

    test("400: responds with error message when username not found", () => {
      const secondComment = {
        username: "nonexistinguser",
        body: "This is an amazing game, unfortunately no spider characters though!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(secondComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route Not Found");
        });
    });

    test("400: responds with error message when review_id is out of range", () => {
      const thirdComment = {
        username: "bainesface",
        body: "This is an amazing game, unfortunately no spider characters though!",
      };
      return request(app)
        .post("/api/reviews/999/comments")
        .send(thirdComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route Not Found");
        });
    });

    test("400: responds with error message when review_id is not a number", () => {
      const fourthComment = {
        username: "bainesface",
        body: "This is an amazing game, unfortunately no spider characters though!",
      };
      return request(app)
        .post("/api/reviews/abc/comments")
        .send(fourthComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("400: responds with error message when required fields are not filled in (username)", () => {
      const fifthComment = {
        username: "",
        body: "This is an amazing game, unfortunately no spider characters though!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(fifthComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required fields are not filled in");
        });
    });

    test("400: responds with error message when required fields are not filled in (body)", () => {
      const sixthComment = {
        username: "bainesface",
        body: "",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(sixthComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required fields are not filled in");
        });
    });

    test("400: responds with error message when comment is empty", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send()
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required fields are not filled in");
        });
    });
  });
});

describe("PATCH", () => {
  describe("PATCH /api/reviews/:review_id", () => {
    test("200: responds with incremented vote count of a review", () => {
      const voteAmendBy = { inc_votes: 34 };
      const existingReview = {
        review_id: 3,
        title: "Ultimate Werewolf",
        category: "social deduction",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_body: "We couldn't find the werewolf!",
        review_img_url:
          "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
        created_at: new Date(1610964101251),
        votes: 5,
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(voteAmendBy)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.review).length).toBe(9);
          expect(body.review).toHaveProperty("review_id"), expect.any(Number);
          expect(body.review).toHaveProperty("title", expect.any(String));
          expect(body.review).toHaveProperty("category", expect.any(String));
          expect(body.review).toHaveProperty("designer", expect.any(String));
          expect(body.review).toHaveProperty("owner", expect.any(String));
          expect(body.review).toHaveProperty("review_body", expect.any(String));
          expect(body.review).toHaveProperty("review_img_url", expect.any(String));
          expect(body.review).toHaveProperty("created_at", expect.any(String));
          expect(body.review.votes).toBe(existingReview.votes + voteAmendBy.inc_votes);
        });
    });
    test("200: responds with decreased vote count of a review", () => {
      const voteAmendBy = { inc_votes: -10 };
      const existingReview = {
        review_id: 2,
        votes: 5,
      };
      return request(app)
        .patch("/api/reviews/2")
        .send(voteAmendBy)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.review).length).toBe(9);
          expect(body.review).toHaveProperty("review_id"), expect.any(Number);
          expect(body.review).toHaveProperty("title", expect.any(String));
          expect(body.review).toHaveProperty("category", expect.any(String));
          expect(body.review).toHaveProperty("designer", expect.any(String));
          expect(body.review).toHaveProperty("owner", expect.any(String));
          expect(body.review).toHaveProperty("review_body", expect.any(String));
          expect(body.review).toHaveProperty("review_img_url", expect.any(String));
          expect(body.review).toHaveProperty("created_at", expect.any(String));
          expect(body.review.votes).toBe(existingReview.votes + voteAmendBy.inc_votes);
        });
    });
    test("200: responds with updated review, and ignores extra information", () => {
      const voteAmendBy = {
        inc_votes: 10,
        title: "Magic Trip",
        category: "Travel",
        designer: "Peter pen",
      };
      const reviewNo2 = {
        review_id: 2,
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: new Date(1610964101251),
        votes: 5,
      };
      return request(app)
        .patch("/api/reviews/2")
        .send(voteAmendBy)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.review).length).toBe(9);
          expect(body.review.review_id).toBe(reviewNo2.review_id);
          expect(body.review.title).toBe(reviewNo2.title);
          expect(body.review.designer).toBe(reviewNo2.designer);
          expect(body.review.owner).toBe(reviewNo2.owner);
          expect(body.review.review_img_url).toBe(reviewNo2.review_img_url);
          expect(body.review.review_body).toBe(reviewNo2.review_body);
          expect(body.review.category).toBe(reviewNo2.category);
          expect(new Date(body.review.created_at)).toEqual(new Date(reviewNo2.created_at));
          expect(body.review.votes).toBe(reviewNo2.votes + voteAmendBy.inc_votes);
        })
        });
    });

    test("200: responds with updated review, and ignores unrelated extra information, without affecting the length of array", () => {
      const voteAmendBy = {
        inc_votes: 10,
        favorite_food: "Pizza",
        personal_hobbies: "fishing and picking nose",
      };
      const reviewNo4 = {
        review_id: 4,
        title: "Dolor reprehenderit",
        designer: "Gamey McGameface",
        owner: "mallionaire",
        review_img_url: "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
        review_body: "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
        category: "social deduction",
        created_at: new Date(1611315350936),
        votes: 7,
      };
      return request(app)
        .patch("/api/reviews/4")
        .send(voteAmendBy)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.review).length).toBe(9);
          expect(body.review).not.toHaveProperty('favorite_food');
          expect(body.review).not.toHaveProperty('personal_hobbies');
          expect(body.review.votes).toBe(reviewNo4.votes + voteAmendBy.inc_votes);
        });
    });

    test("returns an error if inc_votes field is missing", () => {
      const reviewId = 1;
      const voteAmendBy = {};
      return request(app)
        .patch("/api/reviews/1")
        .send(voteAmendBy)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Required fields are not filled in");
        });
    });
    test("returns an error if review_id is not found", () => {
      const reviewId = 1000;
      const voteAmendBy = { inc_votes: 1 };
      return request(app)
        .patch("/api/reviews/100")
        .send(voteAmendBy)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Route Not Found");
        });
    });
    test("returns an error if review_id is not a number", () => {
      const reviewId = "abc";
      const voteAmendBy = { inc_votes: 1 };
      return request(app)
        .patch("/api/reviews/abc")
        .send(voteAmendBy)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
