/**
 * ModalManager.js - Dialog & Overlay Portal Manager
 * Includes Schedule Modals, Lab Group Modals, Student Profiles, Delete Confirmations, and Role Password Verification
 */
import { store } from '../store.js';
import { DAYS_OF_WEEK, showToast, escapeHtml } from '../utils/helpers.js';

export function openPasswordModal(targetRole, targetGroup = 'CE01') {
  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const roleTitle = targetRole === 'admin' ? '👑 Admin / Faculty' : '⚡ Lab Group Leader';
  const isLeaderAuth = targetRole === 'leader';
  const hintText = targetRole === 'admin' ? 'admin123' : 'leader123';

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card modal-card-sm animate-scale-up">
        <div class="modal-header">
          <h3>🔒 Authenticate Role Access</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="password-auth-form" class="modal-body">
          <div class="auth-icon-box">
            <span class="auth-emoji">${targetRole === 'admin' ? '👑' : '⚡'}</span>
            <h4 class="auth-role-heading">${roleTitle} Mode</h4>
            <p class="sub-text">${isLeaderAuth ? 'Enter your Leader Student ID and Leader Passcode to access your assigned lab group.' : 'Enter admin passcode password to authenticate session.'}</p>
          </div>

          ${isLeaderAuth ? `
            <div class="form-group mt-3">
              <label class="form-label">Appointed Leader Student ID / Reg No.:</label>
              <input type="text" id="auth-st-id-input" class="form-input" required placeholder="Enter Registration No..." autofocus>
            </div>
          ` : ''}

          <div class="form-group mt-3">
            <label class="form-label">Enter Passcode:</label>
            <input type="password" id="auth-passcode-input" class="form-input" required placeholder="Enter password..." ${!isLeaderAuth ? 'autofocus' : ''}>
          </div>

          <div id="auth-error-msg" class="auth-error-text text-rose font-sm mt-2 hidden"></div>

          <div class="modal-footer mt-4">
            <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn ${targetRole === 'admin' ? 'btn-primary' : 'btn-emerald'}">
              🔓 Verify & Unlock Access
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const errorMsg = modalContainer.querySelector('#auth-error-msg');
  const passInput = modalContainer.querySelector('#auth-passcode-input');
  const stIdInput = modalContainer.querySelector('#auth-st-id-input');

  const closeModal = () => modalContainer.innerHTML = '';
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  const form = modalContainer.querySelector('#password-auth-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = passInput.value.trim();
    const studentId = stIdInput ? stIdInput.value.trim() : '';

    const res = store.loginRole(targetRole, pass, studentId, targetGroup);
    if (res.success) {
      showToast(res.message || `Authenticated as ${roleTitle}! Access granted.`, 'success');
      closeModal();
    } else {
      errorMsg.textContent = res.message || '❌ Incorrect passcode! Access denied.';
      errorMsg.classList.remove('hidden');
      passInput.value = '';
    }
  });
}

