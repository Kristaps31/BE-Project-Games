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
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: checks length of the array and its properties", () => {
    const singleComment = {
      comment_id: 1,
      body: "I loved this game too!",
      review_id: 2,
      author: "bainesface",
      votes: 16,
      created_at: "2017-11-22T12:43:33.389Z",
    };

    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id", expect.any(Number)),
        expect(comment).toHaveProperty("body", expect.any(String)),
        expect(comment).toHaveProperty("review_id", expect.any(Number)),
        expect(comment).toHaveProperty("author", expect.any(String)),
        expect(comment).toHaveProperty("votes", expect.any(Number)),
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
});
