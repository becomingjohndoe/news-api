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
      description VARCHAR NOT NULL
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
    title VARCHAR NOT NULL,
    body VARCHAR NOT NULL,
    votes INT DEFAULT 0,
    topic VARCHAR REFERENCES topics(slug),
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT NOW()
  );`);
	await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    votes INT NOT NULL DEFAULT 0,
    body VARCHAR,
    created_at TIMESTAMP DEFAULT NOW());`);
	// 2. insert data
	const topicsQuery = format(
		`INSERT INTO topics
      (slug, description)
    VALUES
    %L
    RETURNING*;`,
		topicData.map((t) => [t.slug, t.description])
	);
	await db.query(topicsQuery);
	const usersQuery = format(
		`INSERT INTO users
      (username, name, avatar_url)
    VALUES
    %L
    RETURNING*;`,
		userData.map((u) => [u.username, u.name, u.avatar_url])
	);
	await db.query(usersQuery);
	const articlesQuery = format(
		`INSERT INTO articles
      (title, topic, author, body, created_at, votes)
    VALUES
    %L
    RETURNING*;`,
		articleData.map((a) => [
			a.title,
			a.topic,
			a.author,
			a.body,
			a.created_at,
			a.votes,
		])
	);
	await db.query(articlesQuery);
	const commentsQuery = format(
		`INSERT INTO comments
      (body, votes, author, article_id, created_at)
    VALUES
    %L
    RETURNING*;`,
		commentData.map((c) => [
			c.body,
			c.votes,
			c.author,
			c.article_id,
			c.created_at,
		])
	);
	await db.query(commentsQuery);
};

module.exports = { seed };
