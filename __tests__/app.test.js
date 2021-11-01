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
});
