document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  init();
}

// Si tu testes dans le navigateur (sans Cordova), décommente la ligne suivante :
// window.addEventListener('load', init);

let tasks = [];
let currentFilter = 'all';

function init() {
  loadTasks();
  renderTasks();

  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
  });

  document.getElementById('clearDone').addEventListener('click', clearDone);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      currentFilter = this.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderTasks();
    });
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text: text,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = '';
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.done);
  if (currentFilter === 'done')   filtered = tasks.filter(t => t.done);

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-btn' + (task.done ? ' checked' : '');
    checkBtn.textContent = task.done ? '✓' : '';
    checkBtn.addEventListener('click', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // Compteur
  const remaining = tasks.filter(t => !t.done).length;
  document.getElementById('counter').textContent = remaining + ' tâche(s) restante(s)';
}

// Sauvegarde dans localStorage (fonctionne sur Android avec Cordova)
function saveTasks() {
  localStorage.setItem('sentasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('sentasks');
  if (saved) tasks = JSON.parse(saved);
}