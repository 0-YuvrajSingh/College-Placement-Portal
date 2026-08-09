export type Role = 'student' | 'recruiter' | 'admin'

export type JobStatus = 'Open' | 'Closed' | 'Expired'
export type AppStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn'

export interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  type: 'Full-time' | 'Internship' | 'Contract'
  package: string
  deadline: string
  skills: string[]
  eligible: boolean
  applied: boolean
  featured: boolean
  closingSoon: boolean
  applicants: number
  branch: string[]
  cgpa: number
  status: JobStatus
  description: string
  responsibilities: string[]
  requirements: string[]
  createdAt: string
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  logo: string
  appliedAt: string
  status: AppStatus
  timeline: { stage: AppStatus; date: string; note?: string }[]
}

export interface Student {
  id: string
  name: string
  email: string
  branch: string
  cgpa: number
  year: number
  skills: string[]
  resumeUrl?: string
  profileComplete: number
  applications: number
  status: 'Active' | 'Placed' | 'Inactive'
}

export interface RecruiterEntry {
  id: string
  company: string
  name: string
  email: string
  jobs: number
  status: 'Active' | 'Pending' | 'Suspended'
  createdAt: string
}

export const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Software Engineer',
    company: 'Infosys',
    logo: 'IN',
    location: 'Bangalore',
    type: 'Full-time',
    package: '₹8 LPA',
    deadline: '2024-02-15',
    skills: ['Java', 'Spring Boot', 'SQL'],
    eligible: true,
    applied: false,
    featured: true,
    closingSoon: false,
    applicants: 142,
    branch: ['CSE', 'IT', 'ECE'],
    cgpa: 7.0,
    status: 'Open',
    description: 'Join our engineering team to build scalable enterprise applications that power millions of users globally. You will work across the full stack in a collaborative environment.',
    responsibilities: [
      'Design and develop high-volume, low-latency applications',
      'Contribute to all phases of the development lifecycle',
      'Write well-designed, testable, efficient code',
      'Collaborate with team members on technical solutions',
    ],
    requirements: [
      "Bachelor's in CS/IT or equivalent",
      'Strong Java fundamentals',
      'Familiarity with Spring Boot framework',
      'Good understanding of databases and SQL',
    ],
    createdAt: '2024-01-10',
  },
  {
    id: 'j2',
    title: 'Frontend Developer Intern',
    company: 'Razorpay',
    logo: 'RP',
    location: 'Bangalore (Hybrid)',
    type: 'Internship',
    package: '₹45,000/mo',
    deadline: '2024-02-10',
    skills: ['React', 'TypeScript', 'CSS'],
    eligible: true,
    applied: true,
    featured: false,
    closingSoon: true,
    applicants: 89,
    branch: ['CSE', 'IT'],
    cgpa: 7.5,
    status: 'Open',
    description: 'Work on cutting-edge fintech products used by millions. You will be embedded in a product squad and own real features from day one.',
    responsibilities: [
      'Build and ship UI features in React',
      'Write component tests and maintain code quality',
      'Participate in design reviews and sprint planning',
    ],
    requirements: [
      'Strong HTML, CSS, JavaScript fundamentals',
      'Experience with React',
      'TypeScript preferred',
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'j3',
    title: 'Data Analyst',
    company: 'Deloitte',
    logo: 'DL',
    location: 'Mumbai',
    type: 'Full-time',
    package: '₹10 LPA',
    deadline: '2024-03-01',
    skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    eligible: false,
    applied: false,
    featured: false,
    closingSoon: false,
    applicants: 203,
    branch: ['CSE', 'IT', 'MBA'],
    cgpa: 8.0,
    status: 'Open',
    description: 'Drive data-driven decisions for Fortune 500 clients. You will work in consulting teams building dashboards, models, and reports.',
    responsibilities: [
      'Analyse large datasets to find business insights',
      'Build Tableau dashboards for client stakeholders',
      'Write SQL queries for data extraction and transformation',
    ],
    requirements: [
      'CGPA 8.0 or above required',
      'Proficiency in Python and SQL',
      'Experience with BI tools like Tableau or Power BI',
    ],
    createdAt: '2024-01-20',
  },
  {
    id: 'j4',
    title: 'Systems Engineer',
    company: 'TCS',
    logo: 'TC',
    location: 'Chennai / Pune',
    type: 'Full-time',
    package: '₹7 LPA',
    deadline: '2024-02-28',
    skills: ['C++', 'Linux', 'Networking'],
    eligible: true,
    applied: false,
    featured: false,
    closingSoon: false,
    applicants: 318,
    branch: ['CSE', 'IT', 'ECE', 'EEE'],
    cgpa: 6.5,
    status: 'Open',
    description: 'Join TCS as a Systems Engineer and work on enterprise infrastructure projects for global clients across banking, retail, and telecom.',
    responsibilities: [
      'Deploy and maintain enterprise infrastructure',
      'Write automation scripts for system management',
      'Troubleshoot and resolve technical issues',
    ],
    requirements: [
      'Any engineering branch',
      'CGPA 6.5+',
      'Good communication skills',
    ],
    createdAt: '2024-01-08',
  },
  {
    id: 'j5',
    title: 'Product Manager Intern',
    company: 'Swiggy',
    logo: 'SW',
    location: 'Bangalore',
    type: 'Internship',
    package: '₹60,000/mo',
    deadline: '2024-02-05',
    skills: ['Product Thinking', 'Analytics', 'Communication'],
    eligible: true,
    applied: false,
    featured: true,
    closingSoon: true,
    applicants: 67,
    branch: ['CSE', 'IT', 'MBA'],
    cgpa: 8.0,
    status: 'Open',
    description: 'Shape the future of food delivery. You will own product initiatives end-to-end — from discovery to launch — within one of India\'s fastest-growing consumer apps.',
    responsibilities: [
      'Define and prioritize product requirements',
      'Collaborate with design, engineering, and data teams',
      'Run experiments and measure feature impact',
    ],
    requirements: [
      'CGPA 8.0+',
      'Strong analytical and communication skills',
      'Prior product or startup experience preferred',
    ],
    createdAt: '2024-01-18',
  },
]

