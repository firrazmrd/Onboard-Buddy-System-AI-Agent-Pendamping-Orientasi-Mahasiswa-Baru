/**
 * Onboard Buddy System Dashboard – script.js
 * =====================================================
 * Handles all dynamic functionality:
 *  - Navigation (SPA-style section switching)
 *  - Task CRUD with localStorage persistence
 *  - Dynamic filtering (All / Active / Completed)
 *  - KPI cards + progress calculations
 *  - Schedule rendering
 *  - Category progress bars
 *  - Announcements with mark-as-read
 *  - Toast notifications
 *  - Mobile sidebar toggle
 * =====================================================
 */

'use strict';

/* =====================================================
   CONSTANTS & SEED DATA
   ===================================================== */

const STORAGE_KEY = 'obs_tasks_v2';
const NOTIF_KEY   = 'obs_notifications_v2';

/** Seed tasks loaded only when localStorage is empty */
const SEED_TASKS = [
  {
    id: 'task-001',
    title: 'Submit Enrollment Documentation',
    description: 'Upload signed enrollment forms and identification documents to the student portal.',
    category: 'Administrative',
    priority: 'High',
    deadline: '2026-11-05',
    completed: true,
    createdAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'task-002',
    title: 'Collect Student ID Card',
    description: 'Visit the registrar office (Block A, Room 102) between 9am–4pm to collect your student ID.',
    category: 'Administrative',
    priority: 'High',
    deadline: '2026-11-06',
    completed: true,
    createdAt: '2026-10-20T09:05:00Z',
  },
  {
    id: 'task-003',
    title: 'Set Up University Email Account',
    description: 'Activate your university email using the credentials provided in the welcome letter.',
    category: 'Technical',
    priority: 'High',
    deadline: '2026-11-04',
    completed: true,
    createdAt: '2026-10-20T09:10:00Z',
  },
  {
    id: 'task-004',
    title: 'Attend Welcome Orientation Session',
    description: 'Mandatory welcome ceremony for all new students in the Main Auditorium.',
    category: 'Social',
    priority: 'High',
    deadline: '2026-11-07',
    completed: true,
    createdAt: '2026-10-20T09:15:00Z',
  },
  {
    id: 'task-005',
    title: 'Meet Assigned Buddy (Sarah Reynolds)',
    description: 'Introductory meeting with your assigned buddy at the Student Lounge, Building B.',
    category: 'Social',
    priority: 'Medium',
    deadline: '2026-11-08',
    completed: true,
    createdAt: '2026-10-20T09:20:00Z',
  },
  {
    id: 'task-006',
    title: 'Register for Course Modules',
    description: 'Log in to the academic portal and select your Year 1, Semester 1 modules before the deadline.',
    category: 'Academic',
    priority: 'High',
    deadline: '2026-11-10',
    completed: false,
    createdAt: '2026-10-20T09:25:00Z',
  },
  {
    id: 'task-007',
    title: 'Complete Campus Safety Training',
    description: 'Online health & safety induction module. Takes approximately 45 minutes. Certificate required.',
    category: 'Health & Safety',
    priority: 'Medium',
    deadline: '2026-11-12',
    completed: false,
    createdAt: '2026-10-20T09:30:00Z',
  },
  {
    id: 'task-008',
    title: 'Connect to University Wi-Fi & VPN',
    description: 'Install the university VPN client and configure Wi-Fi access using your student credentials.',
    category: 'Technical',
    priority: 'Medium',
    deadline: '2026-11-09',
    completed: false,
    createdAt: '2026-10-20T09:35:00Z',
  },
  {
    id: 'task-009',
    title: 'Visit Campus Library & Register',
    description: 'Register at the main library to access online databases, journals, and borrow physical books.',
    category: 'Academic',
    priority: 'Low',
    deadline: '2026-11-15',
    completed: false,
    createdAt: '2026-10-20T09:40:00Z',
  },
  {
    id: 'task-010',
    title: 'Attend Buddy Check-in Meeting (Week 2)',
    description: 'Second weekly check-in with Sarah. Discuss any concerns, upcoming deadlines, and social events.',
    category: 'Social',
    priority: 'Medium',
    deadline: '2026-11-14',
    completed: false,
    createdAt: '2026-10-20T09:45:00Z',
  },
  {
    id: 'task-011',
    title: 'Join Student Clubs & Societies Fair',
    description: 'Explore student societies at the annual clubs fair on the main campus square.',
    category: 'Social',
    priority: 'Low',
    deadline: '2026-11-18',
    completed: false,
    createdAt: '2026-10-20T09:50:00Z',
  },
  {
    id: 'task-012',
    title: 'Submit Financial Aid Application',
    description: 'Complete and submit the bursary/scholarship application form via the finance office portal.',
    category: 'Administrative',
    priority: 'High',
    deadline: '2026-11-13',
    completed: false,
    createdAt: '2026-10-20T09:55:00Z',
  },
];

