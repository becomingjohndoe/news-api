const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
	const { articleData, commentData, topicData, userData } = data;
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS articles;`);
	await db.query(`DROP TABLE IF EXISTS users;`);
	await db.query(`DROP TABLE IF EXISTS topics;`);
	await db.query(
		`CREATE TABLE topics (
      slug SERIAL PRIMARY KEY,
      description VARCHAR
    );
    `
	);
	await db.query(`CREATE TABLE users(
    username SERIAL PRIMARY KEY,
    avatar_url VARCHAR,
    name VARCHAR
  );`);
	await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    body VARCHAR,
    votes INT,
    topic INT REFERENCES topics(slug),
    author INT REFERENCES users(username),
    created_at VARCHAR
  );`);
	await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author INT REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    votes INT,
    created_at INT,
    body VARCHAR
  );`);
	// 1. create tables

	// 2. insert data
};

module.exports = seed;
