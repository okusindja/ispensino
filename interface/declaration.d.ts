import { Category, Course, Enrollment, Lesson, User } from '@prisma/client';
import { NextPage } from 'next';

import { HomePageProps } from '@/views/home/home.types';
import { LessonPageProps } from '@/views/lessons/details/lesson-details.types';

export interface NextPageDefaultProps {
  now: number;
  pageTitle: string;
  user: SessionUserProps;
}

export interface UserProps extends User {
  teachingCourses: Course[];
}

export interface SessionUserProps {
  uid: string;
  email: string | null;
}
export interface NextPageWithSessionProps {
  user: SessionUserProps;
}

export interface NextPageWithUserProps {
  loggedUser: UserProps;
  user: SessionUserProps;
}
export interface NextPageWithCourseAndTeacherProps {
  course: Course & {
    lessons: Lesson[];
    categories: Category[];
    enrollments: Enrollment[];
  };
  teacher: UserProps;
  user: SessionUserProps;
}
export interface NextPageWithCourseProps {
  course: Course & { lessons: Lesson[]; teacher: User };
  isEnrolled: boolean;
}
export interface NextPageWithCoursesArrayProps {
  courses: Array<Course & { lessons: Lesson[] }>;
}
export interface NextPageWithLessonProps extends LessonPageProps {
  lessonId: string;
  teacher: UserProps;
  user: SessionUserProps;
  courseSlug: string;
  courseId: string;
}

export type NextPageWithUser = NextPage<
  NextPageWithUserProps & NextPageDefaultProps
>;

export type NextPageWithCourse = NextPage<
  NextPageWithCourseProps & NextPageDefaultProps
>;
export type NextPageWithCourses = NextPage<
  NextPageWithCoursesArrayProps & NextPageDefaultProps
>;
export type NextPageWithLesson = NextPage<
  NextPageWithLessonProps & NextPageDefaultProps
>;

export type NextPageWithCourseAndTeacher = NextPage<
  NextPageWithCourseAndTeacherProps & NextPageDefaultProps
>;

export type NextPageWithSession = NextPage<
  NextPageWithSessionProps & NextPageDefaultProps
>;

export type NextPageWithProps = NextPage<NextPageDefaultProps>;

export type NextPageWithHomeContent = NextPage<
  HomePageProps & NextPageDefaultProps
>;
