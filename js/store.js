/**
 * Store.js - Centralized Reactive State Management & LocalStorage Persistence
 * For Computer Engineering Academic Records System
 */
import { INITIAL_MOCK_DATA } from './mockData.js';
import { firebaseConfig } from './firebaseConfig.js';

const STORAGE_KEY = 'COMP_ENG_ACADEMIC_RECORDS_V1';

// Preset Passcodes
export const PASSCODES = {
  admin: 'com@26Batch',
  leader: 'lab26@com'
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
    this.currentTheme = 'dark';
    try {
      this.currentTheme = localStorage.getItem('ce_app_theme') || 'dark';
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
    
    // Apply initial theme attribute
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Initial student statistics calculation
    this.recalculateStudentStats();

    // Firestore instance reference
    this.db = null;
    this.isCloudConnected = false;
    this.initFirestoreSync();

    // Cross-tab auto-sync & automatic stats calculation for all 195/200 students
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.data = this.loadData();
          this.recalculateStudentStats();
          this.notify();
        }
      });
      
      // Real-time auto-sync ticker (every 10 seconds) to guarantee student stats update
      setInterval(() => {
        try {
          const savedStr = localStorage.getItem(STORAGE_KEY);
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            if (parsed && JSON.stringify(parsed) !== JSON.stringify(this.data)) {
              this.data = parsed;
              this.recalculateStudentStats();
              this.notify();
            }
          }
        } catch (e) {}
      }, 10000);
    }
  }

  // Initialize Firebase Cloud Firestore Real-time Subscriptions
  initFirestoreSync() {
    try {
      if (typeof window === 'undefined' || !window.firebase) return;
      
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      
      this.db = window.firebase.firestore();
      if (!this.db) return;

      this.isCloudConnected = true;
      console.log("🔥 Firebase Cloud Firestore live real-time sync active.");

      // Firestore listeners
      this.db.collection('courses').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push(doc.data()));
          if (list.length > 0) {
            this.data.courses = list;
            this.recalculateStudentStats();
            this.notify();
          }
        }
      }, e => console.warn("Firestore courses sync note:", e));

      this.db.collection('labs').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push(doc.data()));
          if (list.length > 0) {
            this.data.labs = list;
            this.recalculateStudentStats();
            this.notify();
          }
        }
      }, e => console.warn("Firestore labs sync note:", e));

      this.db.collection('attendanceLogs').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push(doc.data()));
          this.data.attendanceLogs = list;
          this.recalculateStudentStats();
          this.notify();
        }
      }, e => console.warn("Firestore attendanceLogs sync note:", e));

      this.db.collection('students').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push(doc.data()));
          if (list.length > 0) {
            this.data.students = list;
            this.sortStudentsByRegistration(this.data.students);
            this.recalculateStudentStats();
            this.notify();
          }
        }
      }, e => console.warn("Firestore students sync note:", e));

      this.db.collection('labGroups').onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push(doc.data()));
          if (list.length > 0) {
            this.data.labGroups = list;
            this.notify();
          }
        }
      }, e => console.warn("Firestore labGroups sync note:", e));

    } catch (e) {
      console.warn("Firestore initialization status:", e);
    }
  }

  syncItemToFirestore(collectionName, docId, dataObj) {
    if (this.db && docId) {
      try {
        const cleanId = String(docId).replace(/[\/\s]/g, '_');
        this.db.collection(collectionName).doc(cleanId).set(dataObj, { merge: true });
      } catch (e) {
        console.warn(`Firestore sync set error (${collectionName}/${docId}):`, e);
      }
    }
  }

  deleteItemFromFirestore(collectionName, docId) {
    if (this.db && docId) {
      try {
        const cleanId = String(docId).replace(/[\/\s]/g, '_');
        this.db.collection(collectionName).doc(cleanId).delete();
      } catch (e) {
        console.warn(`Firestore sync delete error (${collectionName}/${docId}):`, e);
      }
    }
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
          if (!parsed.courses || !Array.isArray(parsed.courses) || parsed.courses.length === 0) {
            parsed.courses = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.courses));
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
      return password === PASSCODES.leader;
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
      return { success: false, message: 'Invalid Admin passcode!' };
    }

    if (role === 'leader') {
      if (password !== PASSCODES.leader) {
        return { success: false, message: 'Invalid Group Leader passcode!' };
      }

      if (!studentId || !studentId.trim()) {
        return { success: false, message: 'Please enter your appointed Group Leader Student Registration No.' };
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
    try {
      localStorage.setItem('ce_app_theme', theme);
    } catch (e) {}
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

      this.syncItemToFirestore('labGroups', updatedGroup.id, updatedGroup);
      this.notify();
      return true;
    }
    return false;
  }

  addLabGroup(newGroup) {
    this.data.labGroups.push(newGroup);
    this.syncItemToFirestore('labGroups', newGroup.id, newGroup);
    this.notify();
    return newGroup;
  }

  // --- Course / Module Management ---
  addCourse(course) {
    const cleanCode = course.code.trim().toUpperCase();
    const exists = this.data.courses.some(c => c.code.toUpperCase() === cleanCode);
    if (exists) {
      return { success: false, message: `Module with code "${cleanCode}" already exists!` };
    }
    course.code = cleanCode;
    course.labsCount = course.labsCount || 0;
    this.data.courses.push(course);
    this.recalculateStudentStats();
    this.syncItemToFirestore('courses', course.code, course);
    this.notify();
    return { success: true, course };
  }

  updateCourse(updatedCourse) {
    const cleanCode = updatedCourse.code.trim().toUpperCase();
    const index = this.data.courses.findIndex(c => c.code.toUpperCase() === cleanCode);
    if (index !== -1) {
      this.data.courses[index] = { ...this.data.courses[index], ...updatedCourse, code: cleanCode };
      this.recalculateStudentStats();
      this.syncItemToFirestore('courses', cleanCode, updatedCourse);
      this.notify();
      return { success: true };
    }
    return { success: false, message: `Module "${cleanCode}" not found!` };
  }

  deleteCourse(code) {
    const cleanCode = code.trim().toUpperCase();
    this.data.courses = this.data.courses.filter(c => c.code.toUpperCase() !== cleanCode);
    
    // Clean up labs and attendance logs associated with deleted module
    const removedLabIds = this.data.labs
      .filter(l => l.courseCode && l.courseCode.toUpperCase() === cleanCode)
      .map(l => l.id);

    this.data.labs = this.data.labs.filter(l => !l.courseCode || l.courseCode.toUpperCase() !== cleanCode);

    if (removedLabIds.length > 0) {
      this.data.attendanceLogs = this.data.attendanceLogs.filter(log => !removedLabIds.includes(log.labId));
      removedLabIds.forEach(labId => this.deleteItemFromFirestore('labs', labId));
    }

    this.deleteItemFromFirestore('courses', cleanCode);
    this.recalculateStudentStats();
    this.notify();
    return { success: true };
  }

  // --- Schedule Editing (Lectures & Labs) ---
  addLecture(lecture) {
    lecture.id = `LEC-${Date.now().toString().slice(-4)}`;
    lecture.type = "Lecture";
    this.data.lectures.push(lecture);
    this.syncItemToFirestore('lectures', lecture.id, lecture);
    this.notify();
    return lecture;
  }

  updateLecture(updatedLecture) {
    const index = this.data.lectures.findIndex(l => l.id === updatedLecture.id);
    if (index !== -1) {
      this.data.lectures[index] = { ...this.data.lectures[index], ...updatedLecture };
      this.syncItemToFirestore('lectures', updatedLecture.id, updatedLecture);
      this.notify();
      return true;
    }
    return false;
  }

  deleteLecture(id) {
    this.data.lectures = this.data.lectures.filter(l => l.id !== id);
    this.deleteItemFromFirestore('lectures', id);
    this.notify();
  }

  addLab(lab) {
    lab.id = `LAB-${Date.now().toString().slice(-4)}`;
    lab.type = "Lab";
    this.data.labs.push(lab);
    this.recalculateStudentStats();
    this.syncItemToFirestore('labs', lab.id, lab);
    this.notify();
    return lab;
  }

  updateLab(updatedLab) {
    const index = this.data.labs.findIndex(l => l.id === updatedLab.id);
    if (index !== -1) {
      this.data.labs[index] = { ...this.data.labs[index], ...updatedLab };
      this.recalculateStudentStats();
      this.syncItemToFirestore('labs', updatedLab.id, updatedLab);
      this.notify();
      return true;
    }
    return false;
  }

  deleteLab(id) {
    this.data.labs = this.data.labs.filter(l => l.id !== id);
    this.data.attendanceLogs = this.data.attendanceLogs.filter(log => log.labId !== id);
    this.deleteItemFromFirestore('labs', id);
    this.recalculateStudentStats();
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
    this.syncItemToFirestore('attendanceLogs', logEntry.id, logEntry);
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

export const store = new Store();
