
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const allTaskCount = document.getElementById("allTaskCount");
const sidebarCompletedCount = document.getElementById("sidebarCompletedCount");

const completedEmpty = document.getElementById("completedEmpty");
const currentDate = document.getElementById("currentDate");
const greeting = document.getElementById("greeting");

const navItems = document.querySelectorAll(".nav-item");

let currentView = "home";


// =========================
// LOAD SAVED TASKS
// =========================

let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];


// =========================
// SAVE TASKS
// =========================

function saveTasks() {
    localStorage.setItem("taskFlowTasks", JSON.stringify(tasks));
}


// =========================
// DATE AND GREETING
// =========================

function showDate() {

    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    const hour = today.getHours();

    if (hour < 12) {
        greeting.textContent = "Good Morning. ☀️";
    } else if (hour < 17) {
        greeting.textContent = "Good Afternoon. ☀️";
    } else if (hour < 21) {
        greeting.textContent = "Good Evening. 🌇";
    } else {
        greeting.textContent = "Good Night. 🌙";
    }
}


// =========================
// RENDER TASKS
// =========================

function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    let pending = tasks.filter(task => !task.completed);
    let completed = tasks.filter(task => task.completed);


    // HOME VIEW
    if (currentView === "home") {

        // Show all pending and completed tasks
    }


    // ALL TASKS VIEW
    else if (currentView === "all") {

        // Show all pending and completed tasks
    }


    // COMPLETED VIEW
    else if (currentView === "completed") {

        pending = [];
    }


    // Update counters
    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;

    allTaskCount.textContent = tasks.length;
    sidebarCompletedCount.textContent =
        tasks.filter(task => task.completed).length;


    // Update labels
    document.querySelector(".pending-panel .count-label").textContent =
        `${pending.length} pending`;

    document.querySelector(".completed-panel .count-label").textContent =
        `${completed.length} completed`;


    // Empty pending message
    if (pending.length === 0) {

        pendingTasks.innerHTML = `
            <p class="empty-message">
                🎉 No pending tasks. You're all caught up!
            </p>
        `;
    }


    // Completed empty message
    if (completed.length === 0) {

        completedEmpty.style.display = "block";

    } else {

        completedEmpty.style.display = "none";
    }


    // Display pending tasks
    pending.forEach(task => {
        createTaskElement(task, pendingTasks);
    });


    // Display completed tasks
    completed.forEach(task => {
        createTaskElement(task, completedTasks);
    });
}


// =========================
// CREATE TASK ELEMENT
// =========================

function createTaskElement(task, container) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }


    // Task content
    const taskContent = document.createElement("div");

    taskContent.className = "task-content";


    // Task text
    const taskText = document.createElement("span");

    taskText.textContent = task.text;


    // Task timestamp
    const taskTime = document.createElement("small");

    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Added: ${task.addedAt} • Completed: ${task.completedAt}`;

    } else {

        taskTime.textContent =
            `Added: ${task.addedAt}`;
    }


    taskContent.appendChild(taskText);
    taskContent.appendChild(taskTime);


    // Buttons container
    const buttons = document.createElement("div");

    buttons.className = "task-buttons";


    // Complete button
    const completeBtn = document.createElement("button");

    completeBtn.className = "complete-btn";

    completeBtn.textContent = task.completed
        ? "↩ Undo"
        : "✓ Complete";

    completeBtn.addEventListener("click", () => {

        task.completed = !task.completed;

        if (task.completed) {

            task.completedAt = new Date().toLocaleString("en-IN");

        } else {

            task.completedAt = null;
        }

        saveTasks();
        renderTasks();
    });


    // Edit button
    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";
    editBtn.textContent = "✏ Edit";

    editBtn.addEventListener("click", () => {

        startInlineEdit(task, taskItem);
    });


    // Delete button
    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑 Delete";

    deleteBtn.addEventListener("click", () => {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete) {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();
        }
    });


    buttons.appendChild(completeBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);


    taskItem.appendChild(taskContent);
    taskItem.appendChild(buttons);

    container.appendChild(taskItem);
}


// =========================
// INLINE EDIT
// =========================

function startInlineEdit(task, taskItem) {

    const taskContent = taskItem.querySelector(".task-content");

    const oldText = task.text;

    taskContent.innerHTML = "";


    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.value = oldText;
    editInput.className = "edit-input";


    const saveButton = document.createElement("button");

    saveButton.textContent = "Save";
    saveButton.className = "save-edit-btn";


    const cancelButton = document.createElement("button");

    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-edit-btn";


    const editButtons = document.createElement("div");

    editButtons.className = "edit-buttons";

    editButtons.appendChild(saveButton);
    editButtons.appendChild(cancelButton);


    taskContent.appendChild(editInput);
    taskContent.appendChild(editButtons);


    editInput.focus();
    editInput.select();


    // Save edit
    saveButton.addEventListener("click", () => {

        const newText = editInput.value.trim();

        if (newText === "") {

            alert("Task cannot be empty.");
            editInput.focus();
            return;
        }

        task.text = newText;

        saveTasks();
        renderTasks();
    });


    // Cancel edit
    cancelButton.addEventListener("click", () => {

        renderTasks();
    });


    // Keyboard shortcuts
    editInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            saveButton.click();
        }

        if (event.key === "Escape") {
            cancelButton.click();
        }
    });
}


// =========================
// ADD TASK
// =========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");
        return;
    }


    const newTask = {

        id: Date.now(),
        text: text,
        completed: false,
        addedAt: new Date().toLocaleString("en-IN"),
        completedAt: null
    };


    tasks.push(newTask);

    saveTasks();
    renderTasks();


    taskInput.value = "";
    taskInput.focus();
}


// =========================
// ADD TASK BUTTON
// =========================

addTaskBtn.addEventListener("click", addTask);


// =========================
// ENTER KEY
// =========================

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }
});


// =========================
// SIDEBAR NAVIGATION
// =========================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");


        if (item.textContent.includes("Home")) {

            currentView = "home";

        } else if (item.textContent.includes("All Tasks")) {

            currentView = "all";

        } else if (item.textContent.includes("Completed")) {

            currentView = "completed";
        }


        renderTasks();
    });
});


// =========================
// START APP
// =========================

showDate();
renderTasks();