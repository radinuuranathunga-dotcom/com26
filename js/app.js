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
    // 1. Render Header / Navbar
    renderNavbar(navbarContainer);

    // 2. Render Active View
    const currentView = store.activeView;

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

  // Subscribe to central store changes
  store.subscribe(() => {
    updateUI();
  });

  // Initial render
  updateUI();
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