/** Upcoming schedule data */
const SCHEDULE_DATA = [
  {
    id: 's-001',
    title: 'Week 2 Buddy Check-in',
    description: 'Virtual meeting with Sarah Reynolds via Zoom',
    date: '2026-11-07',
    time: '10:00 AM',
    type: 'Meeting',
    color: 'blue',
  },
  {
    id: 's-002',
    title: 'Course Module Registration Deadline',
    description: 'Last day to register for Semester 1 modules on the academic portal',
    date: '2026-11-10',
    time: '11:59 PM',
    type: 'Deadline',
    color: 'red',
  },
  {
    id: 's-003',
    title: 'Campus Safety Training Workshop',
    description: 'In-person safety induction at Health & Safety Office, Block D',
    date: '2026-11-12',
    time: '2:00 PM',
    type: 'Workshop',
    color: 'orange',
  },
  {
    id: 's-004',
    title: 'Financial Aid Application Deadline',
    description: 'Submit completed forms via finance portal before midnight',
    date: '2026-11-13',
    time: '11:59 PM',
    type: 'Deadline',
    color: 'red',
  },
  {
    id: 's-005',
    title: 'Student Clubs & Societies Fair',
    description: 'Annual clubs fair at the main campus square – come discover your community!',
    date: '2026-11-18',
    time: '11:00 AM',
    type: 'Event',
    color: 'green',
  },
  {
    id: 's-006',
    title: 'Week 3 Group Mentoring Session',
    description: 'Group session with all Year 1 CS students and their buddies in Room 210',
    date: '2026-11-21',
    time: '3:00 PM',
    type: 'Meeting',
    color: 'blue',
  },
  {
    id: 's-007',
    title: 'Mid-Onboarding Review',
    description: 'One-on-one review of your progress with the Onboarding Coordinator',
    date: '2026-11-25',
    time: '11:00 AM',
    type: 'Review',
    color: 'purple',
  },
];

/** Announcements data */
const SEED_ANNOUNCEMENTS = [
  {
    id: 'ann-001',
    title: 'Welcome to the Onboarding Program!',
    message: 'We are thrilled to have you here. Your buddy Sarah Reynolds has been assigned to support you throughout your onboarding journey. Check your task list to get started.',
    author: 'Onboarding Team',
    date: '2026-10-28',
    type: 'info',
    read: false,
  },
  {
    id: 'ann-002',
    title: '⚠️ Registration Deadline Reminder',
    message: 'Course module registration closes on November 10th. Please ensure you have selected all required modules before the deadline to avoid late fees.',
    author: 'Academic Office',
    date: '2026-10-30',
    type: 'warning',
    read: false,
  },
  {
    id: 'ann-003',
    title: 'Campus Wi-Fi Maintenance Notice',
    message: 'Scheduled maintenance on November 3rd from 2:00 AM – 5:00 AM. University Wi-Fi and VPN services will be temporarily unavailable. Plan accordingly.',
    author: 'IT Services',
    date: '2026-10-31',
    type: 'warning',
    read: false,
  },
  {
    id: 'ann-004',
    title: 'New: Virtual Buddy Sessions Available',
    message: 'You can now book virtual 1-on-1 sessions with your buddy directly through the platform. Check the Schedule section for available time slots.',
    author: 'Buddy Program Coordinator',
    date: '2026-10-29',
    type: 'success',
    read: true,
  },
  {
    id: 'ann-005',
    title: 'Financial Aid Applications Now Open',
    message: 'The bursary and scholarship application window is now open. Applications close November 13th. Visit the finance portal or see task #12 for details.',
    author: 'Finance Office',
    date: '2026-10-27',
    type: 'info',
    read: true,
  },
];

