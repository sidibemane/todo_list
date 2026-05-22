let tasks = [];
let currentFilter = 'all';

function init() {
  loadTasks();
  renderTasks();

  document.getElementById('addBtn').onclick = addTask;

  document.getElementById('taskInput').onkeypress = function(e) {
    if (e.key === 'Enter') addTask();
  };

  document.getElementById('clearDone').onclick = clearDone;

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.onclick = function() {
      currentFilter = this.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
      renderTasks();
    };
  });
}

function addTask() {
  var input = document.getElementById('taskInput');
  var text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text: text, done: false });
  saveTasks();
  renderTasks();
  input.value = '';
}

function toggleTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
      break;
    }
  }
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

function clearDone() {
  tasks = tasks.filter(function(t) { return !t.done; });
  saveTasks();
  renderTasks();
}

function renderTasks() {
  var list = document.getElementById('taskList');
  list.innerHTML = '';

  var filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(function(t) { return !t.done; });
  if (currentFilter === 'done')   filtered = tasks.filter(function(t) { return t.done; });

  filtered.forEach(function(task) {
    var li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    var checkBtn = document.createElement('button');
    checkBtn.className = task.done ? 'check-btn checked' : 'check-btn';
    checkBtn.textContent = task.done ? '✓' : '';
    checkBtn.type = 'button';
    (function(id) {
      checkBtn.onclick = function() { toggleTask(id); };
    })(task.id);

    var span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    var delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '';
    delBtn.type = 'button';
    (function(id) {
      delBtn.onclick = function() { deleteTask(id); };
    })(task.id);

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  var remaining = tasks.filter(function(t) { return !t.done; }).length;
  document.getElementById('counter').textContent = remaining + ' tâche(s) restante(s)';
}

function saveTasks() {
  try {
    localStorage.setItem('todolist', JSON.stringify(tasks));
  } catch(e) {}
}

function loadTasks() {
  try {
    var saved = localStorage.getItem('todolist');
    if (saved) tasks = JSON.parse(saved);
  } catch(e) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}