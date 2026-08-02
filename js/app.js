/**
 * app.js - Main Application Orchestrator & View Switcher
 */
import { store } from './store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderDashboardView } from './components/DashboardView.js';
import { renderScheduleView } from './components/ScheduleView.js';
import { renderAttendanceView } from './components/AttendanceView.js';
import { renderStudentsView } from './components/StudentsView.js';

function initApp() {
  const navbarContainer = document.getElementById('navbar-container');
  const viewContainer = document.getElementById('view-container');

  function updateUI() {
    try {
      // 1. Render Header / Navbar
      if (navbarContainer) renderNavbar(store.activeView);

      // 2. Render Active View
      const currentView = store.activeView;

      if (viewContainer) {
        switch (currentView) {
          case 'dashboard':
            renderDashboardView(viewContainer);
            break;
          case 'schedule':
            renderScheduleView(viewContainer);
            break;
          case 'attendance':
            renderAttendanceView(viewContainer);
            break;
          case 'students':
            renderStudentsView(viewContainer);
            break;
          default:
            renderDashboardView(viewContainer);
            break;
        }
      }
    } catch (err) {
      console.error("UI Render Error caught:", err);
      try {
        try { localStorage.clear(); } catch (e) {}
        store.resetToDefaults();
      } catch (e) {
        console.error("Reset error:", e);
      }
    }
  }

  // Subscribe to central store changes
  store.subscribe(() => {
    updateUI();
  });

  // Initial render
  updateUI();
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
