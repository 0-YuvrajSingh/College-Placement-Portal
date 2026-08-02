const form = document.getElementById("todoForm");
const input = document.getElementById("todo");
const todoList = document.getElementById("todoList");

const tasks = [];

function addTask(text) {
    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);

    if(index === -1) return;

    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
}

function renderTasks() {
    todoList.innerHTML = "";

    for(const task of tasks) {
        todoList.appendChild(createTaskElement(task));
    }
}

function createTaskElement(task) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    span.classList.toggle("completed", task.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });


    li.append(checkbox, span, deleteButton);
    
    return li;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text =  input.value.trim();
    if (!text) return;

    addTask(text);

    input.value = "";
    input.focus();
});


function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));

        if (!savedTasks) return;

        tasks.push(...savedTasks);
        renderTasks();
    } catch {
        localStorage.removeItem("tasks");
    }
}

loadTasks();