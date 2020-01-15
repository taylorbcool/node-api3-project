const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter')

const server = express();

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date(Date.now())
    console.log(`${req.method} method made to ${req.originalUrl} at ${timestamp.toLocaleTimeString('en-US')}`)
    next()
}

module.exports = server;
