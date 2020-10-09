const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title ? repositories.filter(project => project.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const project = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(project);

  return response.status(201).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs, likes } = request.body;
  const { id } = request.params;

  const rep_index = repositories.findIndex(project => {
    return project.id === id;
  });

  if (rep_index === -1)
    return response.status(400).json({ error: "ID not found" });

  const project = { id, title, url, techs, likes: repositories[rep_index].likes };
  repositories[rep_index] = project;

  return response.status(200).json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const rep_index = repositories.findIndex(project => {
    return project.id === id;
  });

  if (rep_index === -1)
    return response.status(400).send({ "error": "ID not found" });

  repositories.splice(rep_index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const rep_index = repositories.findIndex(project => {
    return project.id === id;
  });

  if (rep_index === -1)
    return response.status(400).send({ "error": "ID not found" });

  repositories[rep_index].likes += 1;

  return response.json(repositories[rep_index]);
});

module.exports = app;
