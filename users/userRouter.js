const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');


const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Error adding user.' })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const newPost = {
    ...req.body,
    postedBy: req.user.name
  }

  Posts.insert(newPost)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Error adding post.' })
    })
});

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error retrieving users.'
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  Users.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: ''})
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'there was an error getting user posts' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  Users.remove(id)
    .then(deleted => {
      res.status(200).json({ message: `user with id of ${id} deleted`})
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'there was an error deleting user' })
    })
});

router.put('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id
  const changes = req.body
  Users.update(id, changes)
    .then(updated => {
      res.status(200).json({ message: `updated user at ${id} with ${changes}` })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'there was an error updating user' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
  Users.getById(id)
    .then(user => {
      if (!user) {
          res.status(400).json({ message: 'Invalid user id.' })
      } else {
          req.user = user
          next()
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Error retrieving user id.' })
    })
}

function validateUser(req, res, next) {
  // do your magic!
  console.log('body: ', req.body)
  const body = req.body
    if (Object.entries(body).length === 0) {
      res.status(400).json({ message: 'Missing user data.' })
    } else if (!body.name) {
      res.status(400).json({ message: 'Missing required name field.' })
    } else {
      next()
    }
}

function validatePost(req, res, next) {
  const body = req.body
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Missing post data.' })
  } else if (!body.text) {
    res.status(400).json({ message: 'Missing required text field.' })
  } else {
    next()
  }
}

module.exports = router;
