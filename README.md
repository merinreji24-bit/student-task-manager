# 🎓 Student Task Manager (StudyFlow)

A beginner-friendly, clean, and modern web application tailored for students to organize assignments, prioritize homework, track study tasks, and boost daily productivity.

---

## 🚀 Features

1. **Add Tasks with Priorities**:
   - Enter assignment or study task names.
   - Select priority level: **🔴 High Priority**, **🟡 Medium Priority**, or **🟢 Low Priority**.
   - Input validation prevents accidental empty submissions.
2. **Task Management**:
   - Visual task cards with color-coded side indicators matching their priority.
   - Interactive checkbox toggle to mark tasks as **Completed** or **Pending** with smooth animations.
   - One-click deletion with a trash button.
3. **Filter System**:
   - **All Tasks**: Shows every saved task with total count.
   - **Pending Tasks**: Shows only tasks that need to be completed.
   - **Completed Tasks**: Shows finished achievements.
4. **Interactive Dashboard**:
   - **Total Tasks counter**
   - **Pending Tasks counter**
   - **Completed Tasks counter**
   - **Dynamic Completion Rate (%) progress bar** that updates in real-time.
5. **Persistent Local Storage**:
   - Tasks and their states are automatically saved into the browser's `localStorage`.
   - Your tasks stay safely saved even when refreshing the page or closing the browser.
6. **Responsive & Modern Design**:
   - Modern student dashboard design using the **Plus Jakarta Sans** typography.
   - Mobile and desktop friendly responsive grid layout.

---

## 📁 Project Structure

```text
sample/
├── index.html    # Web page structure, semantic HTML elements, and dashboard layout
├── style.css     # Modern styling, responsive layout, color tokens, and micro-animations
├── script.js     # Vanilla JavaScript handling task state, DOM updates, and localStorage
└── README.md     # Documentation, running instructions, and code guide
```

---

## 🏃 How to Run the Application

You do not need to install any heavy packages or build tools!

### Method 1: Direct File Opening (Easiest)
1. Navigate to the project folder (`c:\Users\user\Desktop\sample`).
2. Double-click on `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Using a Local HTTP Server
If you have Python installed:
```powershell
python -m http.server 3000
```
Then open your browser and navigate to:
```
http://localhost:3000/index.html
```

---

## 🧠 Code Explanation for Beginners

### 1. `index.html` (The Skeleton)
- **`<header>`**: Displays the app logo, title, and current date.
- **`<section class="dashboard-stats">`**: 4 metric cards showing Total, Pending, Completed counts, and the completion bar.
- **`<form id="taskForm">`**: Handles user input for task title and priority dropdown.
- **`<div class="filters-group">`**: Buttons to switch between "All", "Pending", and "Completed" views.
- **`<ul id="taskList">`**: The dynamic list where JavaScript inserts task elements.

### 2. `style.css` (The Presentation)
- Uses **CSS Variables** (`:root`) for colors (e.g. `--color-primary`, `--priority-high-bg`, `--priority-low-dot`) so colors can easily be customized in one place.
- Implements **Flexbox** and **CSS Grid** for a responsive 2-column layout that gracefully wraps on smaller screens and phones.
- Provides visual cues for priorities (red for high, yellow for medium, green for low) and strikethrough styling for completed tasks.

### 3. `script.js` (The Brain)
- **`init()`**: Called when the page loads (`DOMContentLoaded`). Sets up the date, loads saved tasks, initializes listeners, and renders the app.
- **`loadTasksFromStorage()` & `saveTasksToStorage()`**: Reads and writes tasks to browser `localStorage` using `JSON.parse()` and `JSON.stringify()`.
- **`handleAddTask(event)`**: Creates a new task object with a unique timestamp ID, priority, and completed flag, then saves and renders.
- **`toggleTaskCompletion(taskId)`**: Flips the `completed` status of the targeted task.
- **`deleteTask(taskId)`**: Removes the selected task from the array.
- **`handleFilterChange(filterName)`**: Switches between 'all', 'pending', and 'completed' filters.
- **`updateDashboard()`**: Calculates task totals and updates dashboard numbers and the progress bar.
- **`renderTaskList()`**: Dynamically creates HTML elements for tasks matching the active filter.
