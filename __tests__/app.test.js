const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(()=> {
    return seed(data)
});

afterAll(() => {
      return db.end();
});

describe("app", ()=> { 
describe("GET /api/categories", () => {
    test("200: responds with array with properties slug and description", () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            const {categories} = body;
            expect(categories).toHaveLength(4);
            expect(categories[0]).toHaveProperty("slug", expect.any(String));
            expect(categories[0]).toHaveProperty("description", expect.any(String));
        })
    })
})
describe("GET /api/reviews", ()=> {
    test("200: responds with array of objects, each having following properties, owner: titlereview_id, category, review_img_url, created_at, votes, designer, comment_count", () => {
        return request (app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
        });
    })
})
});

