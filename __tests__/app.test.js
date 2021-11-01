const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("APP", () => {
	describe("/api/topics", () => {
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
		test("status 200, return article by article_id", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toEqual({
						article_id: 1,
						title: "Running a Node App",
						body:
							"This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
						votes: 0,
						topic: "coding",
						author: "jessjelly",
						created_at: "2020-11-07",
					});
				});
		});
	});
});
