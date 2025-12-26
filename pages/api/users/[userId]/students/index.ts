import type { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

import { prisma } from '@/lib';
import { handleApiError, validateMethod } from '@/lib/api-utils';
import { adminAuth } from '@/lib/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  validateMethod(req, res, ['GET']);

  const cookies = nookies.get({ req });
  const sessionCookie = cookies.session || '';

  if (!sessionCookie) {
    return res
      .status(401)
      .json({ error: 'Unauthorized: Session cookie missing' });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    // Get teacherId from query params or use logged-in user
    const { userId } = req.query;
    const targetTeacherId = Array.isArray(userId) ? userId[0] : userId;

    // Verify the requesting user has permission (either admin or the teacher themselves)
    const requestingUser = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!requestingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (
      requestingUser.role !== 'ADMIN' &&
      requestingUser.id !== targetTeacherId
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You can only view your own students' });
    }

    const teacherWithStudents = await prisma.user.findUnique({
      where: {
        id: targetTeacherId,
        role: 'TEACHER',
      },
      include: {
        teachingCourses: {
          include: {
            enrollments: {
              include: {
                user: {
                  include: {
                    assessments: {
                      include: {
                        assessment: {
                          include: {
                            lesson: {
                              select: {
                                title: true,
                                course: {
                                  select: {
                                    title: true,
                                    teacherId: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    enrollments: {
                      where: {
                        course: {
                          teacherId: targetTeacherId,
                        },
                      },
                      include: {
                        course: {
                          select: {
                            id: true,
                            title: true,
                            level: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!teacherWithStudents) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const allEnrollments = teacherWithStudents.teachingCourses.flatMap(
      (course) => course.enrollments
    );

    // Group by student to avoid duplicates
    const studentsMap = new Map();

    allEnrollments.forEach((enrollment) => {
      const student = enrollment.user;

      if (!studentsMap.has(student.id)) {
        // Calculate average assessment score for this teacher's courses
        const teacherAssessments = student.assessments.filter(
          (assessment) =>
            assessment.assessment.lesson.course.teacherId === targetTeacherId
        );

        const avgAssessmentScore =
          teacherAssessments.length > 0
            ? teacherAssessments.reduce(
                (sum, assessment) => sum + assessment.score,
                0
              ) / teacherAssessments.length
            : 0;

        studentsMap.set(student.id, {
          id: student.id,
          name: student.name,
          email: student.email,
          username: student.username,
          image: student.image,
          avgAssessmentScore: parseFloat(avgAssessmentScore.toFixed(2)),
          totalCoursesWithTeacher: student.enrollments.length,
          enrollments: student.enrollments.map((enroll) => ({
            id: enroll.id,
            enrolledAt: enroll.enrolledAt,
            completedAt: enroll.completedAt,
            progress: enroll.progress,
            assessmentScoreAverage: enroll.assessmentScoreAverage,
            course: enroll.course,
          })),
          assessments: teacherAssessments.map((assessment) => ({
            id: assessment.id,
            score: assessment.score,
            isPassed: assessment.isPassed,
            completedAt: assessment.completedAt,
            lessonTitle: assessment.assessment.lesson.title,
            courseTitle: assessment.assessment.lesson.course.title,
          })),
        });
      }
    });

    const students = Array.from(studentsMap.values());

    // Sort students by average assessment score (highest first)
    students.sort((a, b) => b.avgAssessmentScore - a.avgAssessmentScore);

    res.status(200).json({
      teacher: {
        id: teacherWithStudents.id,
        name: teacherWithStudents.name,
        email: teacherWithStudents.email,
      },
      students,
      totalStudents: students.length,
      totalCourses: teacherWithStudents.teachingCourses.length,
    });
  } catch (error) {
    handleApiError(res, error, 500);
  }
}