// Edit Lab Group Details Modal (Admin only)
export function openEditLabGroupModal(group) {
  if (store.currentRole !== 'admin') {
    showToast("🔒 Security Restriction: Only Department Admins can edit Lab Group Leaders!", "warning");
    return;
  }

  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const groupStudents = store.getStudentsByGroup(group.id);

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>✏️ Edit Lab Group Configuration (${escapeHtml(group.id)})</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="lab-group-form" class="modal-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Lab Group Name & Focus:</label>
              <input type="text" id="grp-name" class="form-input" required value="${escapeHtml(group.name)}">
            </div>

            <div class="form-group full-width">
              <label class="form-label">👑 Select Group Leader from ${escapeHtml(group.id)} Roster:</label>
              <select id="grp-leader-select" class="form-select">
                <option value="">-- Choose Student Leader --</option>
                ${groupStudents.map(s => {
                  const isSelected = (s.id === group.leaderId || s.name === group.leaderName);
                  return `
                    <option value="${s.id}" data-name="${escapeHtml(s.name)}" ${isSelected ? 'selected' : ''}>
                      ${s.id} - ${escapeHtml(s.name)} ${isSelected ? '⭐ (Current Leader)' : ''}
                    </option>
                  `;
                }).join('')}
              </select>
              <span class="sub-text text-muted mt-1">Selecting a student will set them as the official Group Leader.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Group Leader Name:</label>
              <input type="text" id="grp-leader-name" class="form-input" required value="${escapeHtml(group.leaderName)}">
            </div>

            <div class="form-group">
              <label class="form-label">Group Leader Student ID:</label>
              <input type="text" id="grp-leader-id" class="form-input" required value="${escapeHtml(group.leaderId)}">
            </div>

            <div class="form-group full-width">
              <label class="form-label">Assigned Laboratory Room:</label>
              <input type="text" id="grp-room" class="form-input" required value="${escapeHtml(group.labRoom)}">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">💾 Save Lab Group Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const closeModal = () => modalContainer.innerHTML = '';
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  const leaderSelect = modalContainer.querySelector('#grp-leader-select');
  const leaderNameInput = modalContainer.querySelector('#grp-leader-name');
  const leaderIdInput = modalContainer.querySelector('#grp-leader-id');

  if (leaderSelect) {
    leaderSelect.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      if (selectedId) {
        const selectedOpt = leaderSelect.options[leaderSelect.selectedIndex];
        const selectedName = selectedOpt.dataset.name;
        leaderIdInput.value = selectedId;
        leaderNameInput.value = selectedName;
      }
    });
  }

  const form = modalContainer.querySelector('#lab-group-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    group.name = document.getElementById('grp-name').value.trim();
    group.leaderName = document.getElementById('grp-leader-name').value.trim();
    group.leaderId = document.getElementById('grp-leader-id').value.trim();
    group.labRoom = document.getElementById('grp-room').value.trim();

    store.updateLabGroup(group);
    showToast(`Updated Lab Group leader for ${group.id} to ${group.leaderName}!`, 'success');
    closeModal();
  });
}

