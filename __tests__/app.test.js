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
})

describe("GET /api/reviews/:review_id", () => {
    test("200: responds with single object containing properties {review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at}", ()=> {
        const outcome = {
            review_id: 1,
            title: 'Agricola',
            category: 'euro game',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_body: 'Farmyard fun!',
            review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1
          };

        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual(outcome);
          })
    })

    test("400: GET invalid review_id", () => {
        return request(app)
        .get("/api/reviews/100")
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad Request");
        });
    })
})
});