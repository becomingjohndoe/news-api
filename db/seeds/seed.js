const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
	const { articleData, commentData, topicData, userData } = data;
	// drop tables
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS articles;`);
	await db.query(`DROP TABLE IF EXISTS users;`);
	await db.query(`DROP TABLE IF EXISTS topics;`);
	// create tables
	await db.query(
		`CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR
    );
    `
	);
	await db.query(`CREATE TABLE users(
    username VARCHAR PRIMARY KEY,
    avatar_url VARCHAR,
    name VARCHAR
  );`);
	await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    body VARCHAR,
    votes INT DEFAULT 0,
    topic VARCHAR REFERENCES topics(slug),
    author VARCHAR REFERENCES users(username),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
  );`);
	await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR
  );`);
	// 2. insert data
};

module.exports = seed;
