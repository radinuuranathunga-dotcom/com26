/**
 * ScheduleView.js - Interactive & Editable Timetable Grid for Lectures and Labs
 */
import { store } from '../store.js';
import { DAYS_OF_WEEK, formatTime } from '../utils/helpers.js';
import { openScheduleModal, openDeleteConfirmModal } from './ModalManager.js';

export function renderScheduleView(container) {
  const role = store.currentRole;
  const lectures = store.data.lectures;
  const labs = store.data.labs;

  // Local view filter states
  let filterType = 'all'; // 'all' | 'lecture' | 'lab'
  let filterYear = 'all'; // 'all' | '1' | '2' | '3' | '4'
  let searchQuery = '';

  function render() {
    // Filter logic
    let filteredLectures = lectures.filter(l => {
      if (filterType === 'lab') return false;
      if (filterYear !== 'all' && String(l.year) !== filterYear) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return l.courseCode.toLowerCase().includes(q) ||
               l.courseName.toLowerCase().includes(q) ||
               l.lecturer.toLowerCase().includes(q) ||
               l.room.toLowerCase().includes(q);
      }
      return true;
    });

    let filteredLabs = labs.filter(b => {
      if (filterType === 'lecture') return false;
      if (filterYear !== 'all' && String(b.year) !== filterYear) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return b.courseCode.toLowerCase().includes(q) ||
               b.labName.toLowerCase().includes(q) ||
               b.instructor.toLowerCase().includes(q) ||
               b.assignedGroup.toLowerCase().includes(q) ||
               b.room.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-left">
          <h2>📅 Timetable & Course Schedules</h2>
          <p class="view-description">
            View and manage department lecture classes and practical laboratory sessions.
            ${role === 'admin' ? '<strong class="highlight-text">👑 Admin Mode Authorized: You can enter & edit lecture/lab schedules.</strong>' : '<span class="text-secondary font-italic">ℹ️ Schedule & course data entry is managed exclusively by Admin / Faculty.</span>'}
          </p>
        </div>

        <div class="view-header-right">
          ${role === 'admin' ? `
            <button id="add-lecture-btn" class="btn btn-primary">
              <span>➕</span> Add Lecture Slot
            </button>
            <button id="add-lab-btn" class="btn btn-secondary">
              <span>⚡</span> Add Lab Session
            </button>
          ` : ''}
          <button id="export-schedule-csv" class="btn btn-outline">
            📥 Export Schedule CSV
          </button>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="filter-toolbar card">
        <div class="filter-group">
          <label class="filter-label">Filter Type:</label>
          <div class="btn-group">
            <button class="btn-sm btn-toggle ${filterType === 'all' ? 'active' : ''}" data-type="all">All Schedules</button>
            <button class="btn-sm btn-toggle ${filterType === 'lecture' ? 'active' : ''}" data-type="lecture">Lectures Only</button>
            <button class="btn-sm btn-toggle ${filterType === 'lab' ? 'active' : ''}" data-type="lab">Labs Only</button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Academic Year:</label>
          <select id="schedule-year-select" class="form-select-sm">
            <option value="all" ${filterYear === 'all' ? 'selected' : ''}>All Years (Year 1 - 4)</option>
            <option value="1" ${filterYear === '1' ? 'selected' : ''}>Year 1 (Semesters 1 & 2)</option>
            <option value="2" ${filterYear === '2' ? 'selected' : ''}>Year 2 (Semesters 3 & 4)</option>
            <option value="3" ${filterYear === '3' ? 'selected' : ''}>Year 3 (Semesters 5 & 6)</option>
            <option value="4" ${filterYear === '4' ? 'selected' : ''}>Year 4 (Semesters 7 & 8)</option>
          </select>
        </div>

        <div class="filter-group search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="schedule-search-input" class="form-input-sm" placeholder="Search by course, lecturer, or room..." value="${searchQuery}">
        </div>
      </div>

      <!-- Weekly Schedule Timetable Grid -->
      <div class="timetable-grid-container card">
        <div class="timetable-grid">
          ${DAYS_OF_WEEK.map(day => {
            const dayLectures = filteredLectures.filter(l => l.day === day);
            const dayLabs = filteredLabs.filter(b => b.day === day);
            const totalCount = dayLectures.length + dayLabs.length;

            return `
              <div class="timetable-day-column">
                <div class="day-header">
                  <span class="day-name">${day}</span>
                  <span class="day-badge">${totalCount} Session${totalCount !== 1 ? 's' : ''}</span>
                </div>

                <div class="day-events-list">
                  ${totalCount === 0 ? `
                    <div class="empty-day-state">No scheduled sessions</div>
                  ` : ''}

                  <!-- Render Lectures for this day -->
                  ${dayLectures.map(lec => `
                    <div class="event-card lecture-card animate-fade-in" data-id="${lec.id}" data-item-type="lecture">
                      <div class="event-card-header">
                        <span class="event-type-tag tag-lecture">Lecture</span>
                        <span class="event-time">${formatTime(lec.startTime)} - ${formatTime(lec.endTime)}</span>
                      </div>

                      <h4 class="event-title">${lec.courseCode}: ${lec.courseName}</h4>

                      <div class="event-details">
                        <div class="detail-row">
                          <span class="detail-icon">👨‍🏫</span>
                          <span class="detail-text">${lec.lecturer}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-icon">🏛️</span>
                          <span class="detail-text">${lec.room}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-icon">🎓</span>
                          <span class="detail-text">Year ${lec.year} (Sem ${lec.semester})</span>
                        </div>
                      </div>

                      ${role === 'admin' ? `
                        <div class="event-card-actions">
                          <button class="btn-icon edit-lecture-btn" data-id="${lec.id}" title="Edit Lecture Schedule">✏️ Edit</button>
                          <button class="btn-icon delete-lecture-btn" data-id="${lec.id}" title="Delete Lecture">🗑️ Delete</button>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}

                  <!-- Render Labs for this day -->
                  ${dayLabs.map(lab => `
                    <div class="event-card lab-card animate-fade-in" data-id="${lab.id}" data-item-type="lab">
                      <div class="event-card-header">
                        <span class="event-type-tag tag-lab">⚡ Practical Lab</span>
                        <span class="event-time">${formatTime(lab.startTime)} - ${formatTime(lab.endTime)}</span>
                      </div>

                      <h4 class="event-title">${lab.courseCode}: ${lab.labName}</h4>

                      <div class="event-details">
                        <div class="detail-row">
                          <span class="detail-icon">👥</span>
                          <span class="detail-text highlight-group">${lab.assignedGroup}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-icon">👨‍🔬</span>
                          <span class="detail-text">${lab.instructor}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-icon">🔬</span>
                          <span class="detail-text">${lab.room}</span>
                        </div>
                        ${lab.equipment ? `
                          <div class="detail-row equipment-row">
                            <span class="detail-icon">🛠️</span>
                            <span class="detail-text equipment-text">${lab.equipment}</span>
                          </div>
                        ` : ''}
                      </div>

                      <div class="event-card-actions">
                        <button class="btn btn-xs btn-cyan take-lab-att-btn" data-lab-id="${lab.id}" data-group="${lab.assignedGroup}">
                          ⚡ Take Attendance
                        </button>
                        ${role === 'admin' ? `
                          <button class="btn-icon edit-lab-btn" data-id="${lab.id}" title="Edit Lab Schedule">✏️ Edit</button>
                          <button class="btn-icon delete-lab-btn" data-id="${lab.id}" title="Delete Lab">🗑️</button>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Official Computer Engineering Laboratory Experiments Table -->
      <div class="card official-labs-card mt-4 pad-md animate-fade-in">
        <div class="card-header-flex mb-3" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3>🔬 Specialization: Computer Engineering - Practical Laboratory Modules</h3>
            <p class="sub-text">Official Computer Engineering Department Laboratory Experiments (EC3301, EC3203, EC3305)</p>
          </div>
          ${role === 'admin' ? `
            <button id="add-official-lab-btn" class="btn btn-emerald">
              ➕ Add New Lab Session (Admin Only)
            </button>
          ` : `
            <span class="badge badge-secondary">🔒 Admin Editing Only</span>
          `}
        </div>

        ${store.data.courses.map(course => {
          const courseLabs = labs.filter(l => l.courseCode === course.code || (l.courseCode && l.courseCode.includes(course.code)));
          return `
            <div class="module-labs-block mt-4 pad-sm" style="border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; background: rgba(0,0,0,0.15);">
              <div class="module-header-row" style="display: flex; justify-content: space-between; align-items: center; background: rgba(6, 182, 212, 0.12); padding: 10px 16px; border-radius: 8px; margin-bottom: 12px;">
                <div>
                  <strong class="text-cyan font-md" style="font-size: 1.05rem;">${course.code} ${course.name}</strong>
                  <span class="sub-text ml-3 font-xs text-muted">Module Coordinator / Venue: Communication Laboratory | Enrolled: 195 Students</span>
                </div>
                <span class="badge badge-emerald">${courseLabs.length} Experiments</span>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width: 120px;">Lab Session</th>
                      <th>Lab Title / Experiment Name</th>
                      <th>Module Coordinator / Venue</th>
                      <th style="width: 130px;">No. of Students</th>
                      <th style="width: 180px;">Actions (Admin Only)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${courseLabs.length === 0 ? `
                      <tr>
                        <td colspan="5" class="text-center text-muted pad-sm">No practical lab experiments recorded for ${course.code}.</td>
                      </tr>
                    ` : courseLabs.map(lab => `
                      <tr>
                        <td><span class="badge badge-cyan font-mono">${lab.labNumber || 'Lab'}</span></td>
                        <td><strong class="text-bold">${lab.labTitle || lab.labName}</strong></td>
                        <td><span class="text-muted">${lab.coordinator || lab.venue || 'Communication Laboratory'}</span></td>
                        <td><span class="font-bold text-cyan">${lab.noOfStudents || 195}</span></td>
                        <td>
                          ${role === 'admin' ? `
                            <div style="display: flex; gap: 6px;">
                              <button class="btn btn-xs btn-outline-cyan edit-lab-btn" data-id="${lab.id}">
                                ✏️ Edit
                              </button>
                              <button class="btn btn-xs btn-outline-rose delete-lab-btn" data-id="${lab.id}">
                                🗑️ Delete
                              </button>
                            </div>
                          ` : `
                            <span class="text-muted font-xs">🔒 View Only</span>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Filter type buttons
    container.querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        filterType = btn.dataset.type;
        render();
      });
    });

    // Year select filter
    const yearSelect = container.querySelector('#schedule-year-select');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        filterYear = e.target.value;
        render();
      });
    }

    // Search input
    const searchInput = container.querySelector('#schedule-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    // Admin add buttons
    const addLecBtn = container.querySelector('#add-lecture-btn');
    if (addLecBtn) {
      addLecBtn.addEventListener('click', () => {
        openScheduleModal('lecture', null);
      });
    }

    const addLabBtn = container.querySelector('#add-lab-btn');
    if (addLabBtn) {
      addLabBtn.addEventListener('click', () => {
        openScheduleModal('lab', null);
      });
    }

    const addOfficialLabBtn = container.querySelector('#add-official-lab-btn');
    if (addOfficialLabBtn) {
      addOfficialLabBtn.addEventListener('click', () => {
        openScheduleModal('lab', null);
      });
    }

    // Admin Edit & Delete Handlers
    container.querySelectorAll('.edit-lecture-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = store.data.lectures.find(l => l.id === btn.dataset.id);
        if (item) openScheduleModal('lecture', item);
      });
    });

    container.querySelectorAll('.delete-lecture-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = store.data.lectures.find(l => l.id === btn.dataset.id);
        if (item) {
          openDeleteConfirmModal(`Delete Lecture "${item.courseName}"?`, () => {
            store.deleteLecture(item.id);
          });
        }
      });
    });

    container.querySelectorAll('.edit-lab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = store.data.labs.find(b => b.id === btn.dataset.id);
        if (item) openScheduleModal('lab', item);
      });
    });

    container.querySelectorAll('.delete-lab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = store.data.labs.find(b => b.id === btn.dataset.id);
        if (item) {
          openDeleteConfirmModal(`Delete Lab "${item.labName}"?`, () => {
            store.deleteLab(item.id);
          });
        }
      });
    });

    // Take Attendance Shortcut
    container.querySelectorAll('.take-lab-att-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const group = btn.dataset.group;
        store.setRole('leader', group);
        store.setActiveView('attendance');
      });
    });

    // Export CSV
    const exportBtn = container.querySelector('#export-schedule-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        import('../utils/exportImport.js').then(module => {
          module.exportScheduleCsv(store.data.lectures, store.data.labs);
        });
      });
    }
  }

  render();
}
