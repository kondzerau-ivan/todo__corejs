/**
 * Globals
 */

let todos = [];
let users = [];
const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-todo');
const form = document.getElementById('form');
/**
 * Attach Events
 */

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

/**
 * Basic logic
 */

function getUserName(userId) {
  const user = users.find(user => user.id === userId);
  return user.name;
}

function printTodo({id, userId, title, completed}) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = id;
  li.innerHTML = `
  <div class="todo-item-inner">
    <p>${title}</p>
    <p>by <strong>${getUserName(userId)}</strong></p>
  </div>
  `;

  const status = document.createElement('input');
  status.type = 'checkbox';
  status.checked = completed;

  const close = document.createElement('span');
  close.innerHTML = '&times;';
  close.className = 'close';

  li.prepend(status);
  li.append(close);
  todoList.prepend(li);
}

function createUserOption(user) {
  const option = document.createElement('option');
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

/**
 * Event logic
 */

function initApp() {
  Promise.all([getAllTodos(), getAllUsers()]).then(values => {
    [todos, users] = values;

    // Send to HTML

    todos.forEach(todo => printTodo(todo));
    users.forEach(user => createUserOption(user));
  });
}

function handleSubmit(event) {
  event.preventDefault();

  createTodo({
    "userId": Number(form.user.value),
    "title": form.todo.value,
    "completed": false
  });
}

/**
 * Async logic
 */

async function getAllTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data;
}

async function getAllUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}

async function createTodo(todo) {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  });

  const newTodo = await response.json();

  printTodo(newTodo);
}