const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("APP", () => {
	describe("/api/topics", () => {
		describe("GET", () => {
			test("status: 200, returns all topics", () => {
				return request(app)
					.get("/api/topics")
					.expect(200)
					.then(({ body }) => {
						const { topics } = body;
						topics.forEach((t) => {
							expect(t).toMatchObject({
								slug: expect.any(String),
								description: expect.any(String),
							});
						});
					});
			});
		});
		describe("ERRORS", () => {
			test("not a route", () => {
				return request(app)
					.get("/api/notaroute")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid URL");
					});
			});
		});
	});
	describe("/api/articles/:article_id", () => {
		describe("GET", () => {
			test("status 200, return article by article_id", () => {
				return request(app)
					.get("/api/articles/1")
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({
							article: {
								article_id: 1,
								title: "Living in the shadow of a great man",
								body: "I find this existence challenging",
								votes: 100,
								topic: "mitch",
								author: "butter_bridge",
								created_at: "2020-07-08T23:00:00.000Z",
								comment_count: "11",
							},
						});
					});
			});
		});
		describe("PATCH", () => {
			test("status 201, updates votes and returns updated article", () => {
				const increment = { inc_votes: 1 };
				return request(app)
					.patch("/api/articles/1")
					.send(increment)
					.expect(201)
					.then(({ body }) => {
						expect(body).toEqual({
							article: {
								article_id: 1,
								title: "Living in the shadow of a great man",
								body: "I find this existence challenging",
								votes: 101,
								topic: "mitch",
								author: "butter_bridge",
								created_at: "2020-07-08T23:00:00.000Z",
							},
						});
					});
			});
		});
		describe("ERRORS", () => {
			test("status 404, error msg article not found", () => {
				return request(app)
					.get("/api/articles/not_a_id")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("article not found");
					});
			});
		});
	});
	describe("/api/articles/", () => {
		describe("GET", () => {
			test("should ", () => {
				return request(app)
					.get("/api/articles/")
					.expect(200)
					.then(({ body }) => {
						expect(body).toBe(1);
					});
			});
		});
	});
});
