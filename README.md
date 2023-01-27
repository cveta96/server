# Store manager

## _Server documentation_

## Tech

Server uses a number of dependencies:

- [Express](https://expressjs.com/) - Minimal and flexible Node.js web application framework.
- [Express-validator](https://express-validator.github.io/docs/) - Set of express.js middlewares that wraps validator.js validator and sanitizer functions.
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.
- [Mongoose](https://mongoosejs.com/) - A straight-forward, schema-based solution to model your application data
- [Node](https://nodejs.org/en/) - evented I/O for the backend
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.
- [Cors](https://www.npmjs.com/package/cors) - A node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [Cookie-parser](https://www.npmjs.com/package/cookie-parser) - Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

## Installation

Server requires [Node.js](https://nodejs.org/)to run.

Before instalation create `.env` file in server directory and define these:

```sh
cd server
touch .env
PORT = {Port}
MONGO_DB = {mongodb+srv://{Username}:{Password}@{MongoDBAdress}/?retryWrites=true&w=majority}
JWT_ATS = {Suggested key size 256bits}
JWT_RTS = {Suggested key size 256bits}
```

Install the dependencies and devDependencies and start the server.

```sh
npm i
npm run server
```

## Routes

Server routes can be found in `http://localhost:{PORT}/api/{ROUTE}`

### Auth routes

@route `POST auth/login`
@desc: Login user and get jwt
@access: `Public`

Post request example:

- Header: `Content-Type : aplication/json`

- Body:

```js
{
    username: "test",
    password: "test1234"
}
```

### _Responses:_

1. `200` status:

- HttpOnly jwt Cookie: `jwt={RefreshToken}; Path={/}; HttpOnly; Expires={TimeWhenItExpires}`
- Body: `{"accessToken":"{AccessToken}"}`

2. `400` status:

- Body: `{"errors": [{"msg":"Invalid value","param":"{ParamWhichIsMissing}","location":"body"}]}`

3. `401` status:

- Body: `{"message":"Invalid credentials."}`

4. `404` status:

- Body: `{"message":"Username not found."}`

5. `500` status:

- Body: `{"message":"Server error."}`