// Add or Edit Academic Course Module Modal (Admin only)
export function openCourseModal(existingCourse = null) {
  if (store.currentRole !== 'admin') {
    showToast("🔒 Security Restriction: Only Department Admins can manage Course Modules!", "warning");
    return;
  }

  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const isEdit = !!existingCourse;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>${isEdit ? '✏️ Edit' : '➕ Add New'} Academic Module</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="course-module-form" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Module / Course Code:</label>
              <input type="text" id="course-code" class="form-input" required 
                     value="${escapeHtml(existingCourse ? existingCourse.code : '')}"
                     placeholder="e.g. EC3301" ${isEdit ? 'readonly style="opacity:0.75;"' : 'autofocus'}>
            </div>

            <div class="form-group">
              <label class="form-label">Module Title / Course Name:</label>
              <input type="text" id="course-name" class="form-input" required 
                     value="${escapeHtml(existingCourse ? existingCourse.name : '')}"
                     placeholder="e.g. Analog Electronics">
            </div>

            <div class="form-group full-width">
              <label class="form-label">Module Coordinator / Lecturer / Venue:</label>
              <input type="text" id="course-prof" class="form-input" required 
                     value="${escapeHtml(existingCourse ? (existingCourse.professor || 'Communication Laboratory Staff') : 'Communication Laboratory Staff')}"
                     placeholder="e.g. Communication Laboratory Staff">
            </div>

            <div class="form-group">
              <label class="form-label">Enrolled Students Count:</label>
              <input type="number" id="course-enrolled" class="form-input" required 
                     value="${existingCourse ? (existingCourse.enrolledCount || 195) : 195}">
            </div>

            <div class="form-group">
              <label class="form-label">Credits:</label>
              <input type="number" id="course-credits" class="form-input" required 
                     value="${existingCourse ? (existingCourse.credits || 3) : 3}">
            </div>

            <div class="form-group">
              <label class="form-label">Academic Year:</label>
              <select id="course-year" class="form-select">
                <option value="1" ${existingCourse && existingCourse.year === 1 ? 'selected' : ''}>Year 1</option>
                <option value="2" ${!existingCourse || existingCourse.year === 2 ? 'selected' : ''}>Year 2</option>
                <option value="3" ${existingCourse && existingCourse.year === 3 ? 'selected' : ''}>Year 3</option>
                <option value="4" ${existingCourse && existingCourse.year === 4 ? 'selected' : ''}>Year 4</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Semester:</label>
              <select id="course-semester" class="form-select">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => `
                  <option value="${s}" ${(!existingCourse && s === 3) || (existingCourse && existingCourse.semester === s) ? 'selected' : ''}>Semester ${s}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">
              💾 ${isEdit ? 'Save Module Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const closeModal = () => modalContainer.innerHTML = '';
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  const form = modalContainer.querySelector('#course-module-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseObj = {
      code: document.getElementById('course-code').value.trim().toUpperCase(),
      name: document.getElementById('course-name').value.trim(),
      professor: document.getElementById('course-prof').value.trim(),
      enrolledCount: parseInt(document.getElementById('course-enrolled').value, 10) || 195,
      credits: parseInt(document.getElementById('course-credits').value, 10) || 3,
      year: parseInt(document.getElementById('course-year').value, 10) || 2,
      semester: parseInt(document.getElementById('course-semester').value, 10) || 3,
      labsCount: existingCourse ? existingCourse.labsCount : 0
    };

    if (isEdit) {
      const res = store.updateCourse(courseObj);
      if (res.success) {
        showToast(`Module "${courseObj.code}: ${courseObj.name}" updated!`, 'success');
        closeModal();
      } else {
        showToast(res.message || 'Failed to update module', 'error');
      }
    } else {
      const res = store.addCourse(courseObj);
      if (res.success) {
        showToast(`New Module "${courseObj.code}: ${courseObj.name}" created successfully!`, 'success');
        closeModal();
      } else {
        showToast(res.message || 'Failed to create module', 'error');
      }
    }
  });
}

export function openScheduleModal(itemType, existingItem = null, preselectedCourseCode = null) {
  const isEdit = !!existingItem;
  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const courses = store.data.courses;
  const groups = store.data.labGroups;

  // Determine initial selected course code
  const initialCourseCode = existingItem ? existingItem.courseCode : (preselectedCourseCode || '');
  const initialCourse = courses.find(c => c.code === initialCourseCode);

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>${isEdit ? '✏️ Edit' : '➕ Add New'} ${itemType === 'lecture' ? 'Lecture Schedule' : 'Lab Course Session'}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="schedule-form" class="modal-body">
          <div class="form-grid">
            
            <div class="form-group full-width" style="background: rgba(6, 182, 212, 0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(6, 182, 212, 0.2);">
              <label class="form-label text-cyan" style="font-weight: 700;">📚 Select Semester Module:</label>
              <select id="modal-course-select" class="form-select">
                <option value="">-- Choose from Department Managed Modules --</option>
                ${courses.map(c => {
                  const isSel = (c.code === initialCourseCode);
                  return `<option value="${c.code}" data-name="${escapeHtml(c.name)}" data-prof="${escapeHtml(c.professor || '')}" ${isSel ? 'selected' : ''}>
                    ${c.code} - ${escapeHtml(c.name)} (${c.professor || 'Comm Lab'})
                  </option>`;
                }).join('')}
                <option value="custom" ${existingItem && !courses.some(c => c.code === existingItem.courseCode) ? 'selected' : ''}>➕ Enter Custom / Manual Module Code</option>
              </select>
              <span class="sub-text text-muted mt-1 font-xs">Selecting a module from the list automatically populates the Course Code and Title below.</span>
            </div>

            <div class="form-group full-width">
              <label class="form-label">${itemType === 'lecture' ? 'Course Title' : 'Lab Session Title'}:</label>
              <input type="text" id="modal-title" class="form-input" required 
                     value="${escapeHtml(existingItem ? (itemType === 'lecture' ? existingItem.courseName : existingItem.labName) : (initialCourse ? initialCourse.name : ''))}"
                     placeholder="e.g. Analog Electronics / Semiconductor Diodes">
            </div>

            <div class="form-group">
              <label class="form-label">Course Code:</label>
              <input type="text" id="modal-code" class="form-input" required 
                     value="${escapeHtml(initialCourseCode)}"
                     placeholder="e.g. EC3301">
            </div>

            <div class="form-group">
              <label class="form-label">${itemType === 'lecture' ? 'Lecturer / Professor' : 'Lab Instructor / TA'}:</label>
              <input type="text" id="modal-instructor" class="form-input" required 
                     value="${escapeHtml(existingItem ? (itemType === 'lecture' ? existingItem.lecturer : existingItem.instructor) : '')}"
                     placeholder="e.g. Dr. Robert Vance">
            </div>

            <div class="form-group">
              <label class="form-label">Day of Week:</label>
              <select id="modal-day" class="form-select" required>
                ${DAYS_OF_WEEK.map(d => `
                  <option value="${d}" ${existingItem && existingItem.day === d ? 'selected' : ''}>${d}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Room / Laboratory Venue:</label>
              <input type="text" id="modal-room" class="form-input" required 
                     value="${escapeHtml(existingItem ? existingItem.room : '')}"
                     placeholder="e.g. Auditorium A1 or Lab 101">
            </div>

            <div class="form-group">
              <label class="form-label">Start Time:</label>
              <input type="time" id="modal-start-time" class="form-input" required 
                     value="${existingItem ? existingItem.startTime : '09:00'}">
            </div>

            <div class="form-group">
              <label class="form-label">End Time:</label>
              <input type="time" id="modal-end-time" class="form-input" required 
                     value="${existingItem ? existingItem.endTime : '10:30'}">
            </div>

            ${itemType === 'lecture' ? `
              <div class="form-group">
                <label class="form-label">Academic Year:</label>
                <select id="modal-year" class="form-select">
                  <option value="1" ${existingItem && existingItem.year === 1 ? 'selected' : ''}>Year 1</option>
                  <option value="2" ${existingItem && existingItem.year === 2 ? 'selected' : ''}>Year 2</option>
                  <option value="3" ${existingItem && existingItem.year === 3 ? 'selected' : ''}>Year 3</option>
                  <option value="4" ${existingItem && existingItem.year === 4 ? 'selected' : ''}>Year 4</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Semester:</label>
                <select id="modal-semester" class="form-select">
                  ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => `
                    <option value="${s}" ${existingItem && existingItem.semester === s ? 'selected' : ''}>Semester ${s}</option>
                  `).join('')}
                </select>
              </div>
            ` : `
              <div class="form-group">
                <label class="form-label">Lab Experiment Number:</label>
                <input type="text" id="modal-lab-num" class="form-input" 
                       value="${escapeHtml(existingItem ? (existingItem.labNumber || 'Lab 1') : 'Lab 1')}"
                       placeholder="e.g. Lab 1, Lab 2, Lab 3, Lab 4">
              </div>

              <div class="form-group">
                <label class="form-label">Coordinator / Venue:</label>
                <input type="text" id="modal-coordinator" class="form-input" 
                       value="${escapeHtml(existingItem ? (existingItem.coordinator || 'Communication Laboratory') : 'Communication Laboratory')}"
                       placeholder="e.g. Communication Laboratory">
              </div>

              <div class="form-group">
                <label class="form-label">Number of Enrolled Students:</label>
                <input type="number" id="modal-num-students" class="form-input" 
                       value="${existingItem ? (existingItem.noOfStudents || 195) : 195}">
              </div>

              <div class="form-group">
                <label class="form-label">Assigned Lab Group(s):</label>
                <input type="text" id="modal-assigned-grp" class="form-input" 
                       value="${escapeHtml(existingItem ? (existingItem.assignedGroup || 'CE01 - CE34') : 'CE01 - CE34')}"
                       placeholder="e.g. CE01 - CE34">
              </div>

              <div class="form-group full-width">
                <label class="form-label">Equipment & Hardware Notes:</label>
                <input type="text" id="modal-equipment" class="form-input" 
                       value="${escapeHtml(existingItem ? (existingItem.equipment || '') : '')}"
                       placeholder="e.g. Oscilloscopes, Diodes, MATLAB Workstations">
              </div>
            `}

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">
              💾 ${isEdit ? 'Save Session Changes' : 'Create Schedule Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const closeModal = () => modalContainer.innerHTML = '';
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  const courseSelect = modalContainer.querySelector('#modal-course-select');
  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      const selectedVal = e.target.value;
      if (selectedVal && selectedVal !== 'custom') {
        const matched = store.data.courses.find(c => c.code === selectedVal);
        if (matched) {
          const codeInput = modalContainer.querySelector('#modal-code');
          const titleInput = modalContainer.querySelector('#modal-title');
          const instructorInput = modalContainer.querySelector('#modal-instructor');
          
          if (codeInput) codeInput.value = matched.code;
          if (titleInput) {
            if (itemType === 'lecture') {
              titleInput.value = matched.name;
            } else {
              if (!titleInput.value || titleInput.value.startsWith('Lab') || store.data.courses.some(c => c.name === titleInput.value)) {
                titleInput.value = matched.name;
              }
            }
          }
          if (instructorInput && matched.professor && (!instructorInput.value || instructorInput.value === 'Communication Laboratory Staff')) {
            instructorInput.value = matched.professor;
          }
        }
      }
    });
  }

  const form = modalContainer.querySelector('#schedule-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (itemType === 'lecture') {
      const lectureObj = {
        id: existingItem ? existingItem.id : null,
        courseCode: document.getElementById('modal-code').value.trim(),
        courseName: document.getElementById('modal-title').value.trim(),
        lecturer: document.getElementById('modal-instructor').value.trim(),
        room: document.getElementById('modal-room').value.trim(),
        day: document.getElementById('modal-day').value,
        startTime: document.getElementById('modal-start-time').value,
        endTime: document.getElementById('modal-end-time').value,
        year: parseInt(document.getElementById('modal-year').value, 10),
        semester: parseInt(document.getElementById('modal-semester').value, 10),
        type: 'Lecture'
      };

      if (isEdit) {
        store.updateLecture(lectureObj);
        showToast(`Lecture "${lectureObj.courseName}" updated!`, 'success');
      } else {
        store.addLecture(lectureObj);
        showToast(`New Lecture "${lectureObj.courseName}" created!`, 'success');
      }
    } else {
      const labObj = {
        id: existingItem ? existingItem.id : null,
        courseCode: document.getElementById('modal-code').value.trim(),
        labName: document.getElementById('modal-title').value.trim(),
        labTitle: document.getElementById('modal-title').value.trim(),
        labNumber: document.getElementById('modal-lab-num') ? document.getElementById('modal-lab-num').value.trim() : 'Lab 1',
        coordinator: document.getElementById('modal-coordinator') ? document.getElementById('modal-coordinator').value.trim() : 'Communication Laboratory',
        venue: document.getElementById('modal-coordinator') ? document.getElementById('modal-coordinator').value.trim() : 'Communication Laboratory',
        room: document.getElementById('modal-room').value.trim(),
        noOfStudents: document.getElementById('modal-num-students') ? parseInt(document.getElementById('modal-num-students').value, 10) : 195,
        instructor: document.getElementById('modal-instructor').value.trim(),
        day: document.getElementById('modal-day').value,
        startTime: document.getElementById('modal-start-time').value,
        endTime: document.getElementById('modal-end-time').value,
        assignedGroup: document.getElementById('modal-assigned-grp') ? document.getElementById('modal-assigned-grp').value.trim() : 'CE01 - CE34',
        equipment: document.getElementById('modal-equipment').value.trim(),
        year: 2,
        type: 'Lab'
      };

      if (isEdit) {
        store.updateLab(labObj);
        showToast(`Lab session "${labObj.labName}" updated!`, 'success');
      } else {
        store.addLab(labObj);
        showToast(`New Lab session "${labObj.labName}" created!`, 'success');
      }
    }

    closeModal();
  });
}

