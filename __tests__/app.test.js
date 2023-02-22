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
            const {categories} = body
            expect(categories).toHaveLength(4);
            categories.forEach(category => { 
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
        });
        })
    })
    test("404: responds with route that does not exist", () => {
        return request(app)
        .get('/api/notCategory')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404 Route Not Found");
        })
    })
})
});