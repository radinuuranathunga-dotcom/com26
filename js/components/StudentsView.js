/**
 * StudentsView.js - Roster & Academic Records for 195 Department Students
 */
import { store } from '../store.js';
import { openStudentModal, openAddStudentModal, openDeleteStudentConfirmModal, openStudentScheduleModal } from './ModalManager.js';
import { exportStudentsCsv } from '../utils/exportImport.js';

export function renderStudentsView(container) {
  const role = store.currentRole;
  const isAdmin = role === 'admin';
  const isLeader = role === 'leader';
  const activeLeaderGroup = store.activeLeaderGroup || 'CE01';
  
  const students = store.data.students;
  const groups = store.data.labGroups;

  let selectedGroupFilter = isLeader ? activeLeaderGroup : 'all';
  let selectedYearFilter = 'all';
  let searchQuery = '';

  function render() {
    let filtered = students.filter(s => {
      if (isLeader && s.labGroup !== activeLeaderGroup) return false;
      if (selectedGroupFilter !== 'all' && s.labGroup !== selectedGroupFilter) return false;
      if (selectedYearFilter !== 'all' && String(s.year) !== selectedYearFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return s.id.toLowerCase().includes(q) ||
               s.name.toLowerCase().includes(q) ||
               s.email.toLowerCase().includes(q) ||
               s.labGroup.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-left">
          <h2>👥 Computer Engineering Student Roster</h2>
          <p class="view-description">
            ${isLeader 
              ? `<span class="highlight-text">⚡ Group Leader Mode: Showing student roster for your assigned group <strong>${activeLeaderGroup}</strong>.</span>`
              : `Managing total <strong>${students.length} students</strong> across 34 assigned laboratory groups (CE01 - CE34).`}
          </p>
        </div>

        <div class="view-header-right">
          ${(isAdmin || isLeader) ? `
            <button id="add-student-btn" class="btn btn-emerald">
              ➕ Add New Member to ${isLeader ? activeLeaderGroup : 'Group'}
            </button>
          ` : ''}
          ${isAdmin ? `
            <button id="export-students-csv" class="btn btn-outline">
              📥 Export Roster CSV
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Quick Student ID Lab Dates Lookup Tool -->
      <div class="card p-3 mb-4" style="background: rgba(30, 41, 59, 0.6); border: 1px solid var(--accent-indigo); border-radius: 12px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
          <div>
            <h4 style="margin: 0; font-size: 1.05rem;" class="text-cyan">🗓️ Quick Student ID Lab Schedule Search</h4>
            <p class="font-xs text-muted" style="margin: 2px 0 0 0;">Enter any Student Registration ID (e.g. <code>EG/2023/5999</code> or <code>EG/2024/6016</code>) or Group (e.g. <code>CE01</code>) to view assigned lab dates & times.</p>
          </div>
          <form id="quick-schedule-search-form" style="display: flex; gap: 8px; flex: 1; max-width: 420px;">
            <input type="text" id="quick-schedule-input" class="form-input-sm w-100" placeholder="e.g. EG/2023/5999 or CE01" required>
            <button type="submit" class="btn btn-sm btn-indigo" style="white-space: nowrap;">🔍 Check Dates</button>
          </form>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-toolbar card">
        <div class="filter-group">
          <label class="filter-label">Lab Group:</label>
          <select id="filter-group-select" class="form-select-sm" ${isLeader ? 'disabled' : ''}>
            <option value="all" ${selectedGroupFilter === 'all' ? 'selected' : ''}>All Groups (CE01 - CE34)</option>
            ${groups.map(g => `
              <option value="${g.id}" ${selectedGroupFilter === g.id ? 'selected' : ''}>${g.id} (${g.leaderName})</option>
            `).join('')}
          </select>
          ${isLeader ? `<span class="sub-text text-amber ml-2 font-xs">🔒 Locked to your group (${activeLeaderGroup})</span>` : ''}
        </div>

        <div class="filter-group">
          <label class="filter-label">Academic Year:</label>
          <select id="filter-year-select" class="form-select-sm">
            <option value="all" ${selectedYearFilter === 'all' ? 'selected' : ''}>All Years (Year 1 - 4)</option>
            <option value="1" ${selectedYearFilter === '1' ? 'selected' : ''}>Year 1</option>
            <option value="2" ${selectedYearFilter === '2' ? 'selected' : ''}>Year 2</option>
            <option value="3" ${selectedYearFilter === '3' ? 'selected' : ''}>Year 3</option>
            <option value="4" ${selectedYearFilter === '4' ? 'selected' : ''}>Year 4</option>
          </select>
        </div>

        <div class="filter-group search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="students-search-input" class="form-input-sm" placeholder="Search by name, ID, or email..." value="${searchQuery}">
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-count-bar">
        <span>Showing <strong>${filtered.length}</strong> of ${students.length} Students</span>
      </div>

      <!-- Student Directory Table -->
      <div class="card table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Year & Semester</th>
              <th>Assigned Lab Group</th>
              <th>Labs Attended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="6" class="text-center pad-lg">No students match your filter criteria.</td>
              </tr>
            ` : filtered.map(st => {
              const canEditThisStudent = isAdmin || (isLeader && st.labGroup === activeLeaderGroup);
              return `
                <tr class="student-row-item">
                  <td class="font-mono text-bold">${st.id}</td>
                  <td>
                    <div class="student-cell">
                      <span class="student-name">${st.name}</span>
                      ${st.isLeader ? '<span class="badge badge-leader">Group Leader</span>' : ''}
                      <span class="sub-text">${st.email}</span>
                    </div>
                  </td>
                  <td>Year ${st.year} (Sem ${st.semester})</td>
                  <td>
                    <span class="group-tag">${st.labGroup}</span>
                  </td>
                  <td>
                    <span class="font-bold text-cyan">${st.labsCompleted || 0}</span> / ${st.totalLabs || 10} Sessions
                  </td>
                  <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      <button class="btn btn-xs btn-outline-cyan view-schedule-btn" data-id="${st.id}">
                        🗓️ Lab Dates
                      </button>
                      <button class="btn btn-xs btn-outline view-student-btn" data-id="${st.id}">
                        👤 Profile
                      </button>
                      ${canEditThisStudent ? `
                        <button class="btn btn-xs btn-outline-cyan edit-student-btn" data-id="${st.id}">
                          ✏️ Edit
                        </button>
                        <button class="btn btn-xs btn-outline-rose remove-student-btn" data-id="${st.id}">
                          🗑️ Remove
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const groupSelect = container.querySelector('#filter-group-select');
    if (groupSelect) {
      groupSelect.addEventListener('change', (e) => {
        selectedGroupFilter = e.target.value;
        render();
      });
    }

    const yearSelect = container.querySelector('#filter-year-select');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        selectedYearFilter = e.target.value;
        render();
      });
    }

    const searchInput = container.querySelector('#students-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    const addStudentBtn = container.querySelector('#add-student-btn');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => {
        const groupToUse = isLeader ? activeLeaderGroup : 'CE01';
        openAddStudentModal(groupToUse);
      });
    }

    container.querySelectorAll('.view-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const student = students.find(s => s.id === btn.dataset.id);
        if (student) openStudentModal(student, false);
      });
    });

    container.querySelectorAll('.edit-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const student = students.find(s => s.id === btn.dataset.id);
        if (student) openStudentModal(student, true);
      });
    });

    container.querySelectorAll('.remove-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const student = students.find(s => s.id === btn.dataset.id);
        if (student) openDeleteStudentConfirmModal(student);
      });
    });

    const quickForm = container.querySelector('#quick-schedule-search-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputVal = container.querySelector('#quick-schedule-input').value;
        if (inputVal) openStudentScheduleModal(inputVal);
      });
    }

    container.querySelectorAll('.view-schedule-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openStudentScheduleModal(btn.dataset.id);
      });
    });

    const exportBtn = container.querySelector('#export-students-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportStudentsCsv(students);
      });
    }
  }

  render();
}
