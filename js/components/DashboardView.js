/**
 * DashboardView.js - Main Department Overview & Computer Engineering Hub
 */
import { store } from '../store.js';
import { exportFullBackupJson } from '../utils/exportImport.js';
import { openEditLabGroupModal } from './ModalManager.js';

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
          <span class="kpi-title">Department Courses</span>
          <span class="kpi-icon icon-emerald">📚</span>
        </div>
        <div class="kpi-value text-emerald">${courses.length}</div>
        <div class="kpi-subtitle">Semester 3 Curriculum</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Weekly Lab Sessions</span>
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
          <h3 class="card-title">🧪 Laboratory Groups Overview (CE01 - CE28)</h3>
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
              <strong>Manage Timetable</strong>
              <span>Add or edit lecture & lab schedules</span>
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
              <strong>Browse 162 Students</strong>
              <span>Search student records & lab groups</span>
            </div>
          </button>
        </div>

        <div class="info-card-box mt-4 p-3 bg-secondary border-color rounded">
          <h4 class="font-sm text-cyan mb-1">💡 Access Control Notes</h4>
          <p class="font-xs text-secondary">
            Timetables and Lab Group Leaders are editable <strong>only by Department Admins</strong> (passcode: <code>admin123</code>). Lab Group Leaders log in to take attendance for their respective group.
          </p>
        </div>
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
