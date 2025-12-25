export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  username: string | null;
  image: string | null;
  avgAssessmentScore: number;
  totalCoursesWithTeacher: number;
  enrollments: StudentEnrollment[];
  assessments: StudentAssessment[];
}

export interface StudentEnrollment {
  id: string;
  enrolledAt: string; // or Date if you parse it
  completedAt: string | null; // or Date if you parse it
  progress: number;
  assessmentScoreAverage: number;
  course: CourseInfo;
  // If you have payments in the enrollment
  payments?: PaymentInfo[];
}

export interface CourseInfo {
  id: string;
  title: string;
  level?: string; // BEGINNER, INTERMEDIATE, ADVANCED
  // Add other course fields you might need
}

export interface StudentAssessment {
  id?: string;
  score: number;
  isPassed: boolean;
  completedAt?: string; // or Date
  lessonTitle?: string;
  courseTitle?: string;
  // Add other assessment fields you might need
}

export interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string; // PENDING, COMPLETED, FAILED, REFUNDED
  createdAt: string; // or Date
}

export interface TeacherInfo {
  id: string;
  name: string;
  email: string;
  // Add other teacher fields you might need
  image?: string | null;
  username?: string | null;
}

export interface TeacherStudentsResponse {
  teacher: TeacherInfo;
  students: TeacherStudent[];
  totalStudents: number;
  totalCourses: number;
}

// If you want more specific enums based on your schema:
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}
