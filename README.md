# NC News API - Back End

A RESTful news API that serves data from the Northcoders news database.
using Postgres to interact with the PSQL database. Infromation can be accessed
for articles, comments, users and topics using GET, POST, PATCH and DELETE methods
via the endpoints detailed below.

## Getting started

Clone the project

```bash
  git clone https://link-to-project
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`

### Environment Variables

Create two .env files: `.env.development` and `.env.test`

To run this project, you will need to add the following environment variables to your .env files

_/.env.development_

`PGADATABASE=nc_news`

_/.env.test_

`PGADATABASE=nc_news_test`

### Run Locally

Go to the project directory

```bash
cd nc-news
```

Install dependencies

```bash
npm install
```

This will install the following packages:

- dotenv
- express
- pg
- pg-format
  and the developer dependencies for testing.

- jest
- jest-sorted
- superagent
- supertest

Setup the database

```bash
npm run setup-dbs
```

Seed the database

```bash
npm run seed
```

_if the seed was unsccesful an error will be logged in the terminal._

Start the server

```bash
npm run start
```

The server will now be accessible from _http://localhost/9090_

## Demo

https://news-nc-api.herokuapp.com/

## API Reference

### Get all endpoints

```http
  GET /api
```

Fetches all endpoints in JSON format.

### Get all articles

```http
GET /api/articles
```

| Queries   | Type     | Description                                                |
| :-------- | :------- | :--------------------------------------------------------- |
| `limit`   | `number` | Limit number of articles displayed on each page            |
| `p`       | `number` | The page number to load                                    |
| `topic`   | `string` | Filters results by topic                                   |
| `sort_by` | `string` | Can be sorted by title, topic, author, created_at or votes |
| `order`   | `string` | Order of the results                                       |

### Get article by ID

```http
GET /api/articles/:article_id
```

| Paramters    | Type     | Description            |
| :----------- | :------- | :--------------------- |
| `article_id` | `number` | ID of article to fetch |

### Patch votes for article by ID

```http
PATCH /api/articles/:article_id
```

| Paramters    | Type     | Description            |
| :----------- | :------- | :--------------------- |
| `article_id` | `number` | ID of article to patch |

Increments or decrements the votes on the provided article ID.

body

```javascript
{
	inc_votes: 1;
}
```

### Get comments by article ID

```http
GET /api/articles/:article_id/comments
```

| Paramters    | Type     | Description            |
| :----------- | :------- | :--------------------- |
| `article_id` | `number` | ID of article to fetch |

### Post comment at article ID

```http
POST /api/articles/:article_id/comments
```

| Paramters    | Type     | Description            |
| :----------- | :------- | :--------------------- |
| `article_id` | `number` | ID of article to fetch |

body

```javascript
{ username: `user`, body: `comment` }
```

### Delete comment

```http
/api/comments/:comment_id
```

| Paramters    | Type     | Description             |
| :----------- | :------- | :---------------------- |
| `comment_id` | `number` | ID of comment to delete |

### Patch votes on comment

```http
/api/comments/:comment_id
```

| Paramters    | Type     | Description            |
| :----------- | :------- | :--------------------- |
| `comment_id` | `number` | ID of comment to patch |

Increments or decrements the votes on the provided comment ID.

body

```javascript
{
	inc_votes: 1;
}
```

### GET all users

```http
GET /api/users
```

### Get user by username

```http
GET /api/users/:username
```

| Paramters  | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `username` | `string` | username of user to fetch |

### Get all topics

```http
GET /api/topics
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
