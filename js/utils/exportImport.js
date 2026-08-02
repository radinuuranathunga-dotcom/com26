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
export function exportStudentsCsv(students) {
  let csv = 'Student ID,Full Name,Email,Year,Semester,Lab Group,Labs Completed\n';
  students.forEach(s => {
    csv += `"${s.id}","${s.name}","${s.email}",${s.year},${s.semester},"${s.labGroup}",${s.labsCompleted || 0}\n`;
  });
  downloadCsv(`CompEng_Student_Roster_${new Date().toISOString().slice(0,10)}.csv`, csv);
}

// Export Schedule to CSV
export function exportScheduleCsv(lectures, labs) {
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
export function exportAttendanceLogCsv(logEntry, students) {
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
export function exportMasterAttendanceCsv(students, labs, attendanceLogs) {
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
export function exportFullBackupJson(data) {
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
