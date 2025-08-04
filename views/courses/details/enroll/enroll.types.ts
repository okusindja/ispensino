import { Course, Lesson, User } from '@prisma/client';

export interface EnrollProps {
  course: Course & { lessons: Lesson[]; teacher: User };
}
