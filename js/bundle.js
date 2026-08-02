/** Standalone Production Bundle for Computer Engineering Academic Hub */
(function() {
'use strict';

// --- File: js/utils/helpers.js ---
/**
 * Helpers.js - Utility Functions & Toast Notification Manager
 */

// Toast Notifications
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in`;

  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// XSS protection
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render Star Rating
function renderStars(rating = 0, interactive = false, onSelect = null) {
  let html = '<div class="star-rating">';
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= Math.round(rating);
    const starClass = isFilled ? 'star filled' : 'star';
    if (interactive) {
      html += `<span class="${starClass} star-clickable" data-value="${i}" title="${i} Stars">★</span>`;
    } else {
      html += `<span class="${starClass}">★</span>`;
    }
  }
  html += '</div>';
  return html;
}

// Attendance Badge Color Helper
function getAttendanceBadgeClass(percentage) {
  if (percentage >= 85) return 'badge-success';
  if (percentage >= 75) return 'badge-warning';
  return 'badge-danger';
}

// Format Time display (e.g. 09:00 -> 9:00 AM)
function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Days of week
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// --- File: js/utils/exportImport.js ---
/**
 * Export & Import Utilities for Academic & Lab Records
 */

// Download CSV file helper
function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export 200 Student Roster to CSV
function exportStudentsCsv(students) {
  let csv = 'Student ID,Full Name,Email,Year,Semester,Lab Group,Labs Completed\n';
  students.forEach(s => {
    csv += `"${s.id}","${s.name}","${s.email}",${s.year},${s.semester},"${s.labGroup}",${s.labsCompleted || 0}\n`;
  });
  downloadCsv(`CompEng_Student_Roster_${new Date().toISOString().slice(0,10)}.csv`, csv);
}

// Export Schedule to CSV
function exportScheduleCsv(lectures, labs) {
  let csv = 'Type,ID,Code,Title/Name,Lecturer/Instructor,Room/Venue,Day,Start Time,End Time,Assigned Group/Target,Notes/Equipment\n';
  
  lectures.forEach(l => {
    csv += `"Lecture","${l.id}","${l.courseCode}","${l.courseName}","${l.lecturer}","${l.room}","${l.day}","${l.startTime}","${l.endTime}","Year ${l.year} Sem ${l.semester}","Lecture"\n`;
  });

  labs.forEach(b => {
    csv += `"Lab","${b.id}","${b.courseCode}","${b.labName}","${b.instructor}","${b.room}","${b.day}","${b.startTime}","${b.endTime}","${b.assignedGroup}","${b.equipment || ''}"\n`;
  });

  downloadCsv(`CompEng_Schedule_${new Date().toISOString().slice(0,10)}.csv`, csv);
}

// Export Lab Attendance Log to CSV
function exportAttendanceLogCsv(logEntry, students) {
  const studentMap = {};
  students.forEach(s => studentMap[s.id] = s.name);

  let csv = `Lab Attendance Register - ${logEntry.labName}\n`;
  csv += `Group: ${logEntry.group}, Recorded By: ${logEntry.updatedByLeader}\n`;
  csv += `Present: ${logEntry.totalPresent}, Absent: ${logEntry.totalAbsent}, Late: ${logEntry.totalLate}\n\n`;
  csv += 'Student ID,Student Name,Status,Task Notes\n';

  if (logEntry.records) {
    Object.keys(logEntry.records).forEach(stId => {
      const rec = logEntry.records[stId];
      const stName = studentMap[stId] || 'Unknown';
      csv += `"${stId}","${stName}","${rec.status}","${(rec.notes || '').replace(/"/g, '""')}"\n`;
    });
  }

  downloadCsv(`Lab_Attendance_${logEntry.group}_${(logEntry.labName || 'Lab').replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`, csv);
}

// Export Full Master Attendance Matrix (All Students x All Labs) to CSV
function exportMasterAttendanceCsv(students, labs, attendanceLogs) {
  // Map attendance by labId and studentId
  const logMatrix = {};
  attendanceLogs.forEach(log => {
    if (log.records && log.labId) {
      Object.keys(log.records).forEach(stId => {
        if (!logMatrix[stId]) logMatrix[stId] = {};
        logMatrix[stId][log.labId] = log.records[stId].status;
      });
    }
  });

  let csv = 'Student ID,Full Name,Lab Group,Year,Semester';
  labs.forEach(l => {
    csv += `,"${l.courseCode} ${l.labNumber || 'Lab'}"`;
  });
  csv += ',Labs Completed,Total Labs,Attendance Rate %\n';

  students.forEach(s => {
    let completedCount = 0;
    csv += `"${s.id}","${s.name}","${s.labGroup}",${s.year},${s.semester}`;
    
    labs.forEach(l => {
      const status = (logMatrix[s.id] && logMatrix[s.id][l.id]) ? logMatrix[s.id][l.id] : 'Unmarked';
      if (status === 'Present' || status === 'Late') completedCount++;
      csv += `,"${status}"`;
    });

    const rate = labs.length > 0 ? ((completedCount / labs.length) * 100).toFixed(1) : 0;
    csv += `,${completedCount},${labs.length},"${rate}%"\n`;
  });

  downloadCsv(`CompEng_Master_Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`, csv);
}

