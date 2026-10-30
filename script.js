/* ==========================================================================
   STUDENT TASK MANAGER - JAVASCRIPT LOGIC
   Beginner-Friendly Vanilla JavaScript using Local Storage
   ========================================================================== */

// ---------------------------------------------------------------------------
// 1. CONSTANTS & APPLICATION STATE
// ---------------------------------------------------------------------------
// The key name used to store tasks in the browser's localStorage
const STORAGE_KEY = "student_task_manager_data";

// Application State
// tasks: array of task objects
// currentFilter: 'all' | 'pending' | 'completed'
let tasks = [];
let currentFilter = "all";

// ---------------------------------------------------------------------------
// 2. DOM ELEMENT SELECTORS
// Grab elements from the HTML using their unique IDs
// ---------------------------------------------------------------------------
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const emptyStateDesc = document.getElementById("emptyStateDesc");
const sampleDataBtn = document.getElementById("sampleDataBtn");
const currentDateText = document.getElementById("currentDateText");

// Dashboard counter elements
const totalTasksCount = document.getElementById("totalTasksCount");
const pendingTasksCount = document.getElementById("pendingTasksCount");
const completedTasksCount = document.getElementById("completedTasksCount");
const completionRateText = document.getElementById("completionRateText");
const progressBarFill = document.getElementById("progressBarFill");

// Filter tab buttons & badge counts
const filterButtons = document.querySelectorAll(".filter-tab");
const countBadgeAll = document.getElementById("countBadgeAll");
const countBadgePending = document.getElementById("countBadgePending");
const countBadgeCompleted = document.getElementById("countBadgeCompleted");

// ---------------------------------------------------------------------------
// 3. INITIALIZATION FUNCTION
// Runs automatically when the webpage is loaded
// ---------------------------------------------------------------------------
function init() {
  // Display the current formatted date in the header
  displayCurrentDate();

  // Load existing tasks from the browser's localStorage
  loadTasksFromStorage();

  // If this is the user's first time visiting and no tasks exist, load demo tasks
  if (tasks.length === 0) {
    loadDefaultSampleTasks();
  }

  // Setup all user interaction event listeners (form submit, filters, etc.)
  setupEventListeners();

  // Render the initial UI
  renderApp();
}

// ---------------------------------------------------------------------------
// 4. LOCAL STORAGE HELPER FUNCTIONS
// Handles saving and retrieving data from browser memory
// ---------------------------------------------------------------------------

/**
 * Loads tasks from localStorage and parses JSON string into an array
 */
function loadTasksFromStorage() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      tasks = JSON.parse(storedData);
    } else {
      tasks = [];
    }
  } catch (error) {
    console.error("Error reading tasks from LocalStorage:", error);
    tasks = [];
  }
}

/**
 * Saves current tasks array into localStorage as a JSON string
 */
function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to LocalStorage:", error);
  }
}

// ---------------------------------------------------------------------------
// 5. EVENT LISTENERS SETUP
// Connects buttons and forms to JavaScript functions
// ---------------------------------------------------------------------------
function setupEventListeners() {
  // Listen for the "Add Task" form submission
  taskForm.addEventListener("submit", handleAddTask);

  // Listen for filter tab clicks (All, Pending, Completed)
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.getAttribute("data-filter");
      handleFilterChange(selectedFilter);
    });
  });

  // Listen for clicking the "Sample Tasks" helper button
  if (sampleDataBtn) {
    sampleDataBtn.addEventListener("click", () => {
      loadDefaultSampleTasks();
      renderApp();
    });
  }
}

// ---------------------------------------------------------------------------
// 6. TASK CRUD ACTIONS (Create, Read, Update, Delete)
// ---------------------------------------------------------------------------

/**
 * Handles adding a new task when the student submits the form
 * @param {Event} event - The form submit event
 */
function handleAddTask(event) {
  // Prevent default page refresh on form submission
  event.preventDefault();

  // Get trimmed task title and selected priority
  const title = taskInput.value.trim();
  const priority = prioritySelect.value;

  // Basic validation check
  if (!title) {
    alert("Please enter a task name.");
    return;
  }

  // Create a new task object
  const newTask = {
    id: Date.now().toString(), // unique timestamp ID
    title: title,
    priority: priority, // 'High', 'Medium', or 'Low'
    completed: false, // new tasks start as incomplete/pending
    createdAt: new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  };

  // Add the new task to the beginning of the array (most recent first)
  tasks.unshift(newTask);

  // Save the updated tasks array to localStorage
  saveTasksToStorage();

  // Reset the form fields and focus back to the input
  taskForm.reset();
  prioritySelect.value = "Medium";
  taskInput.focus();

  // Update UI dashboard and list
  renderApp();
}

/**
 * Toggles the completion state of a task (Completed <-> Pending)
 * @param {string} taskId - The unique ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
  // Find task by ID and flip completed boolean
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  // Save changes to localStorage
  saveTasksToStorage();

  // Re-render UI
  renderApp();
}

/**
 * Deletes a task from the list
 * @param {string} taskId - The unique ID of the task to delete
 */
function deleteTask(taskId) {
  // Filter out the task with the matching ID
  tasks = tasks.filter((task) => task.id !== taskId);

  // Save changes to localStorage
  saveTasksToStorage();

  // Re-render UI
  renderApp();
}

/**
 * Changes current filter ('all', 'pending', 'completed')
 * @param {string} filterName - The name of the filter clicked
 */
