import { Course, Lesson, User } from '@prisma/client';

export interface CourseDetailsProps {
  course: Course & { lessons: Lesson[]; teacher: User };
}
