const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

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
              expect(review).toHaveProperty("review_img_url",expect.any(String));
              expect(review).toHaveProperty("created_at", expect.any(String));
              expect(review).toHaveProperty("votes", expect.any(Number));
              expect(review).toHaveProperty("designer", expect.any(String));
              expect(review).toHaveProperty("comment_count", expect.any(String));
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
          expect(body.comment.body).toBe(newComment.body);
        });
    });

    test("201: responds with posted comment, and ignores extra information", () => {
      const firstComment = {
        username: "bainesface",
        body: "This is an amazing game, unfortunately no spider characters though!",
        favorite_food: "Pizza",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(firstComment)
        .expect(201)
        .then(({body})=> {
          expect(body.comment.body).toBe(firstComment.body);
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
        .then(({body})=> {
          expect(body.msg).toBe("Route Not Found")
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
        .then(({body}) => {
          expect(body.msg).toBe("Route Not Found");
        })
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
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request");
        })
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
        .then(({body}) => {
          expect(body.msg).toBe("Required fields are not filled in");
        })
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
        .then(({body}) => {
          expect(body.msg).toBe("Required fields are not filled in");
        })
    });

    test("400: responds with error message when comment is empty", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send()
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Required fields are not filled in");
        })
    });
})
});