// Backup full store to JSON
function exportFullBackupJson(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `CompEng_Academic_Records_Backup_${new Date().toISOString().slice(0,10)}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// --- File: js/mockData.js ---
/**
 * Real Student & Group Roster Data for 26th Batch - Semester 3 - Computer Engineering
 * Academic Year 2026/2027
 */

const INITIAL_MOCK_DATA = {
  department: {
    name: "26th Batch - Computer Engineering Department",
    code: "CE-DEPT",
    academicYear: "2026/2027",
    semester: "Semester 3",
    totalStudents: 195,
    labGroupsCount: 34,
    activeCoursesCount: 6
  },

  // 34 Practical Groups (CE01 to CE34)
  labGroups: [
    { id: "CE01", name: "Practical Group CE01", leaderId: "EG/2023/5999", leaderName: "AHAMADH A.M", studentCount: 6, labRoom: "Lab 101 - Hardware & Logic Lab" },
    { id: "CE02", name: "Practical Group CE02", leaderId: "EG/2024/6016", leaderName: "AFSAL AHAMED A.", studentCount: 6, labRoom: "Lab 102 - Software Systems Lab" },
    { id: "CE03", name: "Practical Group CE03", leaderId: "EG/2024/6026", leaderName: "AHMETH M.N.", studentCount: 6, labRoom: "Lab 201 - Algorithms & Data Lab" },
    { id: "CE04", name: "Practical Group CE04", leaderId: "EG/2024/6040", leaderName: "ANDADOLA A.M.N.M.", studentCount: 7, labRoom: "Lab 202 - Embedded Architecture Lab" },
    { id: "CE05", name: "Practical Group CE05", leaderId: "EG/2024/6059", leaderName: "ATHTHANAYAKE A.M.Y.S.", studentCount: 5, labRoom: "Lab 301 - Systems & OS Kernel Lab" },
    { id: "CE06", name: "Practical Group CE06", leaderId: "EG/2024/6082", leaderName: "CHATHURANGA A.A.D.", studentCount: 6, labRoom: "Lab 302 - Cisco Networking & Security Lab" },
    { id: "CE07", name: "Practical Group CE07", leaderId: "EG/2024/6094", leaderName: "DASANAYAKA W.M.V.P.", studentCount: 6, labRoom: "Lab 401 - Artificial Intelligence Lab" },
    { id: "CE08", name: "Practical Group CE08", leaderId: "EG/2024/6106", leaderName: "DHANUSH G.", studentCount: 6, labRoom: "Lab 402 - VLSI & Microcontrollers Lab" },
    { id: "CE09", name: "Practical Group CE09", leaderId: "EG/2024/6124", leaderName: "DISSANAYAKA S.K.S.", studentCount: 6, labRoom: "Lab 101 - Hardware & Logic Lab" },
    { id: "CE10", name: "Practical Group CE10", leaderId: "EG/2024/6133", leaderName: "DISSANAYAKE T.G.S.N.G.", studentCount: 6, labRoom: "Lab 102 - Software Systems Lab" },
    { id: "CE11", name: "Practical Group CE11", leaderId: "EG/2024/6163", leaderName: "GUNARATHNA E.G.A.D.", studentCount: 6, labRoom: "Lab 201 - Algorithms & Data Lab" },
    { id: "CE12", name: "Practical Group CE12", leaderId: "EG/2024/6179", leaderName: "HANSIKA G.K.H.", studentCount: 6, labRoom: "Lab 202 - Embedded Architecture Lab" },
    { id: "CE13", name: "Practical Group CE13", leaderId: "EG/2024/6192", leaderName: "HETTIARACHCHI H.K.U.A.", studentCount: 6, labRoom: "Lab 301 - Systems & OS Kernel Lab" },
    { id: "CE14", name: "Practical Group CE14", leaderId: "EG/2024/6209", leaderName: "JAYAMINI K.L.P.", studentCount: 6, labRoom: "Lab 302 - Cisco Networking Lab" },
    { id: "CE15", name: "Practical Group CE15", leaderId: "EG/2024/6228", leaderName: "JAYATHISSA G.R.C.H.", studentCount: 6, labRoom: "Lab 401 - Artificial Intelligence Lab" },
    { id: "CE16", name: "Practical Group CE16", leaderId: "EG/2024/6247", leaderName: "KARUNATHILAKA A.B.P.", studentCount: 4, labRoom: "Lab 402 - VLSI Lab" },
    { id: "CE17", name: "Practical Group CE17", leaderId: "EG/2024/6266", leaderName: "KUMARA B.L.D.", studentCount: 8, labRoom: "Lab 101 - Hardware Lab" },
    { id: "CE18", name: "Practical Group CE18", leaderId: "EG/2024/6288", leaderName: "LIYANAGE N.L.P.C.", studentCount: 6, labRoom: "Lab 102 - Software Lab" },
    { id: "CE19", name: "Practical Group CE19", leaderId: "EG/2024/6308", leaderName: "MANAMPERI Y.B.", studentCount: 6, labRoom: "Lab 201 - Data Lab" },
    { id: "CE20", name: "Practical Group CE20", leaderId: "EG/2024/6318", leaderName: "MITHUSHAN T.", studentCount: 6, labRoom: "Lab 202 - Embedded Lab" },
    { id: "CE21", name: "Practical Group CE21", leaderId: "EG/2024/6343", leaderName: "NIMSARA K.H.I.", studentCount: 8, labRoom: "Lab 301 - Systems Lab" },
    { id: "CE22", name: "Practical Group CE22", leaderId: "EG/2024/6366", leaderName: "PERERA G.H.S.T.", studentCount: 4, labRoom: "Lab 302 - Networking Lab" },
    { id: "CE23", name: "Practical Group CE23", leaderId: "EG/2024/6374", leaderName: "PINTO M.K.H.P.", studentCount: 6, labRoom: "Lab 401 - AI Lab" },
    { id: "CE24", name: "Practical Group CE24", leaderId: "EG/2024/6393", leaderName: "RAHMAN M.F.A.", studentCount: 6, labRoom: "Lab 402 - VLSI Lab" },
    { id: "CE25", name: "Practical Group CE25", leaderId: "EG/2024/6414", leaderName: "RANDUNI W.D.N.", studentCount: 6, labRoom: "Lab 101 - Hardware Lab" },
    { id: "CE26", name: "Practical Group CE26", leaderId: "EG/2024/6431", leaderName: "RATHNAYAKA R.M.W.G.L.W.", studentCount: 4, labRoom: "Lab 102 - Software Lab" },
    { id: "CE27", name: "Practical Group CE27", leaderId: "EG/2024/6450", leaderName: "SAMARAWIKRAMA P.G.K.H.", studentCount: 5, labRoom: "Lab 201 - Data Lab" },
    { id: "CE28", name: "Practical Group CE28", leaderId: "EG/2024/6467", leaderName: "SATHUVAASAHAN T.", studentCount: 3, labRoom: "Lab 202 - Embedded Lab" },
    { id: "CE29", name: "Practical Group CE29", leaderId: "EG/2024/6478", leaderName: "SEWMINI W.A.C.", studentCount: 7, labRoom: "Lab 301 - Systems & OS Kernel Lab" },
    { id: "CE30", name: "Practical Group CE30", leaderId: "EG/2024/6493", leaderName: "SUBHASHANA P.H.", studentCount: 5, labRoom: "Lab 302 - Cisco Networking Lab" },
    { id: "CE31", name: "Practical Group CE31", leaderId: "EG/2024/6507", leaderName: "THENNAKOON T.M.L.M.", studentCount: 5, labRoom: "Lab 401 - Artificial Intelligence Lab" },
    { id: "CE32", name: "Practical Group CE32", leaderId: "EG/2024/6522", leaderName: "WAHARAKA K.P.N.S.N.", studentCount: 6, labRoom: "Lab 402 - VLSI & Microcontrollers Lab" },
    { id: "CE33", name: "Practical Group CE33", leaderId: "EG/2024/6531", leaderName: "WICKRAMAARACHCHI W.A.B.J.", studentCount: 4, labRoom: "Lab 101 - Hardware & Logic Lab" },
    { id: "CE34", name: "Practical Group CE34", leaderId: "EG/2024/6539", leaderName: "WIJEKOON A.W.W.M.G.B.", studentCount: 6, labRoom: "Lab 102 - Software Systems Lab" }
  ],

  // Semester 3 Computer Engineering Specialization Courses
  courses: [
    { code: "EC3301", name: "Analog Electronics", year: 2, semester: 3, credits: 3, professor: "Communication Laboratory Staff", labsCount: 4 },
    { code: "EC3203", name: "Electrical and Electronic Measurements", year: 2, semester: 3, credits: 3, professor: "Communication Laboratory Staff", labsCount: 3 },
    { code: "EC3305", name: "Signals and Systems", year: 2, semester: 3, credits: 3, professor: "Communication Laboratory Staff", labsCount: 4 }
  ],

  // Lecture Schedules
  lectures: [
    { id: "LEC-3301", courseCode: "EC3301", courseName: "Analog Electronics", lecturer: "Communication Laboratory Staff", room: "LT-01 Auditorium", day: "Monday", startTime: "08:00", endTime: "10:00", year: 2, semester: 3, type: "Lecture" },
    { id: "LEC-3203", courseCode: "EC3203", courseName: "Electrical and Electronic Measurements", lecturer: "Communication Laboratory Staff", room: "LT-02 Lecture Hall", day: "Wednesday", startTime: "08:00", endTime: "10:00", year: 2, semester: 3, type: "Lecture" },
    { id: "LEC-3305", courseCode: "EC3305", courseName: "Signals and Systems", lecturer: "Communication Laboratory Staff", room: "LT-01 Auditorium", day: "Thursday", startTime: "08:00", endTime: "10:00", year: 2, semester: 3, type: "Lecture" }
  ],

  // Official Practical Lab Sessions (Specialization: Computer Engineering)
  labs: [
    // --- EC3301 Analog Electronics ---
    { 
      id: "LAB-EC3301-1", 
      courseCode: "EC3301", 
      courseName: "Analog Electronics", 
      labNumber: "Lab 1", 
      labName: "Lab 1: The Operation of Semiconductor Diodes and their Practical Applications", 
      labTitle: "The Operation of Semiconductor Diodes and their Practical Applications",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Monday", 
      startTime: "08:30", 
      endTime: "11:30", 
      year: 2, 
      equipment: "Diodes, Oscilloscopes, Function Generators",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3301-2", 
      courseCode: "EC3301", 
      courseName: "Analog Electronics", 
      labNumber: "Lab 2", 
      labName: "Lab 2: Basic Amplifiers and Biasing", 
      labTitle: "Basic Amplifiers and Biasing",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Monday", 
      startTime: "13:30", 
      endTime: "16:30", 
      year: 2, 
      equipment: "BJT/FET Transistors, DC Power Supplies",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3301-3", 
      courseCode: "EC3301", 
      courseName: "Analog Electronics", 
      labNumber: "Lab 3", 
      labName: "Lab 3: Operational Amplifiers and Applications", 
      labTitle: "Operational Amplifiers and Applications",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Tuesday", 
      startTime: "08:30", 
      endTime: "11:30", 
      year: 2, 
      equipment: "741 Op-Amps, Breadboards, Multimeters",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3301-4", 
      courseCode: "EC3301", 
      courseName: "Analog Electronics", 
      labNumber: "Lab 4", 
      labName: "Lab 4: Oscillators and Analog Filters", 
      labTitle: "Oscillators and Analog Filters",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Tuesday", 
      startTime: "13:30", 
      endTime: "16:30", 
      year: 2, 
      equipment: "Filter Component Kits, Spectrum Analyzer",
      type: "Lab" 
    },

    // --- EC3203 Electrical and Electronic Measurements ---
    { 
      id: "LAB-EC3203-1", 
      courseCode: "EC3203", 
      courseName: "Electrical and Electronic Measurements", 
      labNumber: "Lab 1", 
      labName: "Lab 1: Measurements using DC and AC Bridges", 
      labTitle: "Measurements using DC and AC Bridges",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Wednesday", 
      startTime: "08:30", 
      endTime: "11:30", 
      year: 2, 
      equipment: "Wheatstone & Maxwell Bridges, Galvanometer",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3203-2", 
      courseCode: "EC3203", 
      courseName: "Electrical and Electronic Measurements", 
      labNumber: "Lab 2", 
      labName: "Lab 2: Oscilloscope Probe Testing", 
      labTitle: "Oscilloscope Probe Testing",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Wednesday", 
      startTime: "13:30", 
      endTime: "16:30", 
      year: 2, 
      equipment: "10x Passive Probes, Digital Oscilloscopes",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3203-3", 
      courseCode: "EC3203", 
      courseName: "Electrical and Electronic Measurements", 
      labNumber: "Lab 3", 
      labName: "Lab 3: Measurement using spectrum analyzer", 
      labTitle: "Measurement using spectrum analyzer",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Thursday", 
      startTime: "08:30", 
      endTime: "11:30", 
      year: 2, 
      equipment: "RF Spectrum Analyzer, Signal Generators",
      type: "Lab" 
    },

    // --- EC3305 Signals and Systems ---
    { 
      id: "LAB-EC3305-1", 
      courseCode: "EC3305", 
      courseName: "Signals and Systems", 
      labNumber: "Lab 1", 
      labName: "Lab 1: Continuous- Time Signal Analysis", 
      labTitle: "Continuous- Time Signal Analysis",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Thursday", 
      startTime: "13:30", 
      endTime: "16:30", 
      year: 2, 
      equipment: "Signal Processing Trainer Kits",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3305-2", 
      courseCode: "EC3305", 
      courseName: "Signals and Systems", 
      labNumber: "Lab 2", 
      labName: "Lab 2: MATLAB for continuous time signals", 
      labTitle: "MATLAB for continuous time signals",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Friday", 
      startTime: "08:30", 
      endTime: "11:30", 
      year: 2, 
      equipment: "MATLAB Workstations & Signal Processing Toolbox",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3305-3", 
      courseCode: "EC3305", 
      courseName: "Signals and Systems", 
      labNumber: "Lab 3", 
      labName: "Lab 3: Analog/Digital conversion", 
      labTitle: "Analog/Digital conversion",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Friday", 
      startTime: "13:30", 
      endTime: "15:30", 
      year: 2, 
      equipment: "ADC/DAC Modules, Microcontroller Boards",
      type: "Lab" 
    },
    { 
      id: "LAB-EC3305-4", 
      courseCode: "EC3305", 
      courseName: "Signals and Systems", 
      labNumber: "Lab 4", 
      labName: "Lab 4: MATLAB for discrete time signals", 
      labTitle: "MATLAB for discrete time signals",
      coordinator: "Communication Laboratory", 
      venue: "Communication Laboratory", 
      room: "Communication Laboratory", 
      noOfStudents: 195, 
      assignedGroup: "CE01 - CE34", 
      instructor: "Communication Laboratory Staff", 
      day: "Friday", 
      startTime: "15:30", 
      endTime: "17:30", 
      year: 2, 
      equipment: "MATLAB Workstations & DSP System Toolbox",
      type: "Lab" 
    }
  ],

  // 195 Transcribed Department Students
  students: [
    // CE01
    { id: "EG/2023/5999", name: "AHAMADH A.M", email: "eg20235999@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6005", name: "AAROOSH G.", email: "eg20246005@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6006", name: "AASHIK M.S.M.", email: "eg20246006@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6007", name: "ABAYARATHNA B.L.T.T.", email: "eg20246007@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6010", name: "ABHISHEK B.", email: "eg20246010@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6014", name: "ADITHYA M.A.C.J.", email: "eg20246014@ce.dept.edu", year: 2, semester: 3, labGroup: "CE01", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE02
    { id: "EG/2024/6016", name: "AFSAL AHAMED A.", email: "eg20246016@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6017", name: "AHAMED A.J.A.", email: "eg20246017@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6018", name: "AHAMED A.S.A.", email: "eg20246018@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6019", name: "AHAMED F.A.", email: "eg20246019@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6022", name: "AHAMED M.N.A.", email: "eg20246022@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6024", name: "AHAMED Y.S.", email: "eg20246024@ce.dept.edu", year: 2, semester: 3, labGroup: "CE02", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE03
    { id: "EG/2024/6026", name: "AHMETH M.N.", email: "eg20246026@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6030", name: "ALWIS L.L.M.I.", email: "eg20246030@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6031", name: "AMALRAJ A.V.E.", email: "eg20246031@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6032", name: "AMARASINGHE A.A.I.D.", email: "eg20246032@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6034", name: "AMARASOORIYA D.M.K.", email: "eg20246034@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6038", name: "AMMAR M.R.", email: "eg20246038@ce.dept.edu", year: 2, semester: 3, labGroup: "CE03", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE04
    { id: "EG/2024/6040", name: "ANDADOLA A.M.N.M.", email: "eg20246040@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6041", name: "ANGEL Y.S.", email: "eg20246041@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6044", name: "ANUHAS S.M.", email: "eg20246044@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6047", name: "APISAANTH S.", email: "eg20246047@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6048", name: "AQEEL M.M.", email: "eg20246048@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6054", name: "ARIYAPALA D.B.B.M.", email: "eg20246054@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6055", name: "AROORAN S.", email: "eg20246055@ce.dept.edu", year: 2, semester: 3, labGroup: "CE04", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE05
    { id: "EG/2024/6059", name: "ATHTHANAYAKE A.M.Y.S.", email: "eg20246059@ce.dept.edu", year: 2, semester: 3, labGroup: "CE05", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6061", name: "ATHUKORALA W.A.A.P.L.", email: "eg20246061@ce.dept.edu", year: 2, semester: 3, labGroup: "CE05", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6062", name: "ATTANAYAKA A.M.C.D.", email: "eg20246062@ce.dept.edu", year: 2, semester: 3, labGroup: "CE05", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6073", name: "BANDARANAYAKE G.B.W.M.R.M.", email: "eg20246073@ce.dept.edu", year: 2, semester: 3, labGroup: "CE05", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6077", name: "BOPAGE B.T.S.", email: "eg20246077@ce.dept.edu", year: 2, semester: 3, labGroup: "CE05", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE06
    { id: "EG/2024/6082", name: "CHATHURANGA A.A.D.", email: "eg20246082@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6086", name: "CHETHANA W.M.P.", email: "eg20246086@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6087", name: "CHINTHAKA A.W.A.U.", email: "eg20246087@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6088", name: "CHIRATH L.Y.", email: "eg20246088@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6089", name: "CROOS A.A.B.", email: "eg20246089@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6090", name: "CROOSVOAN M.M.A.", email: "eg20246090@ce.dept.edu", year: 2, semester: 3, labGroup: "CE06", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE07
    { id: "EG/2024/6094", name: "DASANAYAKA W.M.V.P.", email: "eg20246094@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6095", name: "DASUN H.A.K.", email: "eg20246095@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6099", name: "DE SILVA I.G.U.S.J.", email: "eg20246099@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6100", name: "DE SILVA M.P.C.", email: "eg20246100@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6101", name: "DEEGODAGE K.L.", email: "eg20246101@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6104", name: "DEWAPRIYA K.G.D.T.", email: "eg20246104@ce.dept.edu", year: 2, semester: 3, labGroup: "CE07", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE08
    { id: "EG/2024/6106", name: "DHANUSH G.", email: "eg20246106@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6111", name: "DILOMITHAN V.", email: "eg20246111@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6113", name: "DILSHAN K.B.R.", email: "eg20246113@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6115", name: "DINOSH R.", email: "eg20246115@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6119", name: "DISANAYAKA W.G.S.G.", email: "eg20246119@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6120", name: "DISSANAYAKA D.M.A.M.", email: "eg20246120@ce.dept.edu", year: 2, semester: 3, labGroup: "CE08", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE09
    { id: "EG/2024/6124", name: "DISSANAYAKA S.K.S.", email: "eg20246124@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6125", name: "DISSANAYAKE D.D.M.R.G.K.", email: "eg20246125@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6126", name: "DISSANAYAKE D.M.B.S.", email: "eg20246126@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6129", name: "DISSANAYAKE D.M.S.D.", email: "eg20246129@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6131", name: "DISSANAYAKE D.M.S.S.V.", email: "eg20246131@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6132", name: "DISSANAYAKE P.A.K.M.", email: "eg20246132@ce.dept.edu", year: 2, semester: 3, labGroup: "CE09", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE10
    { id: "EG/2024/6133", name: "DISSANAYAKE T.G.S.N.G.", email: "eg20246133@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6142", name: "EKANAYAKA E.M.D.S.", email: "eg20246142@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6151", name: "FERNANDO W.W.M.R.", email: "eg20246151@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6153", name: "GAJASINGHE G.M.D.S.", email: "eg20246153@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6155", name: "GAMAGE H.D.T.", email: "eg20246155@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6157", name: "GAMAGE I.D.", email: "eg20246157@ce.dept.edu", year: 2, semester: 3, labGroup: "CE10", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE11
    { id: "EG/2024/6163", name: "GUNARATHNA E.G.A.D.", email: "eg20246163@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6165", name: "GUNASEKARA W.A.K.M.", email: "eg20246165@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6167", name: "GUNATHILAKA D.M.N.M.", email: "eg20246167@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6170", name: "GUNATHILAKE K.M.M.M.", email: "eg20246170@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6173", name: "GUNAWARDHANA P.A.H.N.", email: "eg20246173@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6177", name: "HAKMANA H.A.R.P.", email: "eg20246177@ce.dept.edu", year: 2, semester: 3, labGroup: "CE11", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE12
    { id: "EG/2024/6179", name: "HANSIKA G.K.H.", email: "eg20246179@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6183", name: "HEMACHANDRA A.D.S.I.", email: "eg20246183@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6185", name: "HERATH G.M.M.S.", email: "eg20246185@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6186", name: "HERATH H.M.D.N.", email: "eg20246186@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6187", name: "HERATH H.M.M.E.G.J.L.", email: "eg20246187@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6191", name: "HESHAN W.P.", email: "eg20246191@ce.dept.edu", year: 2, semester: 3, labGroup: "CE12", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE13
    { id: "EG/2024/6192", name: "HETTIARACHCHI H.K.U.A.", email: "eg20246192@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6193", name: "HEWADEWA H.D.", email: "eg20246193@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6194", name: "HEWADIKARAM E.D.I.M.", email: "eg20246194@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6196", name: "HIMESH E.P.L.", email: "eg20246196@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6202", name: "INDUWARA D.P.G.D.", email: "eg20246202@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6204", name: "JATHUSHIHAN K.", email: "eg20246204@ce.dept.edu", year: 2, semester: 3, labGroup: "CE13", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE14
    { id: "EG/2024/6209", name: "JAYAMINI K.L.P.", email: "eg20246209@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6212", name: "JAYARATHNA D.K.T.", email: "eg20246212@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6213", name: "JAYARATHNA L.J.T.N.K.", email: "eg20246213@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6217", name: "JAYASINGHA J.A.T.P.", email: "eg20246217@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6225", name: "JAYASURIYA R.S.", email: "eg20246225@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6227", name: "JAYATHILAKA P.C.K.P.", email: "eg20246227@ce.dept.edu", year: 2, semester: 3, labGroup: "CE14", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE15
    { id: "EG/2024/6228", name: "JAYATHISSA G.R.C.H.", email: "eg20246228@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6229", name: "JAYAWARDANA N.T.N.", email: "eg20246229@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6235", name: "JOSHIA J.T.", email: "eg20246235@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6236", name: "SHERON ROHITH K.", email: "eg20246236@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6241", name: "KANCHANA H.A.P.", email: "eg20246241@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6244", name: "KARUNAPEMA B.S.S.", email: "eg20246244@ce.dept.edu", year: 2, semester: 3, labGroup: "CE15", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE16
    { id: "EG/2024/6247", name: "KARUNATHILAKA A.B.P.", email: "eg20246247@ce.dept.edu", year: 2, semester: 3, labGroup: "CE16", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6251", name: "KAVEESHA A.P.S.", email: "eg20246251@ce.dept.edu", year: 2, semester: 3, labGroup: "CE16", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6261", name: "KOSHIHAN S.", email: "eg20246261@ce.dept.edu", year: 2, semester: 3, labGroup: "CE16", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6262", name: "KOSHILA W.M.P.K.G.H.", email: "eg20246262@ce.dept.edu", year: 2, semester: 3, labGroup: "CE16", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE17
    { id: "EG/2024/6266", name: "KUMARA B.L.D.", email: "eg20246266@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6267", name: "KUMARA H.M.P.N.", email: "eg20246267@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6268", name: "KUMARA R.G.A.H.", email: "eg20246268@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6270", name: "KUMARA U.K.D.L.D.", email: "eg20246270@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6274", name: "KUMARASINGHE H.K.M.P.S.", email: "eg20246274@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6278", name: "KUMARI R.D.N.T.", email: "eg20246278@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6283", name: "LINGAMOORTHY .H", email: "eg20246283@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6285", name: "LIYANAARACHCHI L.A.Y.N.", email: "eg20246285@ce.dept.edu", year: 2, semester: 3, labGroup: "CE17", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE18
    { id: "EG/2024/6288", name: "LIYANAGE N.L.P.C.", email: "eg20246288@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6291", name: "LOHAVIASAN T.", email: "eg20246291@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6292", name: "RESAD INDIPA M.W.", email: "eg20246292@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6294", name: "MADHUWANTHA W.G.Y.", email: "eg20246294@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6304", name: "MALLAWAARACHCHI S.N.", email: "eg20246304@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6305", name: "MALLIKAARACHCHI M.A.D.P.", email: "eg20246305@ce.dept.edu", year: 2, semester: 3, labGroup: "CE18", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE19
    { id: "EG/2024/6308", name: "MANAMPERI Y.B.", email: "eg20246308@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6309", name: "MANJUSSARA H.G.A.M.", email: "eg20246309@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6310", name: "MARASINGHA M.M.S.B.", email: "eg20246310@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6311", name: "MARASINGHE K.K.", email: "eg20246311@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6314", name: "MATHEESHA G.P.", email: "eg20246314@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6317", name: "MINANGA W.L.M.", email: "eg20246317@ce.dept.edu", year: 2, semester: 3, labGroup: "CE19", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE20
    { id: "EG/2024/6318", name: "MITHUSHAN T.", email: "eg20246318@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6320", name: "MUDALIGEDARA M.H.M.", email: "eg20246320@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6325", name: "MUNIDASA A.D.C.P.", email: "eg20246325@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6330", name: "NANAYAKKARA A.H.C.", email: "eg20246330@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6333", name: "NETHMINI T.H.N.", email: "eg20246333@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6339", name: "NIMESHA K.H.A.D.", email: "eg20246339@ce.dept.edu", year: 2, semester: 3, labGroup: "CE20", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE21
    { id: "EG/2024/6343", name: "NIMSARA K.H.I.", email: "eg20246343@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6346", name: "NISAL L.A.C.", email: "eg20246346@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6347", name: "NISANSALA W.W.S.", email: "eg20246347@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6349", name: "NISHSHANKA P.G.C.D.", email: "eg20246349@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6354", name: "PALUGASWEWA T.K.", email: "eg20246354@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6355", name: "PANNILAGE V.M.", email: "eg20246355@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6356", name: "PATHIRANA G.S.M.", email: "eg20246356@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6364", name: "PERERA D.L.H.S.", email: "eg20246364@ce.dept.edu", year: 2, semester: 3, labGroup: "CE21", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE22
    { id: "EG/2024/6366", name: "PERERA G.H.S.T.", email: "eg20246366@ce.dept.edu", year: 2, semester: 3, labGroup: "CE22", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6367", name: "PERERA K.A.K.M.", email: "eg20246367@ce.dept.edu", year: 2, semester: 3, labGroup: "CE22", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6369", name: "PERERA M.D.O.", email: "eg20246369@ce.dept.edu", year: 2, semester: 3, labGroup: "CE22", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6373", name: "PERIES C.J.", email: "eg20246373@ce.dept.edu", year: 2, semester: 3, labGroup: "CE22", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE23
    { id: "EG/2024/6374", name: "PINTO M.K.H.P.", email: "eg20246374@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6376", name: "PIYUMANTHI K.A.U.", email: "eg20246376@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6380", name: "PRABHASHANA D.A.D.S.", email: "eg20246380@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6385", name: "PREMATHILAKE A.P.K.G.", email: "eg20246385@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6387", name: "PRIYADARSHANA K.L.A.B.C.", email: "eg20246387@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6389", name: "PRIYALAL S.D.", email: "eg20246389@ce.dept.edu", year: 2, semester: 3, labGroup: "CE23", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE24
    { id: "EG/2024/6393", name: "RAHMAN M.F.A.", email: "eg20246393@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6397", name: "RAJAPAKSHA K.T.S.", email: "eg20246397@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6400", name: "RAMANAYAKA Y.R.P.M.", email: "eg20246400@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6402", name: "RANASINGHA R.M.D.K.", email: "eg20246402@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6407", name: "RANASINGHE R.A.H.S.", email: "eg20246407@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6411", name: "RANATHUNGA R.A.D.", email: "eg20246411@ce.dept.edu", year: 2, semester: 3, labGroup: "CE24", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE25
    { id: "EG/2024/6414", name: "RANDUNI W.D.N.", email: "eg20246414@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6416", name: "RANMINA M.K.P.", email: "eg20246416@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6417", name: "RASANJANA H.A.M.", email: "eg20246417@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6424", name: "RATHNAYAKA R.M.A.D.K.", email: "eg20246424@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6426", name: "RATHNAYAKA R.M.D.D.", email: "eg20246426@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6429", name: "RATHNAYAKA R.M.S.R.", email: "eg20246429@ce.dept.edu", year: 2, semester: 3, labGroup: "CE25", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE26
    { id: "EG/2024/6431", name: "RATHNAYAKA R.M.W.G.L.W.", email: "eg20246431@ce.dept.edu", year: 2, semester: 3, labGroup: "CE26", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6434", name: "RATHNAYAKE R.M.D.L", email: "eg20246434@ce.dept.edu", year: 2, semester: 3, labGroup: "CE26", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6444", name: "SAMARAKOON S.M.H.C.M.", email: "eg20246444@ce.dept.edu", year: 2, semester: 3, labGroup: "CE26", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6447", name: "SAMARANAYAKE N.W.S.T.", email: "eg20246447@ce.dept.edu", year: 2, semester: 3, labGroup: "CE26", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE27
    { id: "EG/2024/6450", name: "SAMARAWIKRAMA P.G.K.H.", email: "eg20246450@ce.dept.edu", year: 2, semester: 3, labGroup: "CE27", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6454", name: "SANDAMINI A.M.H.", email: "eg20246454@ce.dept.edu", year: 2, semester: 3, labGroup: "CE27", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6456", name: "SANDARES W.A.J.", email: "eg20246456@ce.dept.edu", year: 2, semester: 3, labGroup: "CE27", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6465", name: "SARAPH S.G.", email: "eg20246465@ce.dept.edu", year: 2, semester: 3, labGroup: "CE27", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6466", name: "SASHMIKA B.A.N.", email: "eg20246466@ce.dept.edu", year: 2, semester: 3, labGroup: "CE27", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE28
    { id: "EG/2024/6467", name: "SATHUVAASAHAN T.", email: "eg20246467@ce.dept.edu", year: 2, semester: 3, labGroup: "CE28", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6471", name: "SENARATHNA W.P.N.S.", email: "eg20246471@ce.dept.edu", year: 2, semester: 3, labGroup: "CE28", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6473", name: "SENATHILAKA M.K.K.", email: "eg20246473@ce.dept.edu", year: 2, semester: 3, labGroup: "CE28", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE29
    { id: "EG/2024/6478", name: "SEWMINI W.A.C.", email: "eg20246478@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6482", name: "SILVA S.W.P.P.Y.", email: "eg20246482@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6486", name: "SITHARA V.A.H.", email: "eg20246486@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6487", name: "SITHUMINI P.G.T.N.", email: "eg20246487@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6489", name: "SIVAYOKESVARASARMA S.", email: "eg20246489@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6491", name: "SOORIYABANDARA M.G.K.S.", email: "eg20246491@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6492", name: "SUBASINGHE S.M.T.D.", email: "eg20246492@ce.dept.edu", year: 2, semester: 3, labGroup: "CE29", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE30
    { id: "EG/2024/6493", name: "SUBHASHANA P.H.", email: "eg20246493@ce.dept.edu", year: 2, semester: 3, labGroup: "CE30", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6494", name: "SUBHASINGHE S.N.", email: "eg20246494@ce.dept.edu", year: 2, semester: 3, labGroup: "CE30", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6495", name: "SUGATHADASA W.K.C.", email: "eg20246495@ce.dept.edu", year: 2, semester: 3, labGroup: "CE30", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6496", name: "SURAWEERA S.A.A.C.G.", email: "eg20246496@ce.dept.edu", year: 2, semester: 3, labGroup: "CE30", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6502", name: "THARUKA W.M.T.", email: "eg20246502@ce.dept.edu", year: 2, semester: 3, labGroup: "CE30", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE31
    { id: "EG/2024/6507", name: "THENNAKOON T.M.L.M.", email: "eg20246507@ce.dept.edu", year: 2, semester: 3, labGroup: "CE31", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6509", name: "THESHATHTHRI R.", email: "eg20246509@ce.dept.edu", year: 2, semester: 3, labGroup: "CE31", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6510", name: "THILAKARATHNE S.W.P.S.", email: "eg20246510@ce.dept.edu", year: 2, semester: 3, labGroup: "CE31", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6512", name: "UDEEPTHA T.A.V.", email: "eg20246512@ce.dept.edu", year: 2, semester: 3, labGroup: "CE31", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6516", name: "VIDANAGE T.P.P.", email: "eg20246516@ce.dept.edu", year: 2, semester: 3, labGroup: "CE31", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE32
    { id: "EG/2024/6522", name: "WAHARAKA K.P.N.S.N.", email: "eg20246522@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6525", name: "WEERAKOON D.A.N.M.", email: "eg20246525@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6526", name: "WEERARATHNA P.R.I.", email: "eg20246526@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6527", name: "WEERASEKARA W.M.S.S.", email: "eg20246527@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6528", name: "WEERASINGHE H.L.", email: "eg20246528@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6530", name: "WELLAPPILY T.J.H.", email: "eg20246530@ce.dept.edu", year: 2, semester: 3, labGroup: "CE32", isLeader: false, labsCompleted: 6, totalLabs: 10 },

    // CE33
    { id: "EG/2024/6531", name: "WICKRAMAARACHCHI W.A.B.J.", email: "eg20246531@ce.dept.edu", year: 2, semester: 3, labGroup: "CE33", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6533", name: "WICKRAMADHARI E.W.K.T.", email: "eg20246533@ce.dept.edu", year: 2, semester: 3, labGroup: "CE33", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6536", name: "WIJAYARATHNA M.M.C.L.", email: "eg20246536@ce.dept.edu", year: 2, semester: 3, labGroup: "CE33", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6537", name: "WIJEBANDARA W.G.I.P.", email: "eg20246537@ce.dept.edu", year: 2, semester: 3, labGroup: "CE33", isLeader: false, labsCompleted: 5, totalLabs: 10 },

    // CE34
    { id: "EG/2024/6539", name: "WIJEKOON A.W.W.M.G.B.", email: "eg20246539@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: true, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6540", name: "WIJEKOON W.M.S.R.B.", email: "eg20246540@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6541", name: "WIJERATHNA M.D.K.", email: "eg20246541@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6544", name: "WIJESINGHE L.D.", email: "eg20246544@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: false, labsCompleted: 6, totalLabs: 10 },
    { id: "EG/2024/6545", name: "WIJESINGHE W.M.S.K.", email: "eg20246545@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: false, labsCompleted: 5, totalLabs: 10 },
    { id: "EG/2024/6551", name: "RAIHANA M.R.F.", email: "eg20246551@ce.dept.edu", year: 2, semester: 3, labGroup: "CE34", isLeader: false, labsCompleted: 6, totalLabs: 10 }
  ],

  // Sample Lab Attendance Logs
  attendanceLogs: [
    {
      id: "LOG-CE01-01",
      labId: "LAB-CE01",
      labName: "EC3010-L: Data Structures Practical Lab",
      group: "CE01",
      date: "2026-07-29",
      updatedByLeader: "AHAMADH A.M (Leader CE01)",
      totalPresent: 6,
      totalAbsent: 0,
      totalLate: 0,
      records: {
        "EG/2023/5999": { status: "Present", notes: "Group leader - Completed Tree Practical" },
        "EG/2024/6005": { status: "Present", notes: "Completed Exercise 3" },
        "EG/2024/6006": { status: "Present", notes: "Completed Exercise 3" },
        "EG/2024/6007": { status: "Present", notes: "Completed Exercise 3" },
        "EG/2024/6010": { status: "Present", notes: "Completed Exercise 3" },
        "EG/2024/6014": { status: "Present", notes: "Completed Exercise 3" }
      }
    }
  ]
};


// --- File: js/store.js ---
/**
 * Store.js - Centralized Reactive State Management & LocalStorage Persistence
 * For Computer Engineering Academic Records System
 */


const STORAGE_KEY = 'COMP_ENG_ACADEMIC_RECORDS_V1';

// Preset Passcodes
const PASSCODES = {
  admin: 'admin123',
  leader: 'leader123'
};

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadData();
    this.currentRole = 'student'; // Default role starts in public student view
    this.authenticatedRoles = {
      admin: false,
      leader: false
    };
    this.activeLeaderGroup = 'CE01';
    this.activeView = 'dashboard';
    this.currentTheme = localStorage.getItem('ce_app_theme') || 'dark';
    
    // Apply initial theme attribute
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  // Load from localStorage or seed with mock data
  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.students) && parsed.students.length > 0 && Array.isArray(parsed.labGroups)) {
          if (!parsed.labs || parsed.labs.length !== 11) {
            parsed.labs = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.labs));
            parsed.courses = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.courses));
            parsed.lectures = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.lectures));
            this.saveData(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage, resetting to initial dataset.", e);
    }
    const freshData = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    this.saveData(freshData);
    return freshData;
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save state to localStorage.", e);
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    this.saveData();
    this.notify();
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveData();
    this.listeners.forEach(listener => listener(this.data));
  }

  // --- Password Authentication Methods ---
  verifyPassword(role, password) {
    if (role === 'admin') {
      return password === PASSCODES.admin;
    }
    if (role === 'leader') {
      return password === PASSCODES.leader || password.toLowerCase() === 'g1pass';
    }
    return true;
  }

  loginRole(role, password, studentId = '', targetGroup = '') {
    if (role === 'student') {
      this.currentRole = 'student';
      this.notify();
      return { success: true };
    }

    if (role === 'admin') {
      if (password === PASSCODES.admin) {
        this.authenticatedRoles.admin = true;
        this.currentRole = 'admin';
        this.notify();
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin passcode! (Default: admin123)' };
    }

    if (role === 'leader') {
      if (password !== PASSCODES.leader) {
        return { success: false, message: 'Invalid Group Leader passcode! (Default: leader123)' };
      }

      if (!studentId || !studentId.trim()) {
        return { success: false, message: 'Please enter your appointed Group Leader Student Registration No. (e.g. EG/2023/5999)' };
      }

      const cleanId = studentId.trim().toLowerCase();
      
      // Find matching lab group where leaderId matches entered student ID
      let matchingGroup = this.data.labGroups.find(g => 
        (g.leaderId && g.leaderId.trim().toLowerCase() === cleanId)
      );

      // Fallback check on student record isLeader flag
      if (!matchingGroup) {
        const student = this.data.students.find(s => s.id.trim().toLowerCase() === cleanId && s.isLeader);
        if (student) {
          matchingGroup = this.data.labGroups.find(g => g.id === student.labGroup);
        }
      }

      if (!matchingGroup) {
        return { 
          success: false, 
          message: `Access Denied: Registration No. "${studentId}" is not appointed as a Group Leader for any practical group!` 
        };
      }

      this.authenticatedRoles.leader = true;
      this.currentRole = 'leader';
      this.activeLeaderGroup = matchingGroup.id;
      this.currentLeaderStudentId = matchingGroup.leaderId;
      this.notify();
      
      return { 
        success: true, 
        message: `Welcome ${matchingGroup.leaderName}! Authenticated as Leader of ${matchingGroup.id}.`,
        group: matchingGroup.id
      };
    }

    return { success: false, message: 'Invalid role selection.' };
  }

  logout() {
    this.currentRole = 'student';
    this.authenticatedRoles = { admin: false, leader: false };
    this.notify();
  }

  setRole(role, group = 'Group G1') {
    if (role === 'admin' && !this.authenticatedRoles.admin) {
      return false;
    }
    if (role === 'leader' && !this.authenticatedRoles.leader) {
      return false;
    }
    this.currentRole = role;
    if (group) this.activeLeaderGroup = group;
    this.notify();
    return true;
  }

  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('ce_app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  setActiveView(view) {
    this.activeView = view;
    this.notify();
  }

  // --- Lab Group Editing ---
  updateLabGroup(updatedGroup) {
    const index = this.data.labGroups.findIndex(g => g.id === updatedGroup.id);
    if (index !== -1) {
      this.data.labGroups[index] = { ...this.data.labGroups[index], ...updatedGroup };
      
      // Update isLeader flags for all students in this group
      this.data.students.forEach(s => {
        if (s.labGroup === updatedGroup.id) {
          s.isLeader = (s.id === updatedGroup.leaderId || s.name === updatedGroup.leaderName);
        }
      });

      this.notify();
      return true;
    }
    return false;
  }

  addLabGroup(newGroup) {
    this.data.labGroups.push(newGroup);
    this.notify();
    return newGroup;
  }

  // --- Schedule Editing (Lectures & Labs) ---
  addLecture(lecture) {
    lecture.id = `LEC-${Date.now().toString().slice(-4)}`;
    lecture.type = "Lecture";
    this.data.lectures.push(lecture);
    this.notify();
    return lecture;
  }

  updateLecture(updatedLecture) {
    const index = this.data.lectures.findIndex(l => l.id === updatedLecture.id);
    if (index !== -1) {
      this.data.lectures[index] = { ...this.data.lectures[index], ...updatedLecture };
      this.notify();
      return true;
    }
    return false;
  }

  deleteLecture(id) {
    this.data.lectures = this.data.lectures.filter(l => l.id !== id);
    this.notify();
  }

  addLab(lab) {
    lab.id = `LAB-${Date.now().toString().slice(-4)}`;
    lab.type = "Lab";
    this.data.labs.push(lab);
    this.notify();
    return lab;
  }

  updateLab(updatedLab) {
    const index = this.data.labs.findIndex(l => l.id === updatedLab.id);
    if (index !== -1) {
      this.data.labs[index] = { ...this.data.labs[index], ...updatedLab };
      this.notify();
      return true;
    }
    return false;
  }

  deleteLab(id) {
    this.data.labs = this.data.labs.filter(l => l.id !== id);
    this.notify();
  }

  // --- Lab Attendance Tracking ---
  saveLabAttendance(logEntry) {
    logEntry.id = logEntry.id || `LOG-${Date.now().toString().slice(-6)}`;
    
    const studentIds = Object.keys(logEntry.records);
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    studentIds.forEach(stId => {
      const rec = logEntry.records[stId];
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
    });

    logEntry.totalPresent = presentCount;
    logEntry.totalAbsent = absentCount;
    logEntry.totalLate = lateCount;

    // Match attendance register by Particular Lab Experiment and Lab Group
    const existingIndex = this.data.attendanceLogs.findIndex(
      l => l.labId === logEntry.labId && l.group === logEntry.group
    );

    if (existingIndex !== -1) {
      this.data.attendanceLogs[existingIndex] = logEntry;
    } else {
      this.data.attendanceLogs.unshift(logEntry);
    }

    this.recalculateStudentStats();
    this.notify();
    return logEntry;
  }

  recalculateStudentStats() {
    const totalLabsAvailable = this.data.labs.length || 11;
    const studentCompletedLabsMap = {};

    this.data.attendanceLogs.forEach(log => {
      if (!log.records) return;
      Object.keys(log.records).forEach(stId => {
        if (!studentCompletedLabsMap[stId]) {
          studentCompletedLabsMap[stId] = new Set();
        }
        const rec = log.records[stId];
        if (rec.status === 'Present' || rec.status === 'Late') {
          studentCompletedLabsMap[stId].add(log.labId);
        }
      });
    });

    this.data.students.forEach(student => {
      student.totalLabs = totalLabsAvailable;
      const completedSet = studentCompletedLabsMap[student.id];
      student.labsCompleted = completedSet ? completedSet.size : 0;
    });
  }

  // Helper method to sort array of students by Registration Number (e.g. EG/2023/5001)
  sortStudentsByRegistration(studentsArr) {
    return studentsArr.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      if (numA !== numB) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  // --- Student Management ---
  addStudent(student) {
    const exists = this.data.students.some(s => s.id.toLowerCase() === student.id.toLowerCase());
    if (exists) {
      return { success: false, message: `Student ID ${student.id} already exists!` };
    }

    student.labsCompleted = student.labsCompleted || 0;
    student.totalLabs = student.totalLabs || 10;
    student.isLeader = student.isLeader || false;
    
    this.data.students.push(student);
    this.sortStudentsByRegistration(this.data.students);
    
    // Update group student count
    const grp = this.data.labGroups.find(g => g.id === student.labGroup);
    if (grp) {
      grp.studentCount = this.data.students.filter(s => s.labGroup === grp.id).length;
    }

    this.notify();
    return { success: true, student };
  }

  updateStudent(updatedStudent) {
    const index = this.data.students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      this.data.students[index] = { ...this.data.students[index], ...updatedStudent };
      this.sortStudentsByRegistration(this.data.students);
      this.notify();
      return true;
    }
    return false;
  }

  deleteStudent(studentId) {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) return false;
    
    this.data.students = this.data.students.filter(s => s.id !== studentId);
    
    // Update group count
    const grp = this.data.labGroups.find(g => g.id === student.labGroup);
    if (grp) {
      grp.studentCount = this.data.students.filter(s => s.labGroup === grp.id).length;
    }

    this.recalculateStudentStats();
    this.notify();
    return true;
  }

  getStudentsByGroup(groupName) {
    const groupStudents = this.data.students.filter(s => s.labGroup === groupName);
    return this.sortStudentsByRegistration(groupStudents);
  }

  getAttendanceLogsForGroup(groupName) {
    return this.data.attendanceLogs.filter(l => l.group === groupName);
  }

  getDepartmentStats() {
    const totalStudents = this.data.students.length;
    const totalLectures = this.data.lectures.length;
    const totalLabs = this.data.labs.length;

    return {
      totalStudents,
      totalLectures,
      totalLabs,
      groupsCount: this.data.labGroups.length
    };
  }
}

const store = new Store();


// --- File: js/components/ModalManager.js ---
/**
 * ModalManager.js - Dialog & Overlay Portal Manager
 * Includes Schedule Modals, Lab Group Modals, Student Profiles, Delete Confirmations, and Role Password Verification
 */



function openPasswordModal(targetRole, targetGroup = 'CE01') {
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
              <input type="text" id="auth-st-id-input" class="form-input" required placeholder="e.g. EG/2023/5999" autofocus>
              <span class="hint-text text-muted font-xs mt-1">e.g. <code>EG/2023/5999</code> (CE01), <code>EG/2024/6016</code> (CE02)</span>
            </div>
          ` : ''}

          <div class="form-group mt-3">
            <label class="form-label">Enter Passcode:</label>
            <input type="password" id="auth-passcode-input" class="form-input" required placeholder="Enter password..." ${!isLeaderAuth ? 'autofocus' : ''}>
            <span class="hint-text text-muted font-xs mt-1">Default demo passcode: <code>${hintText}</code></span>
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
function openEditLabGroupModal(group) {
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

function openScheduleModal(itemType, existingItem = null) {
  const isEdit = !!existingItem;
  const modalContainer = document.getElementById('modal-portal');
  if (!modalContainer) return;

  const courses = store.data.courses;
  const groups = store.data.labGroups;

  modalContainer.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>${isEdit ? '✏️ Edit' : '➕ Add New'} ${itemType === 'lecture' ? 'Lecture Schedule' : 'Lab Course Session'}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>

        <form id="schedule-form" class="modal-body">
          <div class="form-grid">
            
            <div class="form-group full-width">
              <label class="form-label">${itemType === 'lecture' ? 'Course Title' : 'Lab Session Title'}:</label>
              <input type="text" id="modal-title" class="form-input" required 
                     value="${escapeHtml(existingItem ? (itemType === 'lecture' ? existingItem.courseName : existingItem.labName) : '')}"
                     placeholder="e.g. Digital Logic & Computer Design">
            </div>

            <div class="form-group">
              <label class="form-label">Course Code:</label>
              <input type="text" id="modal-code" class="form-input" required 
                     value="${escapeHtml(existingItem ? existingItem.courseCode : '')}"
                     placeholder="e.g. CE101">
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

function openStudentModal(student, isEdit = false) {
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
function openAddStudentModal(defaultGroup = 'CE01') {
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
function openDeleteStudentConfirmModal(student) {
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

function openDeleteConfirmModal(message, onConfirm) {
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


// --- File: js/components/Navbar.js ---
/**
 * Navbar.js - Header Bar with Role Switcher, Password Auth & Theme Toggle
 */



function renderNavbar(container) {
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
              <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
              <path d="M6 9h12"/>
              <path d="M6 15h12"/>
            </svg>
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


// --- File: js/components/DashboardView.js ---
/**
 * DashboardView.js - Main Department Overview & Computer Engineering Hub
 */




function renderDashboardView(container) {
  const role = store.currentRole;
  const isAdmin = role === 'admin';
  const groups = store.data.labGroups;
  const students = store.data.students;
  const labs = store.data.labs;
  const courses = store.data.courses;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-header-left">
        <h2>📊 Computer Engineering Department Dashboard</h2>
        <p class="view-description">
          Overview of academic course schedules, ${students.length} student rosters, and laboratory groups.
        </p>
      </div>

      <div class="view-header-right">
        <button id="quick-backup-btn" class="btn btn-outline">
          📦 Backup Full JSON
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="kpi-grid">
      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Total Department Students</span>
          <span class="kpi-icon icon-indigo">🎓</span>
        </div>
        <div class="kpi-value">${students.length}</div>
        <div class="kpi-subtitle">Divided across ${groups.length} Lab Groups</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Active Lab Groups</span>
          <span class="kpi-icon icon-cyan">🧪</span>
        </div>
        <div class="kpi-value">${groups.length}</div>
        <div class="kpi-subtitle">Managed by ${groups.length} Group Leaders</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Department Courses</span>
          <span class="kpi-icon icon-emerald">📚</span>
        </div>
        <div class="kpi-value text-emerald">${courses.length}</div>
        <div class="kpi-subtitle">Semester 3 Curriculum</div>
      </div>

      <div class="kpi-card card">
        <div class="kpi-header">
          <span class="kpi-title">Weekly Lab Sessions</span>
          <span class="kpi-icon icon-rose">🔬</span>
        </div>
        <div class="kpi-value text-cyan">${labs.length}</div>
        <div class="kpi-subtitle">Practical Hardware & Systems Labs</div>
      </div>
    </div>

    <!-- Dashboard Content Layout Grid -->
    <div class="dashboard-layout-grid">
      
      <!-- Group Roster Summary Table -->
      <div class="card chart-card">
        <div class="card-header">
          <h3 class="card-title">🧪 Laboratory Groups Overview (CE01 - CE28)</h3>
          <span class="sub-text">${isAdmin ? '👑 Admin Mode: Click Edit Leader to reassign leaders' : 'Assigned Leaders & Rooms'}</span>
        </div>
        <div class="table-container mt-3">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lab Group</th>
                <th>Group Leader</th>
                <th>Leader Student ID</th>
                <th>Roster Count</th>
                <th>Assigned Lab Room</th>
                ${isAdmin ? '<th>Actions</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${groups.map(g => {
                const groupStudents = students.filter(s => s.labGroup === g.id);
                return `
                  <tr>
                    <td><span class="group-tag">${g.id}</span></td>
                    <td><span class="font-bold text-cyan">${g.leaderName}</span></td>
                    <td class="font-mono text-muted">${g.leaderId || 'N/A'}</td>
                    <td>${groupStudents.length} Students</td>
                    <td class="text-muted font-sm">${g.labRoom}</td>
                    ${isAdmin ? `
                      <td>
                        <button class="btn btn-xs btn-outline-cyan edit-dash-group-btn" data-id="${g.id}">
                          ✏️ Edit Leader
                        </button>
                      </td>
                    ` : ''}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Action Shortcuts Sidebar -->
      <div class="card shortcuts-card">
        <h3 class="card-title">🚀 Department Quick Actions</h3>
        
        <div class="quick-action-buttons">
          <button id="dash-go-schedule" class="action-btn">
            <span class="btn-icon-bg bg-indigo">📅</span>
            <div class="action-text">
              <strong>Manage Timetable</strong>
              <span>Add or edit lecture & lab schedules</span>
            </div>
          </button>

          <button id="dash-go-attendance" class="action-btn">
            <span class="btn-icon-bg bg-cyan">⚡</span>
            <div class="action-text">
              <strong>Take Lab Attendance</strong>
              <span>Group Leaders batch attendance portal</span>
            </div>
          </button>

          <button id="dash-go-students" class="action-btn">
            <span class="btn-icon-bg bg-emerald">👥</span>
            <div class="action-text">
              <strong>Browse 162 Students</strong>
              <span>Search student records & lab groups</span>
            </div>
          </button>
        </div>

        <div class="info-card-box mt-4 p-3 bg-secondary border-color rounded">
          <h4 class="font-sm text-cyan mb-1">💡 Access Control Notes</h4>
          <p class="font-xs text-secondary">
            Timetables and Lab Group Leaders are editable <strong>only by Department Admins</strong> (passcode: <code>admin123</code>). Lab Group Leaders log in to take attendance for their respective group.
          </p>
        </div>
      </div>

    </div>
  `;

  // Attach Event Listeners
  container.querySelectorAll('.edit-dash-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = groups.find(g => g.id === btn.dataset.id);
      if (grp) openEditLabGroupModal(grp);
    });
  });

  const scheduleBtn = container.querySelector('#dash-go-schedule');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => store.setActiveView('schedule'));
  }

  const attBtn = container.querySelector('#dash-go-attendance');
  if (attBtn) {
    attBtn.addEventListener('click', () => store.setActiveView('attendance'));
  }

  const stBtn = container.querySelector('#dash-go-students');
  if (stBtn) {
    stBtn.addEventListener('click', () => store.setActiveView('students'));
  }

  const backupBtn = container.querySelector('#quick-backup-btn');
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      exportFullBackupJson(store.data);
    });
  }
}