function handleFilterChange(filterName) {
  currentFilter = filterName;

  // Update active styling on filter tab buttons
  filterButtons.forEach((btn) => {
    if (btn.getAttribute("data-filter") === filterName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Re-render the task list for the chosen filter
  renderTaskList();
}

// ---------------------------------------------------------------------------
// 7. DASHBOARD STATISTICS CALCULATIONS
// ---------------------------------------------------------------------------

/**
 * Calculates and updates all metrics on the dashboard:
 * Total, Pending, Completed counts, and completion percentage bar.
 */
function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  // Calculate percentage (avoid division by 0)
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Update numbers in DOM
  totalTasksCount.textContent = total;
  pendingTasksCount.textContent = pending;
  completedTasksCount.textContent = completed;
  completionRateText.textContent = `${percentage}%`;

  // Update progress bar width
  progressBarFill.style.width = `${percentage}%`;

  // Update filter badge counts
  countBadgeAll.textContent = total;
  countBadgePending.textContent = pending;
  countBadgeCompleted.textContent = completed;
}

// ---------------------------------------------------------------------------
// 8. TASK LIST RENDERING (UI)
// ---------------------------------------------------------------------------

/**
 * Filters tasks according to the active filter and renders HTML cards
 */
function renderTaskList() {
  // Clear existing items in list
  taskList.innerHTML = "";

  // Filter tasks based on currentFilter
  let filteredTasks = [];
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else {
    filteredTasks = tasks; // 'all'
  }

  // Handle empty state display
  if (filteredTasks.length === 0) {
    emptyState.classList.remove("hidden");

    if (tasks.length === 0) {
      emptyStateTitle.textContent = "No tasks yet";
      emptyStateDesc.textContent =
        "Add your first assignment, project, or study goal on the left!";
    } else if (currentFilter === "pending") {
      emptyStateTitle.textContent = "All caught up! 🎉";
      emptyStateDesc.textContent =
        "You have no pending tasks. Great job on completing your work!";
    } else if (currentFilter === "completed") {
      emptyStateTitle.textContent = "No completed tasks yet";
      emptyStateDesc.textContent =
        "Check off tasks when you finish studying to track your accomplishments.";
    }
    return;
  }

  // Hide empty state since we have tasks to display
  emptyState.classList.add("hidden");

  // Render each task card
  filteredTasks.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

/**
 * Creates and returns the DOM element for a single task card
 * @param {Object} task - Task object data
 * @returns {HTMLElement} - The <li> element
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  const priorityClass = `priority-${task.priority.toLowerCase()}`;
  li.className = `task-item ${priorityClass} ${task.completed ? "completed" : ""}`;
  li.setAttribute("data-id", task.id);

  // Choose badge style based on priority
  const badgeClass = `badge-${task.priority.toLowerCase()}`;

  // Build task inner HTML
  li.innerHTML = `
    <div class="task-item-content">
      <!-- Checkbox / Toggle Completion Button -->
      <button 
        type="button" 
        class="task-checkbox-btn" 
        aria-label="${task.completed ? 'Mark task as pending' : 'Mark task as completed'}"
        title="${task.completed ? 'Mark as Pending' : 'Mark as Completed'}"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      <!-- Task Title & Badges -->
      <div class="task-text-group">
        <span class="task-title">${escapeHTML(task.title)}</span>
        <div class="task-meta">
          <span class="priority-badge ${badgeClass}">${task.priority} Priority</span>
          <span class="task-date-tag">Added: ${task.createdAt || "Today"}</span>
        </div>
      </div>
    </div>

    <!-- Actions (Delete Button) -->
    <div class="task-actions">
      <button 
        type="button" 
        class="btn-icon-delete" 
        aria-label="Delete task" 
        title="Delete Task"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;

  // Attach event listener for completion checkbox toggle
  const checkboxBtn = li.querySelector(".task-checkbox-btn");
  checkboxBtn.addEventListener("click", () => {
    toggleTaskCompletion(task.id);
  });

  // Attach event listener for delete button
  const deleteBtn = li.querySelector(".btn-icon-delete");
  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
  });

  return li;
}

/**
 * Full app render helper (updates dashboard stats + list view)
 */
function renderApp() {
  updateDashboard();
  renderTaskList();
}

// ---------------------------------------------------------------------------
// 9. HELPER UTILITIES
// ---------------------------------------------------------------------------

/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS)
 * @param {string} str - Raw input text
 * @returns {string} - Escaped HTML-safe string
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Formats and displays the current date in the header
 */
function displayCurrentDate() {
  const options = { weekday: "short", month: "short", day: "numeric" };
  const today = new Date().toLocaleDateString(undefined, options);
  if (currentDateText) {
    currentDateText.textContent = today;
  }
}

/**
 * Pre-populates sample student tasks for first-time visitors
 */
function loadDefaultSampleTasks() {
  tasks = [
    {
      id: "sample-1",
      title: "Review Biology Chapter 7 Notes & Cell Diagram",
      priority: "High",
      completed: false,
      createdAt: "Today",
    },
    {
      id: "sample-2",
      title: "Solve Calculus Problem Set 3 (Exercises 1-15)",
      priority: "Medium",
      completed: false,
      createdAt: "Today",
    },
    {
      id: "sample-3",
      title: "Submit World History Essay Topic Proposal",
      priority: "Low",
      completed: true,
      createdAt: "Yesterday",
    },
  ];
  saveTasksToStorage();
}

// ---------------------------------------------------------------------------
// 10. RUN APPLICATION ON DOM READY
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", init);
