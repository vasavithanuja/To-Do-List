// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value.trim();

        if (!name || !email || !password) {
            alert("Please fill all fields.");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem(
            "taskflowUser",
            JSON.stringify(user)
        );

        alert("Account created successfully!");

        window.location.href = "login.html";
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        const savedUser =
            JSON.parse(localStorage.getItem("taskflowUser"));

        if (!savedUser) {
            alert("Please register first.");
            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            localStorage.setItem(
                "taskflowLoggedIn",
                "true"
            );

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid email or password.");

        }
    });
}


// ===============================
// GET TASKS
// ===============================

function getTasks() {

    return JSON.parse(
        localStorage.getItem("taskflowTasks")
    ) || [];
}


// ===============================
// ADD TASK
// ===============================

const addTaskForm =
    document.getElementById("addTaskForm");

if (addTaskForm) {

    addTaskForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const title =
            document.getElementById("taskTitle").value.trim();

        const description =
            document.getElementById("taskDescription").value.trim();

        const date =
            document.getElementById("taskDate").value;

        const priority =
            document.getElementById("taskPriority").value;

        if (!title || !date) {

            alert(
                "Please enter task title and due date."
            );

            return;
        }

        const tasks = getTasks();

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            date: date,

            priority: priority,

            completed: false
        };

        tasks.push(newTask);

        localStorage.setItem(
            "taskflowTasks",
            JSON.stringify(tasks)
        );

        alert("Task added successfully!");

        window.location.href = "dashboard.html";
    });
}


// ===============================
// DASHBOARD
// ===============================

if (document.getElementById("taskList")) {

    showActiveTasks();
}


// ===============================
// UPDATE COUNTS
// ===============================

function updateCounts() {

    const tasks = getTasks();

    const total =
        document.getElementById("totalTasks");

    const completed =
        document.getElementById("completedTasks");

    if (total) {

        total.textContent =
            tasks.length;
    }

    if (completed) {

        completed.textContent =
            tasks.filter(function (task) {

                return task.completed === true;

            }).length;
    }
}


// ===============================
// ACTIVE TASKS
// ===============================

function showActiveTasks() {

    const activeTab =
        document.getElementById("activeTab");

    const completedTab =
        document.getElementById("completedTab");

    if (activeTab) {

        activeTab.classList.add("active");
    }

    if (completedTab) {

        completedTab.classList.remove("active");
    }

    const activeTasks =
        getTasks().filter(function (task) {

            return task.completed === false;

        });

    displayTasks(activeTasks);
}


// ===============================
// COMPLETED TASKS
// ===============================

function showCompletedTasks() {

    const activeTab =
        document.getElementById("activeTab");

    const completedTab =
        document.getElementById("completedTab");

    if (activeTab) {

        activeTab.classList.remove("active");
    }

    if (completedTab) {

        completedTab.classList.add("active");
    }

    const completedTasks =
        getTasks().filter(function (task) {

            return task.completed === true;

        });

    displayTasks(completedTasks);
}


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks(tasks) {

    const taskList =
        document.getElementById("taskList");

    if (!taskList) {
        return;
    }

    updateCounts();

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-task">
                <span>📝</span>
                <p>No tasks here.</p>
            </div>
        `;

        return;
    }

    tasks.forEach(function (task) {

        const card =
            document.createElement("div");

        card.className = "task-card";

        if (task.completed) {

            card.classList.add("completed-card");
        }

        card.innerHTML = `

            <div class="task-check">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

            </div>

            <div class="task-content">

                <h3>
                    ${escapeHtml(task.title)}
                </h3>

                <p>
                    Due: ${escapeHtml(task.date)}
                </p>

                <p>
                    Priority:
                    ${escapeHtml(task.priority)}
                </p>

                ${
                    task.description
                    ?
                    `<p>${escapeHtml(task.description)}</p>`
                    :
                    ""
                }

            </div>

            <button
                class="edit-btn"
                onclick="editTask(${task.id})">

                ✏️

            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">

                🗑️

            </button>
        `;

        taskList.appendChild(card);
    });
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ===============================
// COMPLETE / UNCOMPLETE
// ===============================

function toggleTask(id) {

    const tasks = getTasks();

    tasks.forEach(function (task) {

        if (task.id === id) {

            task.completed =
                !task.completed;
        }
    });

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

    showActiveTasks();
}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );

    if (!confirmDelete) {
        return;
    }

    const tasks =
        getTasks().filter(function (task) {

            return task.id !== id;

        });

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

    showActiveTasks();
}


// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    window.location.href =
        "edit-task.html?id=" + id;
}


// ===============================
// LOAD EDIT TASK
// ===============================

const editTaskForm =
    document.getElementById("editTaskForm");

if (editTaskForm) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const taskId =
        Number(params.get("id"));

    const tasks = getTasks();

    const task =
        tasks.find(function (item) {

            return item.id === taskId;

        });

    if (!task) {

        alert("Task not found!");

        window.location.href =
            "dashboard.html";

    } else {

        document.getElementById(
            "editTaskTitle"
        ).value = task.title;

        document.getElementById(
            "editTaskDescription"
        ).value = task.description;

        document.getElementById(
            "editTaskDate"
        ).value = task.date;

        document.getElementById(
            "editTaskPriority"
        ).value = task.priority;


        editTaskForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                task.title =
                    document.getElementById(
                        "editTaskTitle"
                    ).value.trim();

                task.description =
                    document.getElementById(
                        "editTaskDescription"
                    ).value.trim();

                task.date =
                    document.getElementById(
                        "editTaskDate"
                    ).value;

                task.priority =
                    document.getElementById(
                        "editTaskPriority"
                    ).value;

                localStorage.setItem(
                    "taskflowTasks",
                    JSON.stringify(tasks)
                );

                alert(
                    "Task updated successfully!"
                );

                window.location.href =
                    "dashboard.html";
            }
        );
    }
}


// ===============================
// PROFILE
// ===============================

if (document.getElementById("profileName")) {

    const user =
        JSON.parse(
            localStorage.getItem("taskflowUser")
        );

    if (user) {

        document.getElementById(
            "profileName"
        ).textContent = user.name;

        document.getElementById(
            "profileEmail"
        ).textContent = user.email;

        document.getElementById(
            "accountName"
        ).textContent = user.name;

        document.getElementById(
            "accountEmail"
        ).textContent = user.email;
    }
}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    localStorage.removeItem(
        "taskflowLoggedIn"
    );

    window.location.href =
        "index.html";
}