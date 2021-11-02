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
			test("status 40o, error msg invalid input type", () => {
				return request(app)
					.get("/api/articles/not_a_id")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("status 404, error msg article not found", () => {
				return request(app)
					.get("/api/articles/999")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("article ID 999 not found");
					});
			});
		});
	});
	describe("/api/articles/", () => {
		describe("GET", () => {
			test("status 200, returns all articles", () => {
				return request(app)
					.get("/api/articles/")
					.expect(200)
					.then(({ body }) => {
						body.articles.forEach((a) => {
							expect(a).toMatchObject({
								title: expect.any(String),
								topic: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
							});
						});
					});
			});
			test("status 200, returns all articles sorted by default created_at", () => {
				return request(app)
					.get("/api/articles/")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSortedBy("created_at", { descending: true });
					});
			});
			test("status 200, returns all articles sorted by user input votes", () => {
				return request(app)
					.get("/api/articles?sort_by=votes")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSortedBy("votes", { descending: true });
					});
			});
			test("status 200, returns all articles sorted by default in descending order", () => {
				return request(app)
					.get("/api/articles?sort_by=votes")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSorted({ descending: true });
					});
			});
			test("status 200, returns all articles sorted by user input order", () => {
				return request(app)
					.get("/api/articles?order=ASC")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSortedBy("created_at", { descending: false });
					});
			});
			test("status 200, returns all articles filtered by user input topic", () => {
				return request(app)
					.get("/api/articles?topic=cats")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles.every((a) => a.topic === "cats")).toBe(true);
					});
			});
			describe("ERRORS", () => {
				test("status 400, invalid sort_by query", () => {
					return request(app)
						.get("/api/articles?sort_by=not_a_sort_by")
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Invalid sort_by query");
						});
				});
				test("status 400, invalid order query", () => {
					return request(app)
						.get("/api/articles?order=not_a_order")
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Invalid order query");
						});
				});
				test("status 400, invalid topic query", () => {
					return request(app)
						.get("/api/articles?topic=not_a_topic")
						.expect(404)
						.then(({ body }) => {
							expect(body.msg).toBe("No articles for topic: not_a_topic found");
						});
				});
			});
		});
	});
	describe("/api/articles/:article_id/comments", () => {
		describe("GET", () => {
			test("status 200, responds with all comments for inputted article_id", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						body.comments.forEach((c) => {
							expect(c).toMatchObject({
								body: expect.any(String),
								votes: expect.any(Number),
								author: expect.any(String),
								created_at: expect.any(String),
							});
							expect(c).not.toMatchObject({
								article_id: expect.any(Number),
							});
						});
					});
			});
		});
	});
});
