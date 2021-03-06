const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const { endpoints } = require("../endpoints.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("APP", () => {
	describe("/api", () => {
		test("responds with all endpoints", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(body).toEqual(endpoints);
				});
		});
	});
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
		describe("POST", () => {
			// status 201, returns new topic
			test("status: 201, returns new topic", () => {
				return request(app)
					.post("/api/topics")
					.send({
						slug: "other",
						description: "Cats are awesome",
					})
					.expect(201)
					.then(({ body }) => {
						expect(body.topic).toMatchObject({
							slug: "other",
							description: "Cats are awesome",
						});
					});
			});
			//status 400, missing slug
			test("status: 400, missing slug", () => {
				return request(app)
					.post("/api/topics")
					.send({
						description: "Cats are awesome",
					})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("missing required fields");
					});
			});
			//status 400, missing description
			test("status: 400, missing description", () => {
				return request(app)
					.post("/api/topics")
					.send({
						slug: "cats",
					})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("missing required fields");
					});
			});
			//status 400, invalid slug
			test("status: 400, invalid slug", () => {
				return request(app)
					.post("/api/topics")
					.send({
						slug: 999,
						description: "Cats are awesome",
					})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("invalid slug");
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
			test("status 200, updates votes and returns updated article", () => {
				const increment = { inc_votes: 1 };
				return request(app)
					.patch("/api/articles/1")
					.send(increment)
					.expect(200)
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
			test("status 200, ignores patch request and sends unchanged article to client when no inc_votes passed", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({})
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
							},
						});
					});
			});
		});
		describe("ERRORS", () => {
			test("GET status 400, error msg invalid input type for artical_id", () => {
				return request(app)
					.get("/api/articles/not_a_id")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("GET status 404, article_id valid but no article not found", () => {
				return request(app)
					.get("/api/articles/999")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("article_id does not exist");
					});
			});

			test("PATCH status 400, inc_votes is invalid (not a number)", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({ inc_votes: "notavote" })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("PATCH status 400, inc_votes has more than the required inc_votes property", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({ inc_votes: 12, extraProperty: "test" })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid vote increment");
					});
			});
			test("PATCH status 400, invalid article_id (not a number)", () => {
				return request(app)
					.patch("/api/articles/notaid")
					.send({ inc_votes: 12 })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
					});
			});
			test("PATCH status 404, invalid article_id (does not exist)", () => {
				return request(app)
					.patch("/api/articles/999")
					.send({ inc_votes: 12 })
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("article_id does not exist");
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
								comment_count: expect.any(String),
							});
						});
					});
			});
			test("status 200, returns a empty array when topic exists with no articles associated for topic", () => {
				return request(app)
					.get("/api/articles?topic=paper")
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({ articles: [] });
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
		describe("Pagination", () => {
			test("status 200, limit = 5 p = 2 ", () => {
				return request(app)
					.get("/api/articles?limit=5&p=2")
					.expect(200)
					.then(({ body }) => {
						// check pagination
						expect(body.articles).toHaveLength(5);
					});
			});
		});
		describe("POST", () => {
			it("status 201, returns posted article", () => {
				return request(app)
					.post("/api/articles")
					.send({
						author: "butter_bridge",
						title: "Living in the shadow of a great",
						body: "But as he spoke, he drew the attention of the crowd",
						topic: "mitch",
					})
					.then(({ body }) => {
						expect(body.article).toEqual({
							article_id: 13,
							author: "butter_bridge",
							body: "But as he spoke, he drew the attention of the crowd",
							created_at: "2021-11-20T00:00:00.000Z",
							title: "Living in the shadow of a great",
							topic: "mitch",
							votes: 0,
						});
					});
			});
			it("status 400, returns error message when missing required fields", () => {
				return request(app)
					.post("/api/articles")
					.send({})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("missing required fields");
					});
			});
			it("status 404, returns error message when username does not exist", () => {
				return request(app)
					.post("/api/articles")
					.send({
						author: "not-a-user",
						title: "Living in the shadow of a great",
						body: "But as he spoke, he drew the attention of the crowd",
						topic: "mitch",
					})
					.then(({ body }) => {
						expect(body.msg).toBe("Resource not found");
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
			test("status 404, invalid topic query", () => {
				return request(app)
					.get("/api/articles?topic=not_a_topic")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("topic: not_a_topic does not exist");
					});
			});
		});
	});
	describe("/api/articles/:article_id/comments", () => {
		describe.only("GET", () => {
			test("status 200, responds with all comments for inputted article_id", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						body.comments.forEach((c) => {
							expect(c).toMatchObject({
								comment_id: expect.any(Number),
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
			test("status 200, responds with empty array when no comments found for article", () => {
				return request(app)
					.get("/api/articles/2/comments")
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({ comments: [] });
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
			test("POST status 201, ignores unnecessary properties on patch body", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({
						username: "butter_bridge",
						body: "test test",
						unneccesary: "test",
					})
					.expect(201)
					.then(({ body }) => {
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
		});
		describe("Pagination", () => {
			test("status 200, limit = 5 p = 1", () => {
				//check pagination
				return request(app)
					.get("/api/articles/1/comments?limit=5&p=1")
					.expect(200)
					.then(({ body }) => {
						expect(body.comments).toHaveLength(5);
					});
			});
			describe("errors", () => {
				test("pagination with invalid id", () => {
					return request(app)
						.get("/api/articles/not_a_number/comments?limit=5&p=1")
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Invalid input type");
						});
				});
				test("pagination with invalid id", () => {
					return request(app)
						.get("/api/articles/9999/comments?limit=5&p=1")
						.expect(404)
						.then(({ body }) => {
							expect(body.msg).toBe("article_id does not exist");
						});
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
						expect(body.msg).toBe("article_id does not exist");
					});
			});
			test("POST status 400, invalid article_id (not a number)", () => {
				return request(app)
					.post("/api/articles/notaid/comments")
					.send({ username: "butter_bridge", body: "test test" })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Invalid input type");
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
						expect(body.msg).toBe("Resource not found");
					});
			});
			test("POST status 404, valid input type for article_id where article_id does not exist", () => {
				return request(app)
					.post("/api/articles/999/comments")
					.send({ username: "butter_bridge", body: "test test" })
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Resource not found");
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
	describe("/api/users", () => {
		describe("GET", () => {
			test("status 200, returns all usernames in DB", () => {
				return request(app)
					.get("/api/users")
					.expect(200)
					.then(({ body }) => {
						body.users.forEach((user) => {
							expect(user).toMatchObject({
								username: expect.any(String),
							});
						});
					});
			});
		});
	});
	describe("/api/users/username", () => {
		describe("GET", () => {
			test("status 200, returns user by ID", () => {
				return request(app)
					.get("/api/users/butter_bridge")
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({
							user: {
								avatar_url:
									"https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
								name: "jonny",
								username: "butter_bridge",
							},
						});
					});
			});
		});
		describe("ERRORS", () => {
			test("GET status 404, username valid type but does not exist in DB", () => {
				return request(app)
					.get("/api/users/notausername")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("User not found");
					});
			});
		});
	});
	describe("/api/comments/:comment_id", () => {
		describe("PATCH", () => {
			test("status 200, updated comment object", () => {
				return request(app)
					.patch("/api/comments/1")
					.send({ inc_votes: 1 })
					.expect(200)
					.then(({ body }) => {
						expect(body.comment).toEqual({
							comment_id: 1,
							body:
								"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
							votes: 17,
							author: "butter_bridge",
							article_id: 9,
							created_at: expect.any(String),
						});
					});
			});
			describe("errors", () => {
				test("status 400, invalid article_id", () => {
					return request(app)
						.patch("/api/comments/noaid")
						.send({ inc_votes: 1 })
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toEqual("Invalid input type");
						});
				});
				test("status 404, non existent article_id", () => {
					return request(app)
						.patch("/api/comments/999")
						.send({ inc_votes: 1 })
						.expect(404)
						.then(({ body }) => {
							expect(body.msg).toEqual("no comment found for comment ID 999");
						});
				});
				test("status 40, inc_votes not a number", () => {
					return request(app)
						.patch("/api/comments/1")
						.send({ inc_votes: "notanumber" })
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toEqual("Invalid input type");
						});
				});
				test("status 40, inc_votes is missing", () => {
					return request(app)
						.patch("/api/comments/1")
						.send({})
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toEqual("Empty post request");
						});
				});
			});
		});
	});
});
