/**
 * Navbar.js - Header Bar with Role Switcher, Password Auth & Theme Toggle
 */
import { store } from '../store.js';
import { openPasswordModal } from './ModalManager.js';

export function renderNavbar(activeView) {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const role = store.currentRole;
  const groups = store.labGroups;
  const activeGroup = store.activeLeaderGroup;
  const auth = store.authenticatedRoles;
  const theme = store.currentTheme;

  container.innerHTML = `
    <header class="navbar">
      <div class="brand">
        <div class="brand-logo">
          <img src="assets/ruhuna-logo.jpg" alt="University of Ruhuna Logo" class="brand-img-logo">
        </div>
        <div class="brand-text">
          <span class="brand-title">CompEng Academic Hub</span>
          <span class="brand-subtitle">Computer Engineering Department</span>
        </div>
      </div>

      <!-- Hamburger Menu Toggle Button for Mobile Viewports -->
      <button id="mobile-menu-toggle-btn" class="hamburger-toggle-btn" aria-label="Toggle Navigation Menu">
        <span class="hamburger-icon">☰</span>
      </button>

      <!-- Desktop View Navigation & Controls -->
      <div class="navbar-right-desktop">
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
            Students (${store.students.length})
          </button>
        </nav>

        <div class="role-selector-container">
          <label class="role-label">System Access Mode:</label>
          <div class="role-pill-group">
            <button class="role-btn ${role === 'admin' ? 'active' : ''}" data-role="admin" title="Admin / Faculty: Manage Schedules & Data Only (Password Required)">
              ${auth.admin ? '🔓' : '🔒'} Admin
            </button>
            <button class="role-btn ${role === 'leader' ? 'active' : ''}" data-role="leader" title="Lab Group Leader: Mark Attendance Only (Password Required)">
              ${auth.leader ? '🔓' : '🔒'} Group Leader
            </button>
            <button class="role-btn ${role === 'student' ? 'active' : ''}" data-role="student" title="Student View: Public Read-Only Timetables">
              🎓 Student View
            </button>
          </div>
        </div>

        ${role === 'leader' ? `
          <div class="leader-badge-indicator">
            <span class="leader-icon">⚡</span>
            <span class="font-bold text-cyan font-sm">Leader: ${activeGroup}</span>
          </div>
        ` : ''}

        ${(auth.admin || auth.leader) ? `
          <button id="logout-btn" class="btn btn-outline-danger btn-sm" title="Lock session back to Student View">
            🔒 Lock Session
          </button>
        ` : ''}

        <button id="theme-toggle-btn" class="icon-btn" title="Toggle Dark/Light Mode">
          ${theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <!-- Mobile Drawer Dropdown Menu -->
      <div id="mobile-nav-drawer" class="mobile-nav-drawer hidden">
        <div class="mobile-drawer-inner">
          <div class="mobile-section-title">Navigation</div>
          <div class="mobile-nav-links">
            <button class="mobile-nav-item nav-tab ${activeView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
              📊 Dashboard
            </button>
            <button class="mobile-nav-item nav-tab ${activeView === 'schedule' ? 'active' : ''}" data-view="schedule">
              📅 Schedules ${role === 'admin' ? '(Editable)' : ''}
            </button>
            <button class="mobile-nav-item nav-tab ${activeView === 'attendance' ? 'active' : ''}" data-view="attendance">
              📝 Lab Attendance ${role === 'leader' ? '(Leader Mode)' : ''}
            </button>
            <button class="mobile-nav-item nav-tab ${activeView === 'students' ? 'active' : ''}" data-view="students">
              👥 Students (${store.students.length})
            </button>
          </div>

          <div class="mobile-section-title mt-3">Access Mode</div>
          <div class="mobile-role-buttons">
            <button class="mobile-role-btn role-btn ${role === 'admin' ? 'active' : ''}" data-role="admin">
              ${auth.admin ? '🔓' : '🔒'} Admin (Data Entry)
            </button>
            <button class="mobile-role-btn role-btn ${role === 'leader' ? 'active' : ''}" data-role="leader">
              ${auth.leader ? '🔓' : '🔒'} Group Leader
            </button>
            <button class="mobile-role-btn role-btn ${role === 'student' ? 'active' : ''}" data-role="student">
              🎓 Student View
            </button>
          </div>

          <div class="mobile-drawer-footer mt-3">
            ${(auth.admin || auth.leader) ? `
              <button id="mobile-logout-btn" class="btn btn-outline-danger w-100 mb-2">
                🔒 Lock Session
              </button>
            ` : ''}
            <button id="mobile-theme-toggle-btn" class="btn btn-outline w-100">
              ${theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </header>
  `;

  // Hamburger Menu Toggle Handler
  const mobileToggleBtn = container.querySelector('#mobile-menu-toggle-btn');
  const mobileDrawer = container.querySelector('#mobile-nav-drawer');
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
      const isExpanded = !mobileDrawer.classList.contains('hidden');
      mobileToggleBtn.querySelector('.hamburger-icon').textContent = isExpanded ? '✕' : '☰';
    });
  }

  // Navigation tabs
  container.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('hidden');
      store.setActiveView(btn.dataset.view);
    });
  });

  // Role button clicks with password authentication
  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('hidden');
      const selectedRole = btn.dataset.role;

      if (selectedRole === 'student') {
        store.setRole('student');
        return;
      }

      if (selectedRole === 'admin') {
        if (auth.admin) {
          store.setRole('admin');
        } else {
          openPasswordModal('admin');
        }
        return;
      }

      if (selectedRole === 'leader') {
        if (auth.leader) {
          store.setRole('leader', activeGroup);
        } else {
          openPasswordModal('leader', activeGroup);
        }
        return;
      }
    });
  });

  const logoutBtn = container.querySelector('#logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => store.logout());

  const mobileLogoutBtn = container.querySelector('#mobile-logout-btn');
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', () => store.logout());

  const themeBtn = container.querySelector('#theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', () => store.setTheme(store.currentTheme === 'dark' ? 'light' : 'dark'));

  const mobileThemeBtn = container.querySelector('#mobile-theme-toggle-btn');
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', () => store.setTheme(store.currentTheme === 'dark' ? 'light' : 'dark'));
}
