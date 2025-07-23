import { Course, Lesson } from '@prisma/client';

export interface CourseProps extends Course {
  lessons: Lesson[];
}

export interface CoursesViewProps {
  courses: CourseProps[];
}