export function openStudentModal(student, isEdit = false) {
  const role = store.currentRole;
  const isLeader = (role === 'leader');
  const isAdmin = (role === 'admin');

  // Security check for Group Leaders editing students
  if (isEdit && isLeader) {
    if (student.labGroup !== store.activeLeaderGroup) {
      showToast(`🔒 Access Restricted: As Group Leader of ${store.activeLeaderGroup}, you can only edit members of your own group!`, "warning");
      return;
    }
  }

  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const groups = store.data.labGroups;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>👤 ${isEdit ? 'Edit Student Details' : 'Student Academic Profile'}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="student-form" class="modal-body">
          <div class="profile-header-card">
            <div class="profile-avatar">${student.name.charAt(0)}</div>
            <div class="profile-title-box">
              <h4>${escapeHtml(student.name)}</h4>
              <span class="font-mono text-cyan">${student.id}</span>
              ${student.isLeader ? '<span class="badge badge-leader ml-2">Lab Group Leader</span>' : ''}
            </div>
          </div>

          <div class="form-grid mt-3">
            <div class="form-group">
              <label class="form-label">Full Name:</label>
              <input type="text" id="st-name" class="form-input" ${!isEdit ? 'disabled' : ''} value="${escapeHtml(student.name)}">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address:</label>
              <input type="email" id="st-email" class="form-input" ${!isEdit ? 'disabled' : ''} value="${escapeHtml(student.email)}">
            </div>

            <div class="form-group">
              <label class="form-label">Academic Year:</label>
              <select id="st-year" class="form-select" ${!isEdit ? 'disabled' : ''}>
                <option value="1" ${student.year === 1 ? 'selected' : ''}>Year 1</option>
                <option value="2" ${student.year === 2 ? 'selected' : ''}>Year 2</option>
                <option value="3" ${student.year === 3 ? 'selected' : ''}>Year 3</option>
                <option value="4" ${student.year === 4 ? 'selected' : ''}>Year 4</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Assigned Lab Group:</label>
              <select id="st-group" class="form-select" ${(!isEdit || isLeader) ? 'disabled' : ''}>
                ${groups.map(g => `
                  <option value="${g.id}" ${student.labGroup === g.id ? 'selected' : ''}>${g.name}</option>
                `).join('')}
              </select>
              ${isLeader ? `<span class="sub-text text-muted mt-1">🔒 Group Leaders cannot change student group assignments.</span>` : ''}
            </div>

            ${(isEdit && isAdmin) ? `
              <div class="form-group full-width">
                <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
                  <input type="checkbox" id="st-is-leader" ${student.isLeader ? 'checked' : ''}>
                  <span>👑 Appoint ${escapeHtml(student.name)} as Group Leader for ${student.labGroup}</span>
                </label>
              </div>
            ` : ''}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline modal-cancel-btn">Close</button>
            ${isEdit ? '<button type="submit" class="btn btn-primary">💾 Save Student Changes</button>' : ''}
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const closeModal = () => modalContainer.innerHTML = '';

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  if (isEdit) {
    const form = modalContainer.querySelector('#student-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      student.name = document.getElementById('st-name').value.trim();
      student.email = document.getElementById('st-email').value.trim();
      student.year = parseInt(document.getElementById('st-year').value, 10);
      if (isAdmin) {
        student.labGroup = document.getElementById('st-group').value;
      }

      const isLeaderCheck = document.getElementById('st-is-leader');
      if (isLeaderCheck && isLeaderCheck.checked && isAdmin) {
        const group = store.data.labGroups.find(g => g.id === student.labGroup);
        if (group) {
          group.leaderId = student.id;
          group.leaderName = student.name;
          store.updateLabGroup(group);
        }
      }

      store.updateStudent(student);
      showToast(`Updated student member details for ${student.name}!`, 'success');
      closeModal();
    });
  }
}

