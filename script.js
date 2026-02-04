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
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  li.classList.add("deleting");

  setTimeout(() => {
    li.classList.add("fade-out");
  }, 50);

  setTimeout(() => {
    todos = todos.filter((todo) => todo.id !== id);
    saveAndRender();
  }, 200);
}

function startEdit(li, todo) {
  if (document.querySelector("li.editing")) return;

  li.classList.add("editing");

  const span = li.querySelector("span");
  const originalText = todo.text;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = originalText;
  editInput.className = "edit-input";

  li.replaceChild(editInput, span);
  editInput.focus();

  function save() {
    const newText = editInput.value.trim();
    if (newText) {
      todo.text = newText;
      saveAndRender();
    } else {
      cancel();
    }
  }

  function cancel() {
    li.classList.remove("editing");
    li.replaceChild(span, editInput);
  }

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  });

  editInput.addEventListener("blur", save);
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
    li.dataset.id = todo.id;

    if (todo.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.onclick = () => toggleTodo(todo.id);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => startEdit(li, todo);

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