// --- File: js/components/ScheduleView.js ---
/**
 * ScheduleView.js - Interactive & Editable Timetable Grid for Lectures and Labs
 */




function renderScheduleView(container) {
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


// --- File: js/components/AttendanceView.js ---
/**
 * AttendanceView.js - Lab Attendance Tracker & Department Master Summary
 * Access Control Rule: ONLY Lab Group Leaders are authorized to mark attendance for their assigned group.
 * Admin Access Rule: Department Admins have full access to view, analyze, and export Department Master Attendance Summaries (195 Students x 11 Labs).
 */





function renderAttendanceView(container) {
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
    // Sort filtered students by Group ID and then Registration Number
    filteredStudents.sort((a, b) => {
      if (a.labGroup !== b.labGroup) {
        return a.labGroup.localeCompare(b.labGroup, undefined, { numeric: true });
      }
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      if (numA !== numB) return numA - numB;
      return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
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


// --- File: js/components/StudentsView.js ---
/**
 * StudentsView.js - Roster & Academic Records for 195 Department Students
 */




function renderStudentsView(container) {
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
          <button id="export-students-csv" class="btn btn-outline">
            📥 Export Roster CSV
          </button>
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
                    <div style="display: flex; gap: 4px;">
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

    const exportBtn = container.querySelector('#export-students-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportStudentsCsv(students);
      });
    }
  }

  render();
}


// --- File: js/app.js ---
/**
 * app.js - Main Application Orchestrator & View Switcher
 */







function initApp() {
  const navbarContainer = document.getElementById('navbar-container');
  const viewContainer = document.getElementById('view-container');

  function updateUI() {
    try {
      // 1. Render Header / Navbar
      if (navbarContainer) renderNavbar(navbarContainer);

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
        localStorage.clear();
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


})();
