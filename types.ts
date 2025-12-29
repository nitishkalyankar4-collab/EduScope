
export type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  requestDate: string;
  subject?: string;
  avatar?: string;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  section: string;
  studentJoinCode: string;
  staffJoinCode: string;
  ownerId: string;
  subjectTeachers: { [subject: string]: string }; // Map of Subject -> Teacher Name
  studentCount: number;
  description?: string;
  pendingRequests: JoinRequest[];
}

export type ResourceType = 'NOTE' | 'VIDEO' | 'LINK' | 'PHOTO';
export type AssignmentStatus = 'COMPLETED' | 'PENDING' | 'INCOMPLETE';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  resources: Resource[];
  assignedTo: string; // Classroom ID
  teacherId: string;
  statusUpdates?: { [studentId: string]: AssignmentStatus };
}

export interface ParentBroadcast {
  id: string;
  classId: string;
  message: string;
  timestamp: string;
  priority: 'NORMAL' | 'URGENT';
}

export interface StudentReport {
  studentId: string;
  teacherId: string;
  academicSummary: string;
  behaviorScore: number;
  attendanceRate: number;
  personalNotes: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

// Added missing interface for assignment tracking
export interface StudentAssignmentStatus {
  assignmentId: string;
  studentId: string;
  status: AssignmentStatus;
  lastUpdated: string;
}

// Added missing interface for library resources
export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  type: string;
  category: string;
  thumbnail: string;
}
