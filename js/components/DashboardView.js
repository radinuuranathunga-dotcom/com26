/**
 * DashboardView.js - Main Department Overview & Computer Engineering Hub
 */
import { store } from '../store.js';
import { exportFullBackupJson } from '../utils/exportImport.js';
import { openEditLabGroupModal, openCourseModal, openDeleteConfirmModal } from './ModalManager.js';

export function renderDashboardView(container) {
  const role = store.currentRole;
  const isAdmin = role === 'admin';
  const groups = store.data.labGroups;
  const students = store.data.students;
  const labs = store.data.labs;
  const courses = store.data.courses;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h2>📊 Computer Engineering Department Dashboard</h2>
        <p class="view-description">
          Overview of academic course schedules, ${students.length} student rosters, and laboratory groups.
        </p>
      </div>

      <div class="view-header-right">
        ${isAdmin ? `
          <button id="dash-add-course-btn-top" class="btn btn-primary">
            ➕ Add Academic Module
          </button>
        ` : ''}
        <button id="quick-backup-btn" class="btn btn-outline">
          📦 Backup Full JSON
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="kpi-grid">
      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Total Department Students</span>
          <span class="kpi-icon icon-indigo">🎓</span>
        </div>
        <div class="kpi-value">${students.length}</div>
        <div class="kpi-subtitle">Divided across ${groups.length} Lab Groups</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Active Lab Groups</span>
          <span class="kpi-icon icon-cyan">🧪</span>
        </div>
        <div class="kpi-value">${groups.length}</div>
        <div class="kpi-subtitle">Managed by ${groups.length} Group Leaders</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Department Modules</span>
          <span class="kpi-icon icon-emerald">📚</span>
        </div>
        <div class="kpi-value text-emerald">${courses.length}</div>
        <div class="kpi-subtitle">Semester 3 Curriculum</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Lab Sessions</span>
          <span class="kpi-icon icon-rose">🔬</span>
        </div>
        <div class="kpi-value text-cyan">${labs.length}</div>
        <div class="kpi-subtitle">Practical Hardware & Systems Labs</div>
      </div>
    </div>

    <!-- Dashboard Content Layout Grid -->
    <div class="dashboard-layout-grid">
      
      <!-- Group Roster Summary Table -->
      <div class="card chart-card">
        <div class="card-header">
          <h3 class="card-title">🧪 Laboratory Groups Overview (CE01 - CE34)</h3>
          <span class="sub-text">${isAdmin ? '👑 Admin Mode: Click Edit Leader to reassign leaders' : 'Assigned Leaders & Rooms'}</span>
        </div>
        <div class="table-container mt-3">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lab Group</th>
                <th>Group Leader</th>
                <th>Leader Student ID</th>
                <th>Roster Count</th>
                <th>Assigned Lab Room</th>
                ${isAdmin ? '<th>Actions</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${groups.map(g => {
                const groupStudents = students.filter(s => s.labGroup === g.id);
                return `
                  <tr>
                    <td><span class="group-tag">${g.id}</span></td>
                    <td><span class="font-bold text-cyan">${g.leaderName}</span></td>
                    <td class="font-mono text-muted">${g.leaderId || 'N/A'}</td>
                    <td>${groupStudents.length} Students</td>
                    <td class="text-muted font-sm">${g.labRoom}</td>
                    ${isAdmin ? `
                      <td>
                        <button class="btn btn-xs btn-outline-cyan edit-dash-group-btn" data-id="${g.id}">
                          ✏️ Edit Leader
                        </button>
                      </td>
                    ` : ''}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Action Shortcuts Sidebar -->
      <div class="card shortcuts-card">
        <h3 class="card-title">🚀 Department Quick Actions</h3>
        
        <div class="quick-action-buttons">
          <button id="dash-go-schedule" class="action-btn">
            <span class="btn-icon-bg bg-indigo">📅</span>
            <div class="action-text">
              <strong>Manage Timetable & Modules</strong>
              <span>Add or edit modules, lectures & lab schedules</span>
            </div>
          </button>

          <button id="dash-go-attendance" class="action-btn">
            <span class="btn-icon-bg bg-cyan">⚡</span>
            <div class="action-text">
              <strong>Take Lab Attendance</strong>
              <span>Group Leaders batch attendance portal</span>
            </div>
          </button>

          <button id="dash-go-students" class="action-btn">
            <span class="btn-icon-bg bg-emerald">👥</span>
            <div class="action-text">
              <strong>Browse ${students.length} Students</strong>
              <span>Search student records & lab groups</span>
            </div>
          </button>
        </div>

        <div class="info-card-box mt-4 p-3 bg-secondary border-color rounded">
          <h4 class="font-sm text-cyan mb-1">💡 Access Control Notes</h4>
          <p class="font-xs text-secondary">
            Timetables, Modules, and Lab Group Leaders are editable <strong>only by Department Admins</strong> (passcode: <code>admin123</code>). Lab Group Leaders log in to take attendance for their respective group.
          </p>
        </div>
      </div>

    </div>

    <!-- Academic Modules Management Table -->
    <div class="card full-width mt-4 pad-md animate-fade-in">
      <div class="card-header-flex mb-3" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 class="card-title">📚 Department Academic Modules (${courses.length} Active Modules)</h3>
          <p class="sub-text">Semester 3 Curriculum & Lab Course Specifications</p>
        </div>
        ${isAdmin ? `
          <button id="dash-add-course-btn" class="btn btn-emerald">
            ➕ Add New Module (Admin Only)
          </button>
        ` : `
          <span class="badge badge-secondary">🔒 Admin Editing Only</span>
        `}
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 120px;">Module Code</th>
              <th>Module Title / Name</th>
              <th>Coordinator / Lecturer</th>
              <th style="width: 100px;">Credits</th>
              <th style="width: 130px;">Enrolled Students</th>
              <th style="width: 110px;">Experiments</th>
              ${isAdmin ? '<th style="width: 180px;">Actions (Admin Only)</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${courses.map(c => {
              const expCount = labs.filter(l => l.courseCode === c.code || (l.courseCode && l.courseCode.includes(c.code))).length;
              return `
                <tr>
                  <td><span class="badge badge-cyan font-mono">${c.code}</span></td>
                  <td><strong class="text-bold">${c.name}</strong></td>
                  <td><span class="text-muted">${c.professor || 'Communication Laboratory Staff'}</span></td>
                  <td>${c.credits || 3} Credits</td>
                  <td><span class="font-bold text-cyan">${c.enrolledCount || 195} Students</span></td>
                  <td><span class="badge badge-emerald">${expCount} Labs</span></td>
                  ${isAdmin ? `
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-xs btn-outline-amber dash-edit-course-btn" data-code="${c.code}">
                          ✏️ Edit
                        </button>
                        <button class="btn btn-xs btn-outline-rose dash-delete-course-btn" data-code="${c.code}">
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  ` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelectorAll('.edit-dash-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = groups.find(g => g.id === btn.dataset.id);
      if (grp) openEditLabGroupModal(grp);
    });
  });

  const dashAddCourseTopBtn = container.querySelector('#dash-add-course-btn-top');
  if (dashAddCourseTopBtn) {
    dashAddCourseTopBtn.addEventListener('click', () => {
      openCourseModal(null);
    });
  }

  const dashAddCourseBtn = container.querySelector('#dash-add-course-btn');
  if (dashAddCourseBtn) {
    dashAddCourseBtn.addEventListener('click', () => {
      openCourseModal(null);
    });
  }

  container.querySelectorAll('.dash-edit-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = courses.find(item => item.code === btn.dataset.code);
      if (c) openCourseModal(c);
    });
  });

  container.querySelectorAll('.dash-delete-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      const c = courses.find(item => item.code === code);
      if (c) {
        openDeleteConfirmModal(`Remove Academic Module "${c.code}: ${c.name}" from semester curriculum?`, () => {
          store.deleteCourse(c.code);
        });
      }
    });
  });

  const scheduleBtn = container.querySelector('#dash-go-schedule');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => store.setActiveView('schedule'));
  }

  const attBtn = container.querySelector('#dash-go-attendance');
  if (attBtn) {
    attBtn.addEventListener('click', () => store.setActiveView('attendance'));
  }

  const stBtn = container.querySelector('#dash-go-students');
  if (stBtn) {
    stBtn.addEventListener('click', () => store.setActiveView('students'));
  }

  const backupBtn = container.querySelector('#quick-backup-btn');
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      exportFullBackupJson(store.data);
    });
  }
}