// Add New Student Member Modal (Group Leaders & Admins)
export function openAddStudentModal(defaultGroup = 'CE01') {
  const role = store.currentRole;
  const isLeader = (role === 'leader');
  const isAdmin = (role === 'admin');

  // If leader, force target group to activeLeaderGroup
  const targetGroup = isLeader ? (store.activeLeaderGroup || defaultGroup) : defaultGroup;

  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const groups = store.data.labGroups;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>➕ Add New Student Member to ${escapeHtml(targetGroup)}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="add-student-form" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Registration No. / Student ID:</label>
              <input type="text" id="add-st-id" class="form-input" required placeholder="e.g. EG/2024/6552">
            </div>

            <div class="form-group">
              <label class="form-label">Full Name:</label>
              <input type="text" id="add-st-name" class="form-input" required placeholder="e.g. PERERA A.B.C.">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address:</label>
              <input type="email" id="add-st-email" class="form-input" required placeholder="e.g. eg20246552@ce.dept.edu">
            </div>

            <div class="form-group">
              <label class="form-label">Academic Year:</label>
              <select id="add-st-year" class="form-select">
                <option value="1">Year 1</option>
                <option value="2" selected>Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Assigned Practical Lab Group:</label>
              <select id="add-st-group" class="form-select" ${isLeader ? 'disabled' : ''}>
                ${groups.map(g => `
                  <option value="${g.id}" ${g.id === targetGroup ? 'selected' : ''}>${g.id} - ${g.name}</option>
                `).join('')}
              </select>
              ${isLeader ? `<span class="sub-text text-amber mt-1">🔒 Locked: Group Leaders can only add members to their assigned group (${targetGroup}).</span>` : ''}
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-emerald">➕ Add Student Member</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const closeModal = () => modalContainer.innerHTML = '';

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  const form = modalContainer.querySelector('#add-student-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('add-st-id').value.trim();
    const name = document.getElementById('add-st-name').value.trim();
    const email = document.getElementById('add-st-email').value.trim();
    const year = parseInt(document.getElementById('add-st-year').value, 10);
    const labGroup = isLeader ? targetGroup : document.getElementById('add-st-group').value;

    const res = store.addStudent({
      id,
      name,
      email,
      year,
      semester: 3,
      labGroup,
      isLeader: false,
      labsCompleted: 0,
      totalLabs: 10
    });

    if (res.success) {
      showToast(`Added new member ${name} (${id}) to group ${labGroup}!`, 'success');
      closeModal();
    } else {
      showToast(res.message, 'error');
    }
  });
}

