/**
 * AttendanceView.js - Lab Attendance Tracker for Lab Group Leaders
 * Access Control Rule: ONLY Lab Group Leaders are authorized to mark attendance.
 * Leader Capability: Group Leaders can edit and add members to their assigned group.
 * Admin Capability: Admins can edit Lab Group configurations and Lab Course Sessions.
 */
import { store } from '../store.js';
import { showToast } from '../utils/helpers.js';
import { exportAttendanceLogCsv } from '../utils/exportImport.js';
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
          status: 'Present',
          notes: ''
        };
      }
    });
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

    Object.values(draftRecords).forEach(rec => {
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-left">
          <h2>🧪 Lab Attendance Tracker</h2>
          <p class="view-description">
            ${isLeaderAuthorized 
              ? '<span class="highlight-text">⚡ Group Leader Authorized: You can record attendance and add/edit members in your group.</span>' 
              : '<span class="text-rose font-bold">🔒 Restricted View: Only Lab Group Leaders are authorized to mark attendance.</span>'}
          </p>
        </div>

        <div class="view-header-right">
          ${isLeaderAuthorized ? `
            <button id="save-attendance-btn" class="btn btn-emerald btn-lg animate-pulse">
              💾 Save & Submit Register
            </button>
          ` : `
            <button class="btn btn-secondary" onclick="window.setLeaderRoleQuick()">
              ⚡ Switch to Group Leader Mode to Take Attendance
            </button>
          `}
          <button id="export-log-csv" class="btn btn-outline">
            📥 Download Log CSV
          </button>
        </div>
      </div>

      <!-- Access Control Warning Banner if not Leader -->
      ${!isLeaderAuthorized ? `
        <div class="card warning-alert-box mb-4 animate-fade-in">
          <div class="alert-header">
            <span>🔒 Permission Lock: Lab Group Leaders Only</span>
          </div>
          <p class="alert-desc">
            Attendance entry is restricted to <strong>Lab Group Leaders</strong>. Admin mode is for schedule & group leader entry. 
            To record student attendance or add members to your group, please select <strong>⚡ Group Leader Mode</strong> in the header bar.
          </p>
        </div>
      ` : ''}

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
              const rec = draftRecords[st.id] || { status: 'Present', notes: '' };
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

    Object.values(draftRecords).forEach(rec => {
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
    });

    const pEl = container.querySelector('#stat-present-count');
    const lEl = container.querySelector('#stat-late-count');
    const aEl = container.querySelector('#stat-absent-count');

    if (pEl) pEl.textContent = presentCount;
    if (lEl) lEl.textContent = lateCount;
    if (aEl) aEl.textContent = absentCount;
  }

  function attachEvents() {
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

    const dateInput = container.querySelector('#attendance-date-input');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        initDraftRecords();
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
            draftRecords[stId] = { status: 'Present', notes: e.target.value };
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