/* =====================================================
   STATE
   ===================================================== */

let tasks         = [];           // Current task array
let notifications = [];           // Announcements state
let currentFilter = 'all';        // 'all' | 'active' | 'completed'
let currentSection = 'dashboard'; // Active nav section
let deleteTargetId = null;        // ID of task pending deletion
let searchQuery   = '';           // Global search query

/* =====================================================
   INITIALISATION
   ===================================================== */

/**
 * App entry point — load data, render all components.
 */
function init() {
  loadTasks();
  loadNotifications();
  renderAll();
  setTodayAsDefaultDeadline();
  console.log('%c✅ OnboardBuddy Dashboard loaded', 'color:#2563EB;font-weight:bold');
}

/** Load tasks from localStorage or seed with default data */
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [...SEED_TASKS];
  if (!stored) saveTasks(); // Persist seed data immediately
}

/** Load notifications from localStorage or use seed */
function loadNotifications() {
  const stored = localStorage.getItem(NOTIF_KEY);
  notifications = stored ? JSON.parse(stored) : [...SEED_ANNOUNCEMENTS];
  if (!stored) saveNotifications();
}

/** Persist tasks to localStorage */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** Persist notifications to localStorage */
function saveNotifications() {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
}

/** Set today's date as the default value for the deadline picker */
function setTodayAsDefaultDeadline() {
  const today = new Date().toISOString().split('T')[0];
  const input = document.getElementById('taskDeadline');
  if (input && !input.value) input.value = today;
}

/** Render every component after any state change */
function renderAll() {
  updateKPIs();
  renderRecentTasks();
  renderTaskList();
  renderSchedule();
  renderCategoryProgress();
  renderAnnouncements();
  updateProgressRing();
  updateBuddyProfileProgress();
  updateNotifBadge();
}

/* =====================================================
   NAVIGATION (SPA-style section switching)
   ===================================================== */

const SECTION_TITLES = {
  dashboard:     { title: 'Dashboard Overview',       subtitle: 'Welcome back, Alex!' },
  tasks:         { title: 'My Tasks',                 subtitle: 'Manage your onboarding checklist' },
  schedule:      { title: 'Upcoming Schedule',        subtitle: 'Your onboarding events & deadlines' },
  progress:      { title: 'Progress Tracking',        subtitle: 'Monitor your onboarding milestones' },
  buddy:         { title: 'Buddy & My Profile',       subtitle: 'Contact information & profiles' },
  announcements: { title: 'Announcements',            subtitle: 'Important updates & notifications' },
};

/**
 * Navigate to a specific section.
 * @param {string} section - Section key
 */
function navigateTo(section) {
  currentSection = section;

  // Hide all sections
  document.querySelectorAll('.section-content').forEach(el => el.classList.add('hidden'));

  // Show target section
  const target = document.getElementById(`section-${section}`);
  if (target) target.classList.remove('hidden');

  // Update header title
  const meta = SECTION_TITLES[section];
  if (meta) {
    document.getElementById('pageTitle').textContent = meta.title;
    document.getElementById('pageSubtitle').textContent = meta.subtitle;
  }

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.section === section) {
      link.classList.add('active-nav');
    } else {
      link.classList.remove('active-nav');
    }
  });

  // Close mobile sidebar
  closeSidebar();

  // Re-trigger progress ring animation when switching to progress section
  if (section === 'progress') {
    setTimeout(updateProgressRing, 50);
  }
}

/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */

