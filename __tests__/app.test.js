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
			test("status 40o, error msg invalid input type for artical_id", () => {
				return request(app)
					.get("/api/articles/not_a_id")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("status 404, article_id valid but no article not found", () => {
				return request(app)
					.get("/api/articles/999")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("article ID 999 not found");
					});
			});
			test("status 400, no inc_votes passed", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Increment can not be null");
					});
			});
			test("status 404, inc_votes is invalid (not a number)", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({ inc_votes: "notavote" })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("status 404, inc_votes has more than the required inc_votes property", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({ inc_votes: 12, extraProperty: "test" })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid vote increment");
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
		describe("POST", () => {
			test("status 201, inserts comment into comments table", async () => {
				const comment = { username: "butter_bridge", body: "test test" };
				const { body } = await request(app)
					.post("/api/articles/1/comments")
					.send(comment)
					.expect(201);
				const { rows } = await db.query("SELECT * FROM comments;");
				expect(rows).toHaveLength(19);
				expect(body.comment).toMatchObject({
					article_id: 1,
					author: "butter_bridge",
					body: "test test",
					comment_id: 19,
					created_at: expect.any(String),
					votes: 0,
				});
			});
		});
		describe("ERRORS", () => {
			test("GET status 400, invalid input type for article_id (not a number", () => {
				return request(app)
					.get("/api/articles/notaid/comments")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("GET status 404, valid input type for article_id where no articles found", () => {
				return request(app)
					.get("/api/articles/999/comments")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("no comments found for article ID 999");
					});
			});
			test("POST status 400, valid input type for article_id where post body is empty", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Empty post request");
					});
			});
			test("POST status 400, valid input type for article_id where post body property username is not found in DB", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({ username: "notauser", body: "test test" })
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("User notauser does not exist");
					});
			});
		});
	});
	describe("/api/comments/:comment_id", () => {
		describe("DELETE", () => {
			test("status 204, deletes comment by given comment_id", async () => {
				await request(app).delete("/api/comments/18").expect(204);
				const { rows } = await db.query(`SELECT * FROM  comments;`);
				expect(rows).toHaveLength(17);
			});
		});
		describe("ERRORS", () => {
			test("status 404, valid comment_id where no comments found", () => {
				return request(app)
					.delete("/api/comments/999")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("no comment found for comment ID 999");
					});
			});
			test("status 400, invalid comment_id (not a number)", () => {
				return request(app)
					.delete("/api/comments/notaid")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
		});
	});
});
