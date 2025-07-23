import {
  Course,
  Enrollment,
  Lesson,
  LessonAssessment,
  LessonMaterial,
  Question,
  User,
  UserAssessment,
} from '@prisma/client';

export interface LessonPageProps {
  lesson: Lesson & {
    materials: LessonMaterial[];
    assessment:
      | (LessonAssessment & {
          questions: Question[];
          userAssessments: UserAssessment[];
        })
      | null;
    course: Course & {
      lessons: Array<
        Lesson & {
          assessment: LessonAssessment & {
            userAssessments: UserAssessment[];
          };
        }
      >;
      enrollments: Enrollment[];
      teacher: User;
    };
    isPassed: boolean;
  };
}