function openSidebar() {
  document.getElementById('sidebar').classList.add('sidebar-open');
  document.getElementById('sidebarOverlay').classList.remove('hidden');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('sidebar-open');
  document.getElementById('sidebarOverlay').classList.add('hidden');
}

/* =====================================================
   TASK UTILITIES
   ===================================================== */

/** Generate a simple unique ID for new tasks */
function generateId() {
  return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

/** Return filtered tasks based on currentFilter and searchQuery */
function getFilteredTasks() {
  return tasks
    .filter(t => {
      if (currentFilter === 'active')    return !t.completed;
      if (currentFilter === 'completed') return t.completed;
      return true;
    })
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
}

/** Format a date string (YYYY-MM-DD) to a human-readable form */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Determine deadline CSS class based on proximity */
function getDeadlineClass(dateStr, completed) {
  if (completed || !dateStr) return 'text-gray-400';
  const now  = new Date();
  const dead = new Date(dateStr + 'T00:00:00');
  const diff = (dead - now) / (1000 * 60 * 60 * 24); // days
  if (diff < 0)  return 'deadline-overdue text-xs font-medium';
  if (diff <= 3) return 'deadline-soon text-xs font-medium';
  return 'text-gray-400 text-xs';
}

/** Map priority to CSS class */
function priorityClass(priority) {
  const map = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };
  return map[priority] || 'priority-low';
}

/** Map category to CSS class */
function categoryClass(cat) {
  const map = {
    'Administrative': 'cat-administrative',
    'Academic':       'cat-academic',
    'Social':         'cat-social',
    'Technical':      'cat-technical',
    'Health & Safety':'cat-health',
  };
  return map[cat] || 'cat-administrative';
}

/* =====================================================
   KPI CARDS
   ===================================================== */

function updateKPIs() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active    = total - completed;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('kpiTotal').textContent     = total;
  document.getElementById('kpiCompleted').textContent = completed;
  document.getElementById('kpiActive').textContent    = active;
  document.getElementById('kpiProgress').textContent  = pct + '%';
  document.getElementById('kpiCompletedPct').textContent  = pct + '%';
  document.getElementById('kpiProgressLabel').textContent = pct + '%';

  // Progress summary in Progress section
  document.getElementById('progTotal').textContent = total;
  document.getElementById('progDone').textContent  = completed;
  document.getElementById('progLeft').textContent  = active;
}

/* =====================================================
   PROGRESS RING (SVG)
   ===================================================== */

function updateProgressRing() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const circle      = document.getElementById('progressRingCircle');
  const pctLabel    = document.getElementById('progressRingPct');
  const circumference = 2 * Math.PI * 50; // r=50 → ~314.16

  if (circle) {
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDasharray  = circumference;
    circle.style.strokeDashoffset = offset;
  }
  if (pctLabel) pctLabel.textContent = pct + '%';
}

/* =====================================================
   BUDDY PROFILE PROGRESS BAR
   ===================================================== */

function updateBuddyProfileProgress() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const bar  = document.getElementById('buddyProgressBar');
  const txt  = document.getElementById('buddyProgressText');
  const tot  = document.getElementById('buddyProgressTotal');

  if (bar)  bar.style.width = pct + '%';
  if (txt)  txt.textContent = completed;
  if (tot)  tot.textContent = total;
}

/* =====================================================
   RECENT TASKS (Dashboard Snippet)
   ===================================================== */

function renderRecentTasks() {
  const container = document.getElementById('recentTasksList');
  if (!container) return;

  // Show 5 most recent tasks (last created/modified)
  const recent = [...tasks].slice(0, 5);
  if (recent.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">No tasks yet. Go to My Tasks to add some!</p>';
    return;
  }

  container.innerHTML = recent.map((t, i) => `
    <div class="recent-task-row" style="animation-delay:${i * 0.05}s">
      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${t.completed ? 'bg-green-100' : 'bg-orange-100'}">
        ${t.completed
          ? `<svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
          : `<svg class="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        }
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-800 truncate ${t.completed ? 'line-through text-gray-400' : ''}">${escapeHtml(t.title)}</p>
        <p class="text-xs text-gray-400">${t.category} · Due ${formatDate(t.deadline)}</p>
      </div>
      <span class="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${priorityClass(t.priority)}">${t.priority}</span>
    </div>
  `).join('');
}

