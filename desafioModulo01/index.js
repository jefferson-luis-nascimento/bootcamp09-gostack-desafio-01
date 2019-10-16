const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let counterRequisitions = 0;

function addCounterRequisitions(req, res, next) {
  counterRequisitions += 1;
  console.log(counterRequisitions);

  return next();
}

function checkJsonIsValid(req, res, next ) {
  const { id, title } = req.body;

  if(!id || !title) {
    return res.status(400).json({ error: 'Invalid JSON, Verify fields "id" and "title"' });
  }

  const project = {
    id,
    title,
    tasks: []
  }

  req.project = project;

  return next();
}

function checkIfCanCreate(req, res, next) {
  const project = projects.find(proj => proj.id === req.project.id) ;

  if(project) {
    return res.status(400).json({ error: `Project ${project.id} - ${project.title} already exists.` });
  }

  return next();
}

function checkIfProjectAlreadyExists(req, res, next) {
  const project = projects.find(proj => proj.id === req.params.id) ;

  if(!project) {
    return res.status(404).json({ error: `Project not found.` });
  }

  req.project = project;

  return next();
}

server.get('/projects', addCounterRequisitions, (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', addCounterRequisitions, checkIfProjectAlreadyExists, 
(req, res) => {
  return res.json(req.project);
});

server.post('/projects/:id/tasks', addCounterRequisitions, checkIfProjectAlreadyExists, 
(req, res) => {

  const { id } = req.params;

  const project = projects.find(proj => proj.id === id);

  project.tasks.push(req.body.title);

  return res.json(project);

});

server.post('/projects', addCounterRequisitions, checkJsonIsValid, checkIfCanCreate, 
(req, res) => {
  projects.push(req.project);

  return res.json(req.project);
});

server.put('/projects/:id', addCounterRequisitions, checkIfProjectAlreadyExists, 
(req, res) => {

  const { title } = req.body;
  const { id } = req.project;

  projects.find(proj => proj.id === id).title = title

  const project = projects.find(proj => proj.id === id);

  return res.json(project);
});

server.delete('/projects/:id', addCounterRequisitions, checkIfProjectAlreadyExists, 
(req, res) => {

  const { id } = req.project;

  projects.splice(projects.findIndex(proj => proj.id === id), 1);

  return res.send();
});

server.listen(3000);