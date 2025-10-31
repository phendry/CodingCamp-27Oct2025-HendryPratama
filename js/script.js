let todos = [];
let darkMode = false;

// DOM ELEMENTS
const body = document.getElementById("body");
const toggleMode = document.getElementById("toggleMode");
const taskInput = document.getElementById("taskInput");
const dueInput = document.getElementById("dueInput");
const addBtn = document.getElementById("addBtn");
const todoBody = document.getElementById("todoBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

// ADD TASK
addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const due = dueInput.value;
  if (!task) return alert("Task name cannot be empty!");
  console.log(taskInput)
  if (!due) return alert("Please select a due date!");

  todos.push({ task, due, status: "Pending" });
  taskInput.value = "";
  dueInput.value = "";
  renderTable();
});

// DELETE ALL WITH CONFIRM
deleteAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return;
  showConfirmDialog("Yakin untuk hapus semua task?", () => {
    todos = [];
    renderTable();
  });
});

// LIVE SEARCH
searchInput.addEventListener("input", renderTable);

// FILTER BY STATUS
statusFilter.addEventListener("change", renderTable);

// DARK MODE TOGGLE
toggleMode.addEventListener("click", () => {
  darkMode = !darkMode;
  body.classList.toggle("bg-gray-900");
  body.classList.toggle("text-white");
  headbar.classList.toggle("bg-gray-900");
  toggleMode.classList.toggle("bg-gray-600");
  mainContainer.classList.toggle("bg-gray-700");
  tabletask.classList.toggle("bg-gray-700");
  tabletask.classList.toggle("text-white");
  todoBody.classList.toggle("bg-gray-400");
  header1.classList.toggle("text-white");
  header2.classList.toggle("text-white");
  header3.classList.toggle("text-white");
  header4.classList.toggle("text-white");
  taskInput.classList.toggle("bg-gray-900");
  dueInput.classList.toggle("bg-gray-900");
  searchInput.classList.toggle("bg-gray-900");
  statusFilter.classList.toggle("bg-gray-900");

  
  
  toggleMode.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// RENDER TABLE
function renderTable() {
  const keyword = searchInput.value.toLowerCase();
  const filter = statusFilter.value;

  todoBody.innerHTML = "";

  const filteredTodos = todos.filter(t => {
    const matchText = t.task.toLowerCase().includes(keyword);
    const matchStatus =
      filter === "all" ? true : t.status.toLowerCase() === filter;
    return matchText && matchStatus;
  });

  if (filteredTodos.length === 0) {
    todoBody.innerHTML = `<tr><td colspan="4" class="py-3 text-gray-400">No tasks found</td></tr>`;
  } else {
    filteredTodos.forEach((todo, i) => {
      const tr = document.createElement("tr");
      tr.className = i % 2 ? "bg-gray-50" : "";

      tr.innerHTML = `
        <td class="py-2 px-2">
          <input type="text" value="${todo.task}" 
            class="bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-400 ${
              todo.status === "Completed" ? "line-through text-gray-400" : ""
            }"
            onchange="editTask(${todos.indexOf(todo)}, this.value)">
        </td>
        <td>${todo.due}</td>
        <td>
          <span class="px-2 py-1 text-xs rounded-full ${
            todo.status === "Completed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }">${todo.status}</span>
        </td>
        <td class="flex justify-center gap-2 py-2">
          <button onclick="markDone(${todos.indexOf(
            todo
          )})" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">✔️</button>
          <button onclick="markPending(${todos.indexOf(
            todo
          )})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">↩️</button>
          <button onclick="deleteTask(${todos.indexOf(
            todo
          )})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">🗑️</button>
        </td>
      `;
      todoBody.appendChild(tr);
    });
  }

  updateStats();
}

// EDIT TASK INLINE
function editTask(index, newText) {
  todos[index].task = newText;
  renderTable();
}

// MARK DONE / PENDING
function markDone(index) {
  todos[index].status = "Completed";
  renderTable();
}

function markPending(index) {
  todos[index].status = "Pending";
  renderTable();
}

// DELETE TASK WITH CONFIRM
function deleteTask(index) {
  showConfirmDialog("Yakin untuk hapus task ini?", () => {
    todos.splice(index, 1);
    renderTable();
  });
}

// UPDATE STATISTICS
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.status === "Completed").length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
  progressPercent.textContent = progress + "%";
  progressBar.style.width = progress + "%";
}

// CUSTOM CONFIRM DIALOG
function showConfirmDialog(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50";

  const box = document.createElement("div");
  box.className =
    "bg-white rounded-xl p-6 w-80 text-center shadow-lg space-y-4";
  box.innerHTML = `
    <p class="text-gray-800 font-medium">${message}</p>
    <div class="flex justify-center gap-3">
      <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Yes</button>
      <button class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const [yesBtn, cancelBtn] = box.querySelectorAll("button");
  yesBtn.onclick = () => {
    onConfirm();
    overlay.remove();
  };
  cancelBtn.onclick = () => overlay.remove();
}
