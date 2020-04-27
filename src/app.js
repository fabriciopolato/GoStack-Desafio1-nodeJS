const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

const validateProjectId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({
      error: "Invalid project ID",
    });
  }
  return next();
};

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(
    (repository) => id === repository.id
  );

  const repository = {
    title,
    url,
    techs,
    id,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => id === repository.id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((repository) => id === repository.id);

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
