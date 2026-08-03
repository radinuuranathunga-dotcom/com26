/**
 * ScheduleView.js - Interactive & Editable Timetable Grid for Lectures and Labs
 */
import { store } from '../store.js';
import { DAYS_OF_WEEK, formatTime } from '../utils/helpers.js';
import { openScheduleModal, openDeleteConfirmModal, openCourseModal } from './ModalManager.js';

export function renderScheduleView(container) {
  const role = store.currentRole;
  const lectures = store.data.lectures;
  const labs = store.data.labs;

  // Local view filter states
  let filterType = 'all'; // 'all' | 'lecture' | 'lab'
  let filterYear = 'all'; // 'all' | '1' | '2' | '3' | '4'
  let searchQuery = '';
  let matrixGroupFilter = 'all';

  function renderScheduleMatrixRows(groupFilter = 'all') {
    const timetable = store.ceLabTimetable;
    const dateMap = {};

    timetable.forEach(item => {
      const key = `${item.date}_${item.time}`;
      if (!dateMap[key]) {
        dateMap[key] = { date: item.date, time: item.time, EC3301: null, EC3203: null, EC3305: null };
      }
      dateMap[key][item.courseCode] = item;
    });

    return Object.values(dateMap).map(row => {
      const checkMatch = (item) => {
        if (!item) return false;
        if (groupFilter === 'all') return true;
        if (item.groups === 'ALL') return true;
        if (Array.isArray(item.groups)) return item.groups.includes(groupFilter);
        return false;
      };

      const is3301Match = checkMatch(row.EC3301);
      const is3203Match = checkMatch(row.EC3203);
      const is3305Match = checkMatch(row.EC3305);
      const isAnyMatch = groupFilter === 'all' || is3301Match || is3203Match || is3305Match;

      return `
        <tr style="${!isAnyMatch && groupFilter !== 'all' ? 'opacity: 0.3;' : ''}">
          <td class="font-bold text-cyan">${row.date}</td>
          <td class="font-mono font-xs text-muted">${row.time}</td>
          <td>
            ${row.EC3301 ? `
              <div style="${is3301Match && groupFilter !== 'all' ? 'background: rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 6px; border-left: 3px solid var(--accent-emerald);' : ''}">
                <strong class="${is3301Match && groupFilter !== 'all' ? 'text-emerald' : ''}">${row.EC3301.labNumber}:</strong> ${row.EC3301.groupText}
              </div>
            ` : '<span class="text-muted">-</span>'}
          </td>
          <td>
            ${row.EC3203 ? `
              <div style="${is3203Match && groupFilter !== 'all' ? 'background: rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 6px; border-left: 3px solid var(--accent-emerald);' : ''}">
                <strong class="${is3203Match && groupFilter !== 'all' ? 'text-emerald' : ''}">${row.EC3203.labNumber}:</strong> ${row.EC3203.groupText}
              </div>
            ` : '<span class="text-muted">-</span>'}
          </td>
          <td>
            ${row.EC3305 ? `
              <div style="${is3305Match && groupFilter !== 'all' ? 'background: rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 6px; border-left: 3px solid var(--accent-emerald);' : ''}">
                <strong class="${is3305Match && groupFilter !== 'all' ? 'text-emerald' : ''}">${row.EC3305.labNumber}:</strong> ${row.EC3305.groupText}
              </div>
            ` : '<span class="text-muted">-</span>'}
          </td>
        </tr>
      `;
    }).join('');
  }

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
            <button id="add-course-btn-top" class="btn btn-outline-cyan">
              <span>📚</span> Add New Module
            </button>
            <button id="add-lecture-btn" class="btn btn-primary">
              <span>➕</span> Add Lecture Slot
            </button>
            <button id="add-lab-btn" class="btn btn-secondary">
              <span>⚡</span> Add Lab Session
            </button>
            <button id="export-schedule-csv" class="btn btn-outline">
              📥 Export Schedule CSV
            </button>
          ` : ''}
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

      <!-- Official CE Group Lab Timetable Matrix -->
      <div class="card ce-lab-schedule-matrix-card mt-4 pad-md animate-fade-in" style="border: 1px solid var(--accent-indigo);">
        <div class="card-header-flex mb-3" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 class="text-indigo" style="margin: 0;">🗓️ Semester 3 Computer Engineering (CE) Group Lab Schedule</h3>
            <p class="sub-text font-xs text-muted" style="margin: 2px 0 0 0;">Official lab dates & time allocations for all 34 CE Groups (CE01 - CE34). Filter by group or search Student ID to highlight your sessions.</p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <label class="font-xs font-bold text-cyan" style="white-space: nowrap;">Filter by Lab Group:</label>
            <select id="schedule-matrix-group-select" class="form-select-sm">
              <option value="all">All Groups (CE01 - CE34)</option>
              ${store.labGroups.map(g => `<option value="${g.id}">${g.id} (${g.leaderName})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 110px;">Date</th>
                <th style="width: 140px;">Time</th>
                <th>EC3301 Analog Electronics</th>
                <th>EC3203 Measurements</th>
                <th>EC3305 Signals & Systems</th>
              </tr>
            </thead>
            <tbody id="ce-schedule-matrix-tbody">
              ${renderScheduleMatrixRows('all')}
            </tbody>
          </table>
        </div>
        <div class="font-xs text-muted mt-2">
          * Note: August 26, September 16, and September 18 are recess/holidays and are omitted. Sessions marked "All Groups" apply to all 34 CE Groups.
        </div>
      </div>

      <!-- Official Computer Engineering Laboratory Experiments Table -->
      <div class="card official-labs-card mt-4 pad-md animate-fade-in">
        <div class="card-header-flex mb-3" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3>🔬 Specialization: Computer Engineering - Practical Laboratory Modules</h3>
            <p class="sub-text">Official Computer Engineering Department Laboratory Experiments (${store.data.courses.map(c => c.code).join(', ')})</p>
          </div>
          ${role === 'admin' ? `
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="add-course-btn" class="btn btn-primary">
                ➕ Add New Module (Admin Only)
              </button>
              <button id="add-official-lab-btn" class="btn btn-emerald">
                ⚡ Add New Lab Session (Admin Only)
              </button>
            </div>
          ` : `
            <span class="badge badge-secondary">🔒 Admin Editing Only</span>
          `}
        </div>

        ${store.data.courses.map(course => {
          const courseLabs = labs.filter(l => l.courseCode === course.code || (l.courseCode && l.courseCode.includes(course.code)));
          return `
            <div class="module-labs-block mt-4 pad-sm" style="border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; background: rgba(0,0,0,0.15);">
              <div class="module-header-row" style="display: flex; justify-content: space-between; align-items: center; background: rgba(6, 182, 212, 0.12); padding: 10px 16px; border-radius: 8px; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <strong class="text-cyan font-md" style="font-size: 1.05rem;">${course.code} ${course.name}</strong>
                  <span class="sub-text ml-3 font-xs text-muted">Module Coordinator / Venue: ${course.professor || 'Communication Laboratory'} | Enrolled: ${course.enrolledCount || 195} Students</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="badge badge-emerald">${courseLabs.length} Experiments</span>
                  ${role === 'admin' ? `
                    <button class="btn btn-xs btn-outline-amber edit-course-btn" data-code="${course.code}">
                      ✏️ Edit Module
                    </button>
                    <button class="btn btn-xs btn-outline-rose delete-course-btn" data-code="${course.code}">
                      🗑️ Remove Module
                    </button>
                    <button class="btn btn-xs btn-emerald add-module-lab-btn" data-code="${course.code}">
                      ➕ Add Lab Session
                    </button>
                  ` : ''}
                </div>
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

    // CE Lab Timetable Matrix Group Filter
    const matrixGroupSelect = container.querySelector('#schedule-matrix-group-select');
    if (matrixGroupSelect) {
      matrixGroupSelect.value = matrixGroupFilter;
      matrixGroupSelect.addEventListener('change', (e) => {
        matrixGroupFilter = e.target.value;
        const tbody = container.querySelector('#ce-schedule-matrix-tbody');
        if (tbody) tbody.innerHTML = renderScheduleMatrixRows(matrixGroupFilter);
      });
    }

    // Admin Module (Course) Handlers
    const addCourseTopBtn = container.querySelector('#add-course-btn-top');
    if (addCourseTopBtn) {
      addCourseTopBtn.addEventListener('click', () => {
        openCourseModal(null);
      });
    }

    const addCourseBtn = container.querySelector('#add-course-btn');
    if (addCourseBtn) {
      addCourseBtn.addEventListener('click', () => {
        openCourseModal(null);
      });
    }

    container.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = store.data.courses.find(c => c.code === btn.dataset.code);
        if (item) openCourseModal(item);
      });
    });

    container.querySelectorAll('.delete-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.dataset.code;
        const item = store.data.courses.find(c => c.code === code);
        if (item) {
          openDeleteConfirmModal(`Remove Academic Module "${item.code}: ${item.name}" from semester curriculum?`, () => {
            store.deleteCourse(item.code);
          });
        }
      });
    });

    container.querySelectorAll('.add-module-lab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openScheduleModal('lab', null, btn.dataset.code);
      });
    });

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
        exportScheduleCsv(store.data.lectures, store.data.labs);
      });
    }
  }

  render();
}
