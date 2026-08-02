/**
 * Navbar.js - Header Bar with Role Switcher, Password Auth & Theme Toggle
 */
import { store } from '../store.js';
import { openPasswordModal } from './ModalManager.js';

export function renderNavbar(container) {
  const role = store.currentRole;
  const activeView = store.activeView;
  const theme = store.currentTheme;
  const activeGroup = store.activeLeaderGroup;
  const auth = store.authenticatedRoles;

  const groups = store.data.labGroups;

  container.innerHTML = `
    <header class="navbar">
      <div class="navbar-left">
        <div class="brand">
          <div class="brand-logo">
            <img src="assets/ruhuna-logo.jpg" alt="University of Ruhuna Logo" class="brand-img-logo">
          </div>
          <div class="brand-text">
            <span class="brand-title">CompEng Academic Hub</span>
            <span class="brand-subtitle">Computer Engineering Department</span>
          </div>
        </div>

        <nav class="nav-tabs">
          <button class="nav-tab ${activeView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            Dashboard
          </button>
          
          <button class="nav-tab ${activeView === 'schedule' ? 'active' : ''}" data-view="schedule">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Schedules ${role === 'admin' ? '<span class="tab-badge">Editable</span>' : ''}
          </button>

          <button class="nav-tab ${activeView === 'attendance' ? 'active' : ''}" data-view="attendance">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Lab Attendance
            ${role === 'leader' ? '<span class="tab-badge highlight">Leader Mode</span>' : ''}
          </button>

          <button class="nav-tab ${activeView === 'students' ? 'active' : ''}" data-view="students">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Students (200)
          </button>
        </nav>
      </div>

      <div class="navbar-right">
        <!-- Role Password Selector -->
        <div class="role-selector-container">
          <label class="role-label">System Access Mode:</label>
          <div class="role-pill-group">
            
            <button class="role-btn ${role === 'admin' ? 'active' : ''}" data-role="admin" title="Admin / Faculty: Manage Schedules & Data Only (Password Required)">
              ${auth.admin ? '🔓' : '🔒'} Admin (Data Entry)
            </button>

            <button class="role-btn ${role === 'leader' ? 'active' : ''}" data-role="leader" title="Lab Group Leader: Mark Attendance Only (Password Required)">
              ${auth.leader ? '🔓' : '🔒'} Group Leader (Mark Attendance)
            </button>

            <button class="role-btn ${role === 'student' ? 'active' : ''}" data-role="student" title="Student View: Public Read-Only Timetables">
              🎓 Student View
            </button>

          </div>
        </div>

        ${role === 'leader' ? `
          <div class="leader-group-select-wrapper animate-fade-in" style="background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); padding: 4px 12px; border-radius: 20px;">
            <span class="leader-icon">⚡</span>
            <span class="font-bold text-cyan font-sm">Leader: ${activeGroup} (${groups.find(g => g.id === activeGroup)?.leaderName || 'Leader'})</span>
          </div>
        ` : ''}

        ${(auth.admin || auth.leader) ? `
          <button id="logout-btn" class="btn btn-outline-danger btn-sm" title="Lock session back to Student View">
            🔒 Lock Session
          </button>
        ` : ''}

        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" class="icon-btn" title="Toggle Dark/Light Mode">
          ${theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <!-- Reset Demo Data -->
        <button id="reset-data-btn" class="btn btn-outline btn-sm" title="Reset all data to default initial state">
          🔄 Reset Demo
        </button>
      </div>
    </header>
  `;

  // Navigation tabs
  container.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setActiveView(btn.dataset.view);
    });
  });

  // Role button clicks with password authentication
  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRole = btn.dataset.role;

      if (selectedRole === 'student') {
        store.setRole('student');
        return;
      }

      // Check if already authenticated for selected role
      if (store.authenticatedRoles[selectedRole]) {
        store.setRole(selectedRole);
        if (selectedRole === 'leader' && store.activeView !== 'attendance') {
          store.setActiveView('attendance');
        }
      } else {
        // Prompt for password
        openPasswordModal(selectedRole, store.activeLeaderGroup);
      }
    });
  });

  const leaderSelect = container.querySelector('#navbar-leader-group-select');
  if (leaderSelect) {
    leaderSelect.addEventListener('change', (e) => {
      store.activeLeaderGroup = e.target.value;
      if (!store.authenticatedRoles.leader) {
        openPasswordModal('leader', e.target.value);
      } else {
        store.setRole('leader', e.target.value);
      }
    });
  }

  const logoutBtn = container.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }

  const themeBtn = container.querySelector('#theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      store.setTheme(store.currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  const resetBtn = container.querySelector('#reset-data-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all schedules, 200 students, and attendance logs back to the initial demo data?')) {
        store.resetToDefaults();
      }
    });
  }
}
