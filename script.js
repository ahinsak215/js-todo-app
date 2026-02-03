const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

/* EVENTS */
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTodos();
  });
});

/* FUNCTIONS */
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    completed: false,
  });

  input.value = "";
  saveAndRender();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
  saveAndRender();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveAndRender();
}

function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  const updatedText = prompt("Edit task", todo.text);

  if (updatedText && updatedText.trim()) {
    todo.text = updatedText.trim();
    saveAndRender();
  }
}

function getFilteredTodos() {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function renderTodos() {
  list.innerHTML = "";

  const filtered = getFilteredTodos();
  taskCount.textContent = `${filtered.length} tasks`;

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.onclick = () => toggleTodo(todo.id);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTodo(todo.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    actions.append(editBtn, deleteBtn);
    li.append(span, actions);
    list.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

/* INIT */
renderTodos();