// Remove Student Member Confirmation Modal
export function openDeleteStudentConfirmModal(student) {
  const role = store.currentRole;
  const isLeader = (role === 'leader');

  if (isLeader && student.labGroup !== store.activeLeaderGroup) {
    showToast(`🔒 Access Restricted: As Group Leader of ${store.activeLeaderGroup}, you can only remove members from your own group!`, "warning");
    return;
  }

  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card modal-card-sm animate-scale-up">
        <div class="modal-header">
          <h3>🗑️ Confirm Student Member Removal</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body text-center pad-md">
          <p class="font-md">Are you sure you want to remove <strong>${escapeHtml(student.name)}</strong> (<code>${escapeHtml(student.id)}</code>) from <strong>${escapeHtml(student.labGroup)}</strong>?</p>
          <p class="font-xs text-muted mt-2">This student will be removed from the practical group roster.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
          <button type="button" id="confirm-remove-st-btn" class="btn btn-rose">🗑️ Yes, Remove Member</button>
        </div>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const confirmBtn = modalContainer.querySelector('#confirm-remove-st-btn');
  const closeModal = () => modalContainer.innerHTML = '';

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      store.deleteStudent(student.id);
      showToast(`Removed ${student.name} (${student.id}) from ${student.labGroup}!`, 'success');
      closeModal();
    });
  }
}

export function openDeleteConfirmModal(message, onConfirm) {
  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card modal-card-sm animate-scale-up">
        <div class="modal-header">
          <h3>⚠️ Confirm Action</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body text-center pad-md">
          <p class="font-lg">${escapeHtml(message)}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline modal-cancel-btn">Cancel</button>
          <button type="button" id="modal-confirm-btn" class="btn btn-danger">🗑️ Yes, Delete</button>
        </div>
      </div>
    </div>
  `;

  const closeBtn = modalContainer.querySelector('.modal-close-btn');
  const cancelBtn = modalContainer.querySelector('.modal-cancel-btn');
  const confirmBtn = modalContainer.querySelector('#modal-confirm-btn');
  const closeModal = () => modalContainer.innerHTML = '';

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  confirmBtn.addEventListener('click', () => {
    onConfirm();
    closeModal();
  });
}
