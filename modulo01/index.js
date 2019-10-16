const express = require('express');

const server = express();

server.use(express.json());

const users = ['Jefferson', 'Lucinéia', 'Jessica', 'Raul'];

function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {

  const user = users[req.params.index];

  if(!user) {
    res.status(404).json({ message: 'User does not exist.'});
  }

  req.user = user;

  return next();
}

//Query params = ?teste=1 (req.query.teste)
//Route params = /users/1 (req.params.id)
//Request body = { "name": "Jefferson", "email": "je.luis.nascimento@hotmail.com" }

server.get('/users', (req, res) => {
  res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  res.json(req.user);
});

server.post('/users',checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  res.json(users);
});

server.listen('3000');