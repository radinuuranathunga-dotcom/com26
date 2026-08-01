/**
 * Real Student & Group Roster Data for 26th Batch - Semester 3 - Computer Engineering
 * Academic Year 2026/2027
 */

export const INITIAL_MOCK_DATA = {
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
