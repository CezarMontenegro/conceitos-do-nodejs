const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
   return response.status(400).json({ error: 'Customer not found!'})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if(userAlreadyExists) {
    return response.status(400).json({ error: 'User Already exists!'})
  }

  newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const userTodos = (users.find((user) => user.username === username)).todos;

  return response.json(userTodos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const idTodo = user.todos.find((todo) => todo.id === id);

  if (!idTodo) {
    return response.status(404).json({ error: "Todo not found!"})
  }

  idTodo.title = title;
  idTodo.deadline = new Date(deadline);

  return response.json(idTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;
  const { user } = request;

  const idTodo = user.todos.find(todo => todo.id === id);

  if(!idTodo) {
    return response.status(404).json({ error: "todo not found!"});
  }

  idTodo.done = true;

  return response.json(idTodo); 

});

// app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
//   // Complete aqui
// });

module.exports = app;