/* =====================================================
   TASK LIST (CRUD + Filtering)
   ===================================================== */

function renderTaskList() {
  const container = document.getElementById('taskList');
  const emptyMsg  = document.getElementById('emptyTaskMsg');
  if (!container) return;

  const filtered = getFilteredTasks();

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');

  container.innerHTML = filtered.map((t, i) => buildTaskItemHTML(t, i)).join('');
}

/**
 * Build the HTML string for a single task item.
 * @param {object} task
 * @param {number} index - Used for staggered animation delay
 * @returns {string} HTML string
 */
function buildTaskItemHTML(task, index) {
  const deadlineCls = getDeadlineClass(task.deadline, task.completed);
  const isOverdue   = !task.completed && task.deadline && new Date(task.deadline + 'T00:00:00') < new Date();

  return `
    <div class="task-item ${task.completed ? 'completed-task' : ''}" id="task-row-${task.id}" style="animation-delay:${index * 0.04}s">
      <!-- Checkbox -->
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        onchange="toggleComplete('${task.id}')"
        aria-label="Mark task as completed"
        title="${task.completed ? 'Mark as active' : 'Mark as completed'}"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-0.5">
          <p class="text-sm font-semibold text-gray-800 task-title-text">${escapeHtml(task.title)}</p>
        </div>
        ${task.description ? `<p class="text-xs text-gray-500 mb-1.5 line-clamp-1">${escapeHtml(task.description)}</p>` : ''}
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-lg font-medium ${categoryClass(task.category)}">${task.category}</span>
          <span class="text-xs px-2 py-0.5 rounded-lg font-medium ${priorityClass(task.priority)}">${task.priority}</span>
          ${task.deadline ? `<span class="${deadlineCls}">📅 ${isOverdue ? 'Overdue: ' : ''}${formatDate(task.deadline)}</span>` : ''}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button onclick="openTaskModal('${task.id}')" class="task-action-btn edit-btn" title="Edit task" aria-label="Edit">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button onclick="openDeleteModal('${task.id}')" class="task-action-btn delete-btn" title="Delete task" aria-label="Delete">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
  `;
}

/* =====================================================
   TASK FILTERING
   ===================================================== */

/**
 * Set active filter and re-render.
 * @param {string} filter - 'all' | 'active' | 'completed'
 */
function setFilter(filter) {
  currentFilter = filter;

  // Update filter button styles
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('active-filter');
      btn.classList.remove('text-gray-500');
    } else {
      btn.classList.remove('active-filter');
      btn.classList.add('text-gray-500');
    }
  });

  renderTaskList();
}

/* =====================================================
   GLOBAL SEARCH
   ===================================================== */

function handleGlobalSearch(value) {
  searchQuery = value.trim();
  renderTaskList();
  // Auto-navigate to tasks section if searching
  if (searchQuery && currentSection !== 'tasks') navigateTo('tasks');
}

/* =====================================================
   TASK MODAL (Add / Edit)
   ===================================================== */

/**
 * Open the task modal.
 * @param {string|null} taskId - If provided, load existing task for editing
 */
function openTaskModal(taskId = null) {
  const modal     = document.getElementById('taskModal');
  const title     = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const idField   = document.getElementById('taskId');

  if (taskId) {
    // EDIT mode
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    title.textContent                               = 'Edit Task';
    submitBtn.textContent                           = 'Save Changes';
    idField.value                                   = task.id;
    document.getElementById('taskTitle').value      = task.title;
    document.getElementById('taskDesc').value       = task.description;
    document.getElementById('taskCategory').value   = task.category;
    document.getElementById('taskPriority').value   = task.priority;
    document.getElementById('taskDeadline').value   = task.deadline || '';
  } else {
    // ADD mode
    title.textContent     = 'Add New Task';
    submitBtn.textContent = 'Add Task';
    idField.value         = '';
    document.getElementById('taskForm').reset();
    setTodayAsDefaultDeadline();
  }

  modal.classList.remove('hidden');
  document.getElementById('taskTitle').focus();
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.add('hidden');
}

