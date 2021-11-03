const db = require("../db/connection");
const { isUser } = require("../utils/isUser");

afterAll(() => db.end());

describe("isUer()", () => {
	test("should return true if user exists in DB", async () => {
		expect(await isUser("butter_bridge")).toBe(true);
	});
	test("should return false if user does not exist in DB", async () => {
		expect(await isUser("notauser")).toBe(false);
	});
	describe("ERRORS", () => {
		test("should return false if passed empty string", async () => {
			expect(await isUser("")).toBe(false);
		});
		test("should return false if passed type not of String", async () => {
			expect(await isUser(999)).toBe(false);
		});
	});
});