export const APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j2',
    jobTitle: 'Frontend Developer Intern',
    company: 'Razorpay',
    logo: 'RP',
    appliedAt: '2024-01-16',
    status: 'Shortlisted',
    timeline: [
      { stage: 'Applied', date: '16 Jan 2024', note: 'Application submitted successfully' },
      { stage: 'Shortlisted', date: '19 Jan 2024', note: 'You have been shortlisted for the next round' },
    ],
  },
  {
    id: 'a2',
    jobId: 'j1',
    jobTitle: 'Software Engineer',
    company: 'Infosys',
    logo: 'IN',
    appliedAt: '2024-01-12',
    status: 'Interview',
    timeline: [
      { stage: 'Applied', date: '12 Jan 2024' },
      { stage: 'Shortlisted', date: '15 Jan 2024' },
      { stage: 'Interview', date: '22 Jan 2024', note: 'Technical interview scheduled for 25 Jan' },
    ],
  },
  {
    id: 'a3',
    jobId: 'j4',
    jobTitle: 'Systems Engineer',
    company: 'TCS',
    logo: 'TC',
    appliedAt: '2024-01-09',
    status: 'Rejected',
    timeline: [
      { stage: 'Applied', date: '9 Jan 2024' },
      { stage: 'Rejected', date: '18 Jan 2024', note: 'Thank you for your application. We will keep your profile on file.' },
    ],
  },
]

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Aryan Mehta', email: 'aryan@college.edu', branch: 'CSE', cgpa: 8.7, year: 4, skills: ['React', 'Node.js', 'Python'], profileComplete: 92, applications: 5, status: 'Active' },
  { id: 's2', name: 'Priya Sharma', email: 'priya@college.edu', branch: 'IT', cgpa: 9.1, year: 4, skills: ['Java', 'SQL', 'Spring'], profileComplete: 100, applications: 3, status: 'Placed' },
  { id: 's3', name: 'Rohit Singh', email: 'rohit@college.edu', branch: 'ECE', cgpa: 7.4, year: 4, skills: ['C++', 'Embedded'], profileComplete: 74, applications: 2, status: 'Active' },
  { id: 's4', name: 'Neha Joshi', email: 'neha@college.edu', branch: 'CSE', cgpa: 8.2, year: 4, skills: ['Python', 'ML', 'TensorFlow'], profileComplete: 88, applications: 7, status: 'Active' },
  { id: 's5', name: 'Karan Patel', email: 'karan@college.edu', branch: 'IT', cgpa: 7.9, year: 4, skills: ['React', 'TypeScript'], profileComplete: 81, applications: 4, status: 'Active' },
  { id: 's6', name: 'Divya Nair', email: 'divya@college.edu', branch: 'CSE', cgpa: 9.4, year: 4, skills: ['Go', 'Kubernetes', 'AWS'], profileComplete: 95, applications: 6, status: 'Placed' },
  { id: 's7', name: 'Amit Kumar', email: 'amit@college.edu', branch: 'EEE', cgpa: 6.8, year: 4, skills: ['MATLAB', 'PLC'], profileComplete: 60, applications: 1, status: 'Inactive' },
]

export const RECRUITERS: RecruiterEntry[] = [
  { id: 'r1', company: 'Infosys', name: 'Rajesh Nair', email: 'rajesh@infosys.com', jobs: 3, status: 'Active', createdAt: '2024-01-05' },
  { id: 'r2', company: 'Razorpay', name: 'Anita Desai', email: 'anita@razorpay.com', jobs: 2, status: 'Active', createdAt: '2024-01-10' },
  { id: 'r3', company: 'Deloitte', name: 'Suresh Verma', email: 'suresh@deloitte.com', jobs: 1, status: 'Pending', createdAt: '2024-01-18' },
  { id: 'r4', company: 'TCS', name: 'Meera Krishnan', email: 'meera@tcs.com', jobs: 4, status: 'Active', createdAt: '2023-12-20' },
  { id: 'r5', company: 'Swiggy', name: 'Dev Agarwal', email: 'dev@swiggy.com', jobs: 1, status: 'Active', createdAt: '2024-01-15' },
]

export const currentStudent: Student = {
  id: 'me',
  name: 'Aryan Mehta',
  email: 'aryan.mehta@college.edu',
  branch: 'CSE',
  cgpa: 8.7,
  year: 4,
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
  resumeUrl: 'aryan_mehta_resume.pdf',
  profileComplete: 78,
  applications: 3,
  status: 'Active',
}