/** Close modal when clicking the backdrop overlay */
function closeModalOnOverlay(event) {
  if (event.target === document.getElementById('taskModal')) {
    closeTaskModal();
  }
}

/* =====================================================
   TASK FORM SUBMISSION (Add / Update)
   ===================================================== */

/**
 * Handle task form submit — either adds a new task or updates existing.
 * @param {Event} event
 */
function submitTask(event) {
  event.preventDefault();

  const id       = document.getElementById('taskId').value;
  const title    = document.getElementById('taskTitle').value.trim();
  const desc     = document.getElementById('taskDesc').value.trim();
  const category = document.getElementById('taskCategory').value;
  const priority = document.getElementById('taskPriority').value;
  const deadline = document.getElementById('taskDeadline').value;

  if (!title) return;

  if (id) {
    // UPDATE existing task
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], title, description: desc, category, priority, deadline };
      showToast('✏️', 'Task updated successfully!');
    }
  } else {
    // ADD new task
    const newTask = {
      id:          generateId(),
      title,
      description: desc,
      category,
      priority,
      deadline,
      completed:   false,
      createdAt:   new Date().toISOString(),
    };
    tasks.unshift(newTask); // Add to top of list
    showToast('✅', 'Task added successfully!');
  }

  saveTasks();
  closeTaskModal();
  renderAll();
}

/* =====================================================
   TOGGLE COMPLETE
   ===================================================== */

/**
 * Toggle a task's completed status.
 * @param {string} taskId
 */
function toggleComplete(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderAll();
  showToast(task.completed ? '🎉' : '↩️', task.completed ? 'Marked as completed!' : 'Marked as active.');
}

/* =====================================================
   DELETE TASK
   ===================================================== */

