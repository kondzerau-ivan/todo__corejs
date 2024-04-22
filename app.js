(function () {
  //
  // Globals
  //_____________________________________________

  let todos = [];
  let users = [];
  const todoList = document.getElementById('todo-list');
  const userSelect = document.getElementById('user-todo');
  const form = document.getElementById('form');

  //
  // Attach Events
  //_____________________________________________

  /**
   * Add Event Listener for App init
   */

  document.addEventListener('DOMContentLoaded', initApp);
  form.addEventListener('submit', handleSubmit);

  //
  // Basic logic
  //_____________________________________________

  /**
   * Get User Name by it's userId
   */

  function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
  }

  /**
   * Print TODO in HTML
   */

  function printTodo({ id, userId, title, completed }) {
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
    status.addEventListener('change', handleTodoChange);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleTodoClose);

    li.prepend(status);
    li.append(close);
    todoList.prepend(li);
  }

  /**
   * Remove TODO from DOM
   */

  function removeTodo(todoId) {
    todos = todos.filter(todo => todo.todoId != todoId);

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo.querySelector('input').removeEventListener('change', handleTodoChange);
    todo.querySelector('.close').removeEventListener('click', handleTodoClose);

    todo.remove();
  }

  /**
   * Create Users Options
   */

  function createUserOption(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
  }

  /**
   * Throw alert with Error
   */

  function alertError(error) {
    alert(error.message);
  }

  //
  // Event logic
  //_____________________________________________

  /**
   * Init App with Todos and Users
   */

  function initApp() {
    // Get Todos and Users
    Promise.all([getAllTodos(), getAllUsers()]).then(values => {
      [todos, users] = values;

      // Send to HTML
      todos.forEach(todo => printTodo(todo));
      users.forEach(user => createUserOption(user));
    });
  }

  /**
   * Form Submit Event
   */

  function handleSubmit(event) {
    event.preventDefault();

    createTodo({
      "userId": Number(form.user.value),
      "title": form.todo.value,
      "completed": false
    });
  }

  /**
   * Input Change Status Event
   */

  function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;
    toggleTodoComplete(todoId, completed);
  }

  /**
   * Close button Handle Click
   */

  function handleTodoClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }

  //
  // Async logic
  //_____________________________________________

  /**
   * Get Todos from server
   */

  async function getAllTodos() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=7');
      const data = await response.json();
      return data;
    } catch (error) {
      alertError(error);
    }
  }

  /**
   * Get Users from server
   */

  async function getAllUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
      const data = await response.json();
      return data;
    } catch (error) {
      alertError(error);
    }
  }

  /**
   * Set new Todo
   */

  async function createTodo(todo) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos',
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        }
      );

      const newTodo = await response.json();

      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  /**
   * Toggle Todo Status
   */

  async function toggleTodoComplete(todoId, completed) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to connect with the server! Please tyr later.');
      }
    } catch (error) {
      alertError(error);
    }
  }

  /**
   * Delete Todo from Server
   */

  async function deleteTodo(todoId) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        }
      );
      if (response.ok) {
        // remove Todo from DOM
        removeTodo(todoId);
      }
    } catch (error) {
      alertError(error);
    }
  }
})()