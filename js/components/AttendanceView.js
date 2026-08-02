/**
 * AttendanceView.js - Lab Attendance Tracker & Department Master Summary
 * Access Control Rule: ONLY Lab Group Leaders are authorized to mark attendance for their assigned group.
 * Admin Access Rule: Department Admins have full access to view, analyze, and export Department Master Attendance Summaries (195 Students x 11 Labs).
 */
import { store } from '../store.js';
import { showToast } from '../utils/helpers.js';
import { exportAttendanceLogCsv, exportMasterAttendanceCsv } from '../utils/exportImport.js';
import { openEditLabGroupModal, openScheduleModal, openAddStudentModal, openStudentModal, openDeleteStudentConfirmModal } from './ModalManager.js';

export function renderAttendanceView(container) {
  const role = store.currentRole;
  const groups = store.data.labGroups;
  const labs = store.data.labs;

  const isLeaderAuthorized = (role === 'leader');
  const isAdmin = (role === 'admin');
  const canEditMembers = isLeaderAuthorized || isAdmin;

  // Selected state
  let selectedGroup = store.activeLeaderGroup || (groups.length > 0 ? groups[0].id : 'CE01');
  let selectedLabId = labs.length > 0 ? labs[0].id : '';

  // Admin summary state
  let adminViewTab = isAdmin ? 'summary' : 'register'; // 'summary' | 'register'
  let summaryGroupFilter = 'all';
  let summarySearchQuery = '';

  // In-memory draft attendance records for batch editing
  let draftRecords = {};

  function initDraftRecords() {
    const students = store.getStudentsByGroup(selectedGroup);
    const existingLog = store.data.attendanceLogs.find(
      l => l.labId === selectedLabId && l.group === selectedGroup
    );

    draftRecords = {};
    students.forEach(st => {
      if (existingLog && existingLog.records && existingLog.records[st.id]) {
        draftRecords[st.id] = { ...existingLog.records[st.id] };
      } else {
        draftRecords[st.id] = {
          status: 'Unmarked',
          notes: ''
        };
      }
    });
  }

  function renderAdminMasterSummaryHtml() {
    const allStudents = store.data.students;
    const allLabs = store.data.labs;
    const allLogs = store.data.attendanceLogs;

    // Filter students
    let filteredStudents = allStudents.filter(s => {
      if (summaryGroupFilter !== 'all' && s.labGroup !== summaryGroupFilter) return false;
      if (summarySearchQuery) {
        const q = summarySearchQuery.toLowerCase();
        return s.id.toLowerCase().includes(q) ||
               s.name.toLowerCase().includes(q) ||
               s.labGroup.toLowerCase().includes(q);
      }
      return true;
    });

    // Map attendance logs into quick matrix: logMatrix[studentId][labId] = status
    const logMatrix = {};
    allLogs.forEach(log => {
      if (log.records && log.labId) {
        Object.keys(log.records).forEach(stId => {
          if (!logMatrix[stId]) logMatrix[stId] = {};
          logMatrix[stId][log.labId] = log.records[stId].status;
        });
      }
    });

    // Compute Overall Department Stats
    let totalPossiblePresentations = allStudents.length * allLabs.length;
    let actualAttendedCount = 0;
    let hundredPercentCount = 0;
    let atRiskCount = 0;

    allStudents.forEach(s => {
      let stCompleted = 0;
      allLabs.forEach(l => {
        const st = (logMatrix[s.id] && logMatrix[s.id][l.id]) ? logMatrix[s.id][l.id] : 'Unmarked';
        if (st === 'Present' || st === 'Late') {
          stCompleted++;
          actualAttendedCount++;
        }
      });
      if (stCompleted === allLabs.length && allLabs.length > 0) hundredPercentCount++;
      if (allLabs.length > 0 && (stCompleted / allLabs.length) < 0.8) atRiskCount++;
    });

    const deptRate = totalPossiblePresentations > 0 ? ((actualAttendedCount / totalPossiblePresentations) * 100).toFixed(1) : 0;

    return `
      <!-- Department Analytics Cards -->
      <div class="stats-overview-grid mb-4">
        <div class="stat-card card animate-scale-up">
          <div class="stat-card-header">
            <span class="stat-title">Dept Attendance Rate</span>
            <span class="stat-icon text-cyan">📊</span>
          </div>
          <div class="stat-number text-cyan">${deptRate}%</div>
          <div class="sub-text font-xs">Across 195 Students & 11 Practical Labs</div>
        </div>

        <div class="stat-card card animate-scale-up">
          <div class="stat-card-header">
            <span class="stat-title">100% Completed Labs</span>
            <span class="stat-icon text-emerald">🏆</span>
          </div>
          <div class="stat-number text-emerald">${hundredPercentCount}</div>
          <div class="sub-text font-xs">Students completed all 11 experiments</div>
        </div>

        <div class="stat-card card animate-scale-up">
          <div class="stat-card-header">
            <span class="stat-title">At Risk (<80% Attendance)</span>
            <span class="stat-icon text-rose">⚠️</span>
          </div>
          <div class="stat-number text-rose">${atRiskCount}</div>
          <div class="sub-text font-xs">Students requiring attendance warning</div>
        </div>

        <div class="stat-card card animate-scale-up">
          <div class="stat-card-header">
            <span class="stat-title">Total Practical Labs</span>
            <span class="stat-icon text-amber">🧪</span>
          </div>
          <div class="stat-number text-amber">${allLabs.length} Labs</div>
          <div class="sub-text font-xs">EC3301, EC3203 & EC3305 Modules</div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-toolbar card mb-3">
        <div class="filter-group">
          <label class="filter-label">Filter Practical Group:</label>
          <select id="admin-summary-group-select" class="form-select-sm">
            <option value="all" ${summaryGroupFilter === 'all' ? 'selected' : ''}>All 34 Groups (CE01 - CE34)</option>
            ${groups.map(g => `
              <option value="${g.id}" ${summaryGroupFilter === g.id ? 'selected' : ''}>${g.id} (${g.leaderName})</option>
            `).join('')}
          </select>
        </div>

        <div class="filter-group search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="admin-summary-search" class="form-input-sm" placeholder="Search student ID or name..." value="${summarySearchQuery}">
        </div>
      </div>

      <!-- Master Full Attendance Matrix Table -->
      <div class="card table-container animate-fade-in">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 120px;">Student ID</th>
                <th>Full Name</th>
                <th style="width: 75px;">Group</th>
                ${allLabs.map(l => `
                  <th style="text-align: center; width: 75px;" title="${l.courseCode}: ${l.labTitle || l.labName}">
                    <span class="font-mono text-cyan" style="font-size: 0.72rem;">${l.courseCode}</span><br>
                    <span class="font-bold">${l.labNumber || 'Lab'}</span>
                  </th>
                `).join('')}
                <th style="text-align: center; width: 90px;">Completed</th>
                <th style="text-align: center; width: 85px;">Rate %</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.length === 0 ? `
                <tr>
                  <td colspan="${allLabs.length + 5}" class="text-center pad-md text-muted">No student records found matching search filters.</td>
                </tr>
              ` : filteredStudents.map(st => {
                let completedCount = 0;
                return `
                  <tr>
                    <td class="font-mono text-bold">${st.id}</td>
                    <td>
                      <span class="student-name font-sm">${st.name}</span>
                      ${st.isLeader ? '<span class="badge badge-leader ml-1">Leader</span>' : ''}
                    </td>
                    <td><span class="group-tag font-xs">${st.labGroup}</span></td>
                    ${allLabs.map(l => {
                      const status = (logMatrix[st.id] && logMatrix[st.id][l.id]) ? logMatrix[st.id][l.id] : 'Unmarked';
                      let badgeClass = 'badge-secondary';
                      let badgeChar = '-';
                      if (status === 'Present') { badgeClass = 'badge-emerald'; badgeChar = 'P'; completedCount++; }
                      else if (status === 'Late') { badgeClass = 'badge-warning'; badgeChar = 'L'; completedCount++; }
                      else if (status === 'Absent') { badgeClass = 'badge-rose'; badgeChar = 'A'; }
                      else if (status === 'Excused') { badgeClass = 'badge-purple'; badgeChar = 'E'; }

                      return `
                        <td style="text-align: center;" title="${st.name} (${l.courseCode} ${l.labNumber}): ${status}">
                          <span class="badge ${badgeClass} font-mono" style="padding: 3px 7px; font-weight: 700;">${badgeChar}</span>
                        </td>
                      `;
                    }).join('')}
                    <td style="text-align: center;">
                      <span class="font-bold text-cyan">${completedCount}</span> / ${allLabs.length}
                    </td>
                    <td style="text-align: center;">
                      <span class="badge ${((completedCount/allLabs.length)>=0.8) ? 'badge-emerald' : 'badge-rose'} font-mono">
                        ${allLabs.length > 0 ? ((completedCount / allLabs.length) * 100).toFixed(0) : 0}%
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function render() {
    initDraftRecords();
    const currentGroupInfo = groups.find(g => g.id === selectedGroup) || groups[0];
    const groupStudents = store.getStudentsByGroup(selectedGroup);
    const selectedLab = labs.find(l => l.id === selectedLabId) || labs[0];

    // Compute live draft stats
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let unmarkedCount = 0;

    Object.values(draftRecords).forEach(rec => {
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
      else unmarkedCount++;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-left">
          <h2>🧪 Lab Attendance Tracker</h2>
          <p class="view-description">
            ${isAdmin 
              ? '<span class="highlight-text">👑 Admin Mode: Full Department Master Attendance & Group Overview.</span>'
              : (isLeaderAuthorized 
                  ? '<span class="highlight-text">⚡ Group Leader Authorized: You can record attendance and add/edit members in your group.</span>' 
                  : '<span class="text-rose font-bold">🔒 Restricted View: Only Lab Group Leaders are authorized to mark attendance.</span>')}
          </p>
        </div>

        <div class="view-header-right">
          ${isAdmin ? `
            <button id="export-master-attendance-csv" class="btn btn-emerald">
              📥 Export Master Attendance CSV (195 Students)
            </button>
          ` : (isLeaderAuthorized ? `
            <button id="save-attendance-btn" class="btn btn-emerald btn-lg animate-pulse">
              💾 Save & Submit Register
            </button>
          ` : `
            <button class="btn btn-secondary" onclick="window.setLeaderRoleQuick()">
              ⚡ Switch to Group Leader Mode to Take Attendance
            </button>
          `)}
          <button id="export-log-csv" class="btn btn-outline">
            📥 Export Group Log CSV
          </button>
        </div>
      </div>

      <!-- Admin Mode View Switcher Nav Bar -->
      ${isAdmin ? `
        <div class="admin-summary-nav card mb-4 pad-sm" style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(6, 182, 212, 0.3);">
          <div style="display: flex; gap: 10px; align-items: center;">
            <strong class="text-cyan font-md">👑 Admin View Mode:</strong>
            <button id="toggle-admin-summary-btn" class="btn btn-sm ${adminViewTab === 'summary' ? 'btn-primary' : 'btn-outline'}">
              📊 Full Department Master Summary (195 Students x 11 Labs)
            </button>
            <button id="toggle-admin-register-btn" class="btn btn-sm ${adminViewTab === 'register' ? 'btn-primary' : 'btn-outline'}">
              🧪 Particular Group Register View
            </button>
          </div>
        </div>
      ` : ''}

      ${(isAdmin && adminViewTab === 'summary') ? renderAdminMasterSummaryHtml() : `
        <!-- Particular Lab Experiment Config Card -->
        <div class="card session-config-card">
          <div class="config-grid">
            <div class="config-field">
              <div class="field-header-row">
                <label class="form-label">Selected Lab Group:</label>
                ${isAdmin ? `<button id="edit-current-group-btn" class="btn-icon btn-xs text-cyan" title="Edit Lab Group Configuration">✏️ Edit Group</button>` : ''}
              </div>
              <select id="attendance-group-select" class="form-select" ${isLeaderAuthorized ? 'disabled' : ''}>
                ${groups.map(g => `
                  <option value="${g.id}" ${g.id === selectedGroup ? 'selected' : ''}>
                    ${g.name} - Leader: ${g.leaderName}
                  </option>
                `).join('')}
              </select>
              ${isLeaderAuthorized ? `<span class="sub-text text-amber mt-1">🔒 Group Isolated: Locked to your assigned group (${selectedGroup})</span>` : ''}
            </div>

            <div class="config-field" style="grid-column: span 2;">
              <div class="field-header-row">
                <label class="form-label">Select Particular Practical Lab Experiment:</label>
                ${isAdmin ? `<button id="edit-current-lab-btn" class="btn-icon btn-xs text-cyan" title="Edit Lab Course Session">✏️ Edit Session</button>` : ''}
              </div>
              <select id="attendance-lab-select" class="form-select font-bold text-cyan" style="font-size: 0.95rem;">
                ${store.data.courses.map(course => {
                  const courseLabs = labs.filter(l => l.courseCode === course.code || (l.courseCode && l.courseCode.includes(course.code)));
                  return `
                    <optgroup label="${course.code}: ${course.name}">
                      ${courseLabs.map(l => `
                        <option value="${l.id}" ${l.id === selectedLabId ? 'selected' : ''}>
                          ${l.labNumber || 'Lab'}: ${l.labTitle || l.labName} (${l.coordinator || l.venue || 'Communication Lab'})
                        </option>
                      `).join('')}
                    </optgroup>
                  `;
                }).join('')}
              </select>
            </div>

            <div class="config-field leader-badge-box">
              <label class="form-label">Recorded By (Group Leader):</label>
              <div class="leader-badge-pill">
                <span class="leader-avatar">👤</span>
                <span class="leader-name">${currentGroupInfo ? currentGroupInfo.leaderName : 'Group Leader'}</span>
                <span class="leader-title">(${selectedGroup})</span>
              </div>
            </div>
          </div>

          <!-- Particular Selected Experiment Info Banner -->
          ${selectedLab ? `
            <div class="mt-3 pad-sm" style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <span class="badge badge-cyan font-mono">${selectedLab.labNumber || 'Lab Experiment'}</span>
                <strong class="text-cyan ml-2 font-md">${selectedLab.courseCode}: ${selectedLab.labTitle || selectedLab.labName}</strong>
                <p class="font-xs text-muted mb-0 mt-1">Module: <strong>${selectedLab.courseName || selectedLab.courseCode}</strong> | Venue / Coordinator: <strong>${selectedLab.coordinator || selectedLab.venue || 'Communication Laboratory'}</strong> | Group Enrolled: <strong>195 Students (${selectedGroup})</strong></p>
              </div>
              <div class="text-emerald font-bold font-xs" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 20px;">
                🎯 Particular Experiment Register
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Live Summary Bar -->
        <div class="attendance-summary-bar card">
          <div class="summary-stat">
            <span class="stat-label">Total Group Roster</span>
            <span class="stat-value">${groupStudents.length} Students</span>
          </div>
          <div class="summary-stat text-muted" style="opacity: 0.85;">
            <span class="stat-label">Unmarked</span>
            <span class="stat-value" id="stat-unmarked-count">${unmarkedCount}</span>
          </div>
          <div class="summary-stat text-success">
            <span class="stat-label">Present</span>
            <span class="stat-value" id="stat-present-count">${presentCount}</span>
          </div>
          <div class="summary-stat text-warning">
            <span class="stat-label">Late</span>
            <span class="stat-value" id="stat-late-count">${lateCount}</span>
          </div>
          <div class="summary-stat text-danger">
            <span class="stat-label">Absent</span>
            <span class="stat-value" id="stat-absent-count">${absentCount}</span>
          </div>

          <div class="summary-actions">
            ${canEditMembers ? `
              <button id="add-group-member-btn" class="btn btn-sm btn-emerald mr-2">
                ➕ Add Member to ${selectedGroup}
              </button>
            ` : ''}
            ${isLeaderAuthorized ? `
              <button id="mark-all-present-btn" class="btn btn-sm btn-outline-success">
                ✅ Mark All Present
              </button>
            ` : '<span class="text-muted font-sm font-italic">Locked (Leader Only)</span>'}
          </div>
        </div>

        <!-- Student Attendance Table -->
        <div class="card table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Student ID</th>
                <th>Student Full Name</th>
                <th>Attendance Status</th>
                <th>Lab Task Notes & Comments</th>
                ${canEditMembers ? '<th>Member Actions</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${groupStudents.length === 0 ? `
                <tr>
                  <td colspan="${canEditMembers ? 6 : 5}" class="text-center pad-lg">No students found in this group. Use "➕ Add Member" above to add students.</td>
                </tr>
              ` : groupStudents.map((st, idx) => {
                const rec = draftRecords[st.id] || { status: 'Unmarked', notes: '' };
                return `
                  <tr class="student-row" data-id="${st.id}">
                    <td class="text-muted font-mono">${idx + 1}</td>
                    <td class="font-mono text-bold">${st.id}</td>
                    <td>
                      <div class="student-name-box">
                        <span class="name">${st.name}</span>
                        ${st.isLeader ? '<span class="badge badge-leader">Leader</span>' : ''}
                        <span class="sub-text">${st.email}</span>
                      </div>
                    </td>
                    <td>
                      <div class="status-toggle-group ${!isLeaderAuthorized ? 'disabled-group' : ''}">
                        <button class="status-btn btn-present ${rec.status === 'Present' ? 'active' : ''}" ${!isLeaderAuthorized ? 'disabled' : ''} data-id="${st.id}" data-status="Present">Present</button>
                        <button class="status-btn btn-late ${rec.status === 'Late' ? 'active' : ''}" ${!isLeaderAuthorized ? 'disabled' : ''} data-id="${st.id}" data-status="Late">Late</button>
                        <button class="status-btn btn-absent ${rec.status === 'Absent' ? 'active' : ''}" ${!isLeaderAuthorized ? 'disabled' : ''} data-id="${st.id}" data-status="Absent">Absent</button>
                        <button class="status-btn btn-excused ${rec.status === 'Excused' ? 'active' : ''}" ${!isLeaderAuthorized ? 'disabled' : ''} data-id="${st.id}" data-status="Excused">Excused</button>
                      </div>
                    </td>
                    <td>
                      <input type="text" class="form-input-sm note-input" ${!isLeaderAuthorized ? 'disabled placeholder="View only..."' : 'placeholder="e.g. Completed Task 2..."'} data-id="${st.id}" value="${rec.notes || ''}">
                    </td>
                    ${canEditMembers ? `
                      <td>
                        <div class="action-btn-group" style="display: flex; gap: 4px;">
                          <button class="btn btn-xs btn-outline-cyan edit-member-btn" data-id="${st.id}">
                            ✏️ Edit
                          </button>
                          <button class="btn btn-xs btn-outline-rose remove-member-btn" data-id="${st.id}">
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
      `}
    `;

    // Global quick helper
    window.setLeaderRoleQuick = () => {
      if (!store.authenticatedRoles.leader) {
        import('./ModalManager.js').then(module => {
          module.openPasswordModal('leader', selectedGroup);
        });
      } else {
        store.setRole('leader', selectedGroup);
        showToast(`Switched to Group Leader Mode (${selectedGroup})! You can now mark attendance.`, 'success');
      }
    };

    attachEvents();
  }

  function updateLiveSummary() {
    if (!isLeaderAuthorized) return;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let unmarkedCount = 0;

    Object.values(draftRecords).forEach(rec => {
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
      else unmarkedCount++;
    });

    const uEl = container.querySelector('#stat-unmarked-count');
    const pEl = container.querySelector('#stat-present-count');
    const lEl = container.querySelector('#stat-late-count');
    const aEl = container.querySelector('#stat-absent-count');

    if (uEl) uEl.textContent = unmarkedCount;
    if (pEl) pEl.textContent = presentCount;
    if (lEl) lEl.textContent = lateCount;
    if (aEl) aEl.textContent = absentCount;
  }

  function attachEvents() {
    // Admin Master View Tab buttons
    const btnSummary = container.querySelector('#toggle-admin-summary-btn');
    if (btnSummary) {
      btnSummary.addEventListener('click', () => {
        adminViewTab = 'summary';
        render();
      });
    }

    const btnRegister = container.querySelector('#toggle-admin-register-btn');
    if (btnRegister) {
      btnRegister.addEventListener('click', () => {
        adminViewTab = 'register';
        render();
      });
    }

    // Admin Master Summary Filter inputs
    const adminGrpSelect = container.querySelector('#admin-summary-group-select');
    if (adminGrpSelect) {
      adminGrpSelect.addEventListener('change', (e) => {
        summaryGroupFilter = e.target.value;
        render();
      });
    }

    const adminSearchInput = container.querySelector('#admin-summary-search');
    if (adminSearchInput) {
      adminSearchInput.addEventListener('input', (e) => {
        summarySearchQuery = e.target.value;
        render();
      });
    }

    // Export Master CSV button
    const exportMasterBtn = container.querySelector('#export-master-attendance-csv');
    if (exportMasterBtn) {
      exportMasterBtn.addEventListener('click', () => {
        exportMasterAttendanceCsv(store.data.students, store.data.labs, store.data.attendanceLogs);
        showToast('Exported Master Department Attendance Matrix CSV (195 Students x 11 Labs)!', 'success');
      });
    }

    const groupSelect = container.querySelector('#attendance-group-select');
    if (groupSelect) {
      groupSelect.addEventListener('change', (e) => {
        selectedGroup = e.target.value;
        store.activeLeaderGroup = selectedGroup;
        render();
      });
    }

    const labSelect = container.querySelector('#attendance-lab-select');
    if (labSelect) {
      labSelect.addEventListener('change', (e) => {
        selectedLabId = e.target.value;
        render();
      });
    }

    // Add Member Button
    const addMemberBtn = container.querySelector('#add-group-member-btn');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', () => {
        openAddStudentModal(selectedGroup);
      });
    }

    // Edit Member Buttons
    container.querySelectorAll('.edit-member-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const student = store.data.students.find(s => s.id === btn.dataset.id);
        if (student) openStudentModal(student, true);
      });
    });

    // Remove Member Buttons
    container.querySelectorAll('.remove-member-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const student = store.data.students.find(s => s.id === btn.dataset.id);
        if (student) openDeleteStudentConfirmModal(student);
      });
    });

    // Admin edit buttons
    const editGroupBtn = container.querySelector('#edit-current-group-btn');
    if (editGroupBtn) {
      editGroupBtn.addEventListener('click', () => {
        const grp = groups.find(g => g.id === selectedGroup);
        if (grp) openEditLabGroupModal(grp);
      });
    }

    const editLabBtn = container.querySelector('#edit-current-lab-btn');
    if (editLabBtn) {
      editLabBtn.addEventListener('click', () => {
        const lab = labs.find(l => l.id === selectedLabId);
        if (lab) openScheduleModal('Lab', lab);
      });
    }

    // Status toggles
    if (isLeaderAuthorized) {
      container.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const stId = e.target.dataset.id;
          const newStatus = e.target.dataset.status;

          if (!draftRecords[stId]) {
            draftRecords[stId] = { status: newStatus, notes: '' };
          } else {
            draftRecords[stId].status = newStatus;
          }

          const row = container.querySelector(`.student-row[data-id="${stId}"]`);
          if (row) {
            row.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
          }

          updateLiveSummary();
        });
      });

      // Note inputs
      container.querySelectorAll('.note-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const stId = e.target.dataset.id;
          if (!draftRecords[stId]) {
            draftRecords[stId] = { status: 'Unmarked', notes: e.target.value };
          } else {
            draftRecords[stId].notes = e.target.value;
          }
        });
      });

      // Mark all present
      const markAllBtn = container.querySelector('#mark-all-present-btn');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
          Object.keys(draftRecords).forEach(stId => {
            draftRecords[stId].status = 'Present';
          });
          render();
          showToast('Marked all students as Present!', 'info');
        });
      }

      // Save & Submit Register
      const saveBtn = container.querySelector('#save-attendance-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const currentGroupInfo = groups.find(g => g.id === selectedGroup);
          const selectedLab = labs.find(l => l.id === selectedLabId);
          const leaderName = currentGroupInfo ? currentGroupInfo.leaderName : 'Group Leader';

          const logEntry = {
            labId: selectedLabId,
            labName: selectedLab ? `${selectedLab.courseCode} ${selectedLab.labNumber || ''}: ${selectedLab.labTitle || selectedLab.labName}` : 'Lab Practical',
            group: selectedGroup,
            date: new Date().toISOString().slice(0, 10),
            updatedByLeader: `${leaderName} (Leader ${selectedGroup})`,
            records: draftRecords
          };

          store.saveLabAttendance(logEntry);
          showToast(`Saved attendance register for ${selectedLab ? (selectedLab.labTitle || selectedLab.labName) : 'Lab'} (${selectedGroup})!`, 'success');
        });
      }
    }

    // Export CSV
    const exportBtn = container.querySelector('#export-log-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const currentGroupInfo = groups.find(g => g.id === selectedGroup);
        const selectedLab = labs.find(l => l.id === selectedLabId);
        const leaderName = currentGroupInfo ? currentGroupInfo.leaderName : 'Group Leader';

        const mockLog = {
          labName: selectedLab ? `${selectedLab.courseCode} ${selectedLab.labNumber || ''}: ${selectedLab.labTitle || selectedLab.labName}` : 'Lab Practical',
          group: selectedGroup,
          updatedByLeader: `${leaderName} (Leader ${selectedGroup})`,
          totalPresent: presentCount,
          totalAbsent: absentCount,
          totalLate: lateCount,
          records: draftRecords
        };

        exportAttendanceLogCsv(mockLog, store.getStudentsByGroup(selectedGroup));
      });
    }
  }

  render();
}