function openDeleteModal(taskId) {
  deleteTargetId = taskId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

function confirmDelete() {
  if (!deleteTargetId) return;
  tasks = tasks.filter(t => t.id !== deleteTargetId);
  saveTasks();
  closeDeleteModal();
  renderAll();
  showToast('🗑️', 'Task deleted.');
}

/* =====================================================
   SCHEDULE
   ===================================================== */

function renderSchedule() {
  const container = document.getElementById('scheduleList');
  if (!container) return;

  const typeColorMap = {
    Meeting:  { bg: '#EFF6FF', text: '#1D4ED8', dot: '#2563EB' },
    Deadline: { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444' },
    Workshop: { bg: '#FFF7ED', text: '#C2410C', dot: '#F59E0B' },
    Event:    { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' },
    Review:   { bg: '#F5F3FF', text: '#5B21B6', dot: '#7C3AED' },
  };

  container.innerHTML = SCHEDULE_DATA.map((item, i) => {
    const d = new Date(item.date + 'T00:00:00');
    const dayNum  = d.getDate();
    const monthAb = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const colors  = typeColorMap[item.type] || typeColorMap['Event'];

    return `
      <div class="schedule-item" style="animation-delay:${i * 0.06}s">
        <div class="schedule-date-box">
          <span class="day">${dayNum}</span>
          <span class="month">${monthAb}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-0.5">
            <p class="text-sm font-semibold text-gray-800">${escapeHtml(item.title)}</p>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full" style="background:${colors.bg};color:${colors.text}">${item.type}</span>
          </div>
          <p class="text-xs text-gray-500">${escapeHtml(item.description)}</p>
          <p class="text-xs text-gray-400 mt-1">🕐 ${item.time}</p>
        </div>
      </div>
    `;
  }).join('');
}

/* =====================================================
   CATEGORY PROGRESS BARS
   ===================================================== */

function renderCategoryProgress() {
  const container = document.getElementById('categoryProgressList');
  if (!container) return;

  const categories = ['Administrative', 'Academic', 'Social', 'Technical', 'Health & Safety'];
  const colorMap   = {
    'Administrative': '#2563EB',
    'Academic':       '#7C3AED',
    'Social':         '#F59E0B',
    'Technical':      '#10B981',
    'Health & Safety':'#EF4444',
  };

  const html = categories.map((cat, i) => {
    const catTasks = tasks.filter(t => t.category === cat);
    const total    = catTasks.length;
    const done     = catTasks.filter(t => t.completed).length;
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
    const color    = colorMap[cat];

    return `
      <div class="cat-progress-item" style="animation-delay:${i * 0.08}s">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${color}"></div>
            <span class="text-sm font-medium text-gray-700">${cat}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400">${done}/${total} tasks</span>
            <span class="text-xs font-bold" style="color:${color}">${pct}%</span>
          </div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${pct}%;background:${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/* =====================================================
   ANNOUNCEMENTS
   ===================================================== */

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;

  const typeMap = {
    info:    { icon: 'ℹ️', bg: '#EFF6FF', border: '#BFDBFE' },
    warning: { icon: '⚠️', bg: '#FFFBEB', border: '#FDE68A' },
    success: { icon: '✅', bg: '#ECFDF5', border: '#A7F3D0' },
  };

  container.innerHTML = notifications.map((ann, i) => {
    const meta = typeMap[ann.type] || typeMap['info'];
    return `
      <div class="announcement-item ${ann.read ? 'read' : 'unread'}" id="ann-${ann.id}" style="animation-delay:${i * 0.06}s">
        <div class="announcement-dot"></div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-start justify-between gap-2 mb-1">
            <p class="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <span>${meta.icon}</span> ${escapeHtml(ann.title)}
            </p>
            ${!ann.read ? `<button onclick="markRead('${ann.id}')" class="text-xs text-primary font-semibold hover:underline flex-shrink-0">Mark read</button>` : `<span class="text-xs text-gray-400 flex-shrink-0">Read</span>`}
          </div>
          <p class="text-sm text-gray-600 mb-2">${escapeHtml(ann.message)}</p>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400">By ${escapeHtml(ann.author)}</span>
            <span class="text-xs text-gray-400">·</span>
            <span class="text-xs text-gray-400">${formatDate(ann.date)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Mark a single announcement as read.
 * @param {string} annId
 */
function markRead(annId) {
  const ann = notifications.find(n => n.id === annId);
  if (ann) {
    ann.read = true;
    saveNotifications();
    renderAnnouncements();
    updateNotifBadge();
    showToast('📬', 'Marked as read.');
  }
}

/** Mark all announcements as read */
function markAllRead() {
  notifications.forEach(n => { n.read = true; });
  saveNotifications();
  renderAnnouncements();
  updateNotifBadge();
  showToast('📬', 'All announcements marked as read.');
}

/** Update the notification badge count */
function updateNotifBadge() {
  const unreadCount = notifications.filter(n => !n.read).length;
  const badge      = document.getElementById('notifBadge');
  const topBadge   = document.getElementById('topNotifBadge');

  if (badge) {
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? '' : 'none';
  }
  if (topBadge) {
    topBadge.style.display = unreadCount > 0 ? '' : 'none';
  }
}

/* =====================================================
   TOAST NOTIFICATIONS
   ===================================================== */

let toastTimer = null;

/**
 * Show a temporary toast notification.
 * @param {string} icon  - Emoji icon
 * @param {string} message - Message text
 */
function showToast(icon, message) {
  const toast   = document.getElementById('toast');
  const iconEl  = document.getElementById('toastIcon');
  const msgEl   = document.getElementById('toastMsg');

  iconEl.textContent = icon;
  msgEl.textContent  = message;

  toast.classList.add('toast-show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-show');
  }, 3000);
}

/* =====================================================
   SECURITY UTILITY: HTML escaping
   ===================================================== */

/**
 * Escape special HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* =====================================================
   EVENT LISTENERS
   ===================================================== */

// Keyboard: ESC key closes open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTaskModal();
    closeDeleteModal();
  }
});

// Sidebar nav link clicks
document.querySelectorAll('.nav-link[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

/* =====================================================
   BOOT
   ===================================================== */
document.addEventListener('DOMContentLoaded', init);
