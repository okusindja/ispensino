import { LessonAssessment, Question } from '@prisma/client';
import { Div, Textarea } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { Layout } from '@/components';
import { ArrowUpSVG, SpinnerSVG } from '@/components/svg';
import { fetcherWithCredentials } from '@/constants/swr';
import { useAuth } from '@/contexts';
import { Button } from '@/elements';
import { Typography } from '@/elements/typography';

interface QuestionWithOptions extends Question {
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface AssessmentWithQuestions extends LessonAssessment {
  questions: QuestionWithOptions[];
}

interface UserResponse {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
}

interface AssessmentProps {
  lessonId: string;
  courseId: string;
}

const Assessment: FC<AssessmentProps> = ({ lessonId, courseId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [responses, setResponses] = useState<Record<string, UserResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);

  // Fetch assessment data
  const { data: assessment, error } = useSWR<AssessmentWithQuestions>(
    lessonId ? `/api/courses/${courseId}/lessons/${lessonId}/assessment` : null,
    fetcherWithCredentials
  );

  // Initialize responses and timer
  useEffect(() => {
    if (!assessment) return;

    // Initialize responses
    const initialResponses: Record<string, UserResponse> = {};
    assessment.questions.forEach((question) => {
      initialResponses[question.id] = {
        questionId: question.id,
        answer: question.type === 'MULTIPLE_CHOICE' ? [] : '',
      };
    });
    setResponses(initialResponses);

    setTimeRemaining(assessment.questions.length * 30); // 30 seconds per question
  }, [assessment]);

  // Handle tab/window visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasSubmitted) {
        handleUnansweredQuestions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasSubmitted]);

  // Handle browser/tab closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasSubmitted) {
        handleUnansweredQuestions();
        e.preventDefault();
        e.returnValue =
          'Your progress will be submitted if you leave this page.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasSubmitted, responses]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !hasSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining, hasSubmitted]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Mark unanswered questions as wrong
  const handleUnansweredQuestions = useCallback(() => {
    if (!assessment || hasSubmitted) return;

    const updatedResponses = { ...responses };
    let hasUnanswered = false;

    assessment.questions.forEach((question) => {
      const response = updatedResponses[question.id];

      // Check if question is unanswered
      const isUnanswered =
        (question.type === 'SINGLE_CHOICE' && !response.answer) ||
        (question.type === 'MULTIPLE_CHOICE' &&
          Array.isArray(response.answer) &&
          response.answer.length === 0);

      if (isUnanswered) {
        updatedResponses[question.id] = {
          ...response,
          isCorrect: false,
        };
        hasUnanswered = true;
      }
    });

    if (hasUnanswered) {
      setResponses(updatedResponses);
    }
  }, [assessment, responses, hasSubmitted]);

  // Handle answer selection
  const handleAnswerSelect = (
    questionId: string,
    optionId: string,
    isMultiple: boolean
  ) => {
    if (hasSubmitted) return;

    setResponses((prev) => {
      const currentResponse = prev[questionId];

      if (isMultiple) {
        const currentAnswers = Array.isArray(currentResponse.answer)
          ? currentResponse.answer
          : [];

        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];

        return {
          ...prev,
          [questionId]: {
            ...currentResponse,
            answer: newAnswers,
          },
        };
      } else {
        return {
          ...prev,
          [questionId]: {
            ...currentResponse,
            answer: optionId,
          },
        };
      }
    });
  };

  // Submit assessment
  const handleSubmit = async () => {
    if (!assessment || !user || hasSubmitted || submittedRef.current) return;

    submittedRef.current = true;
    setIsSubmitting(true);

    // stop the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    try {
      // Final check for unanswered questions
      handleUnansweredQuestions();

      // Prepare submission data
      const submissionData = {
        responses: Object.values(responses).map((response) => ({
          questionId: response.questionId,
          optionId:
            typeof response.answer === 'string' ? response.answer : undefined,
          optionIds: Array.isArray(response.answer)
            ? response.answer
            : undefined,
        })),
      };

      // Submit to API
      const response = await fetcherWithCredentials(
        `/api/courses/${courseId}/lessons/${lessonId}/assessment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
          keepalive: true,
        }
      );

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      setScore(result.score);
      setIsPassed(result.isPassed);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Layout hasGoBack>
        <Div p="XL" bg="surface" borderRadius="M" textAlign="center">
          <Typography variant="headline" size="small" color="error" mb="M">
            Failed to load assessment
          </Typography>
          <Button variant="primary" size="medium" onClick={() => router.back()}>
            Back to Lesson
          </Button>
        </Div>
      </Layout>
    );
  }

  if (!assessment) {
    return (
      <Layout hasGoBack>
        <Div
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Typography variant="body" size="medium" color="text">
            Loading assessment...
          </Typography>
        </Div>
      </Layout>
    );
  }

  return (
    <Layout hasGoBack>
      <Div width="100%" maxWidth="800px" mx="auto" p={['M', 'L']}>
        <Div
          bg="surface"
          borderRadius="M"
          p="XL"
          mb="L"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          <Div
            display="flex"
            flexDirection={['column', 'row']}
            alignItems="center"
            justifyContent="space-between"
          >
            <Div mb={['M', '0']}>
              <Typography variant="headline" size="small" color="text" mb="XS">
                {assessment.title}
              </Typography>
              <Typography variant="body" size="small" color="textSecondary">
                {assessment.description}
              </Typography>
            </Div>

            {timeRemaining !== null && (
              <Div
                display="flex"
                alignItems="center"
                bg="accent"
                px="M"
                py="XS"
                borderRadius="S"
              >
                <ArrowUpSVG width="100%" maxWidth="16px" maxHeight="16px" />
                <Typography variant="body" size="small" color="white" ml="XS">
                  {formatTime(timeRemaining)}
                </Typography>
              </Div>
            )}
          </Div>

          {score !== null && (
            <Div
              mt="M"
              p="M"
              borderRadius="S"
              bg={isPassed ? 'successLight' : 'errorLight'}
            >
              <Typography
                variant="headline"
                size="extraSmall"
                color="text"
                mb="XS"
              >
                {isPassed ? '🎉 Congratulations! You passed!' : 'Try Again!'}
              </Typography>
              <Typography variant="body" size="small" color="text">
                Your score: <strong>{score.toFixed(1)}%</strong> (Passing score:{' '}
                {assessment.passScore}%)
              </Typography>
              {!isPassed && (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  mt="M"
                  size="medium"
                  width="100%"
                >
                  Retry Assessment
                </Button>
              )}
            </Div>
          )}
        </Div>

        {!hasSubmitted && (
          <Div
            bg="surface"
            borderRadius="M"
            p="XL"
            boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          >
            {assessment.questions.map((question, index) => (
              <Div
                key={question.id}
                mb="XL"
                pb="XL"
                borderBottom="1px solid"
                borderColor="border"
              >
                <Div display="flex" alignItems="flex-start" mb="M">
                  <Div
                    bg="primary"
                    color="white"
                    width="28px"
                    height="28px"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr="M"
                    flexShrink="0"
                  >
                    <Typography variant="body" size="small">
                      {index + 1}
                    </Typography>
                  </Div>
                  <Div>
                    <Typography
                      variant="headline"
                      size="extraSmall"
                      color="text"
                      mb="XS"
                    >
                      {question.text}
                    </Typography>
                    {question.explanation && (
                      <Typography
                        variant="body"
                        size="small"
                        color="textSecondary"
                      >
                        {question.explanation}
                      </Typography>
                    )}
                  </Div>
                </Div>

                <Div ml="XL">
                  {question.type === 'SINGLE_CHOICE' ||
                  question.type === 'TRUE_FALSE' ? (
                    question.options.map((option) => (
                      <Div
                        key={option.id}
                        display="flex"
                        alignItems="center"
                        mb="S"
                        p="S"
                        borderRadius="S"
                        bg={
                          responses[question.id]?.answer === option.id
                            ? 'primaryLight'
                            : 'background'
                        }
                        onClick={() =>
                          handleAnswerSelect(question.id, option.id, false)
                        }
                        cursor="pointer"
                      >
                        <Div
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          border="2px solid"
                          borderColor={
                            responses[question.id]?.answer === option.id
                              ? 'primary'
                              : 'border'
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mr="S"
                          flexShrink="0"
                        >
                          {responses[question.id]?.answer === option.id && (
                            <Div
                              width="10px"
                              height="10px"
                              bg="primary"
                              borderRadius="50%"
                            />
                          )}
                        </Div>
                        <Typography variant="body" size="small" color="text">
                          {option.text}
                        </Typography>
                      </Div>
                    ))
                  ) : question.type === 'MULTIPLE_CHOICE' ? (
                    question.options.map((option) => (
                      <Div
                        key={option.id}
                        display="flex"
                        alignItems="center"
                        mb="S"
                        p="S"
                        borderRadius="S"
                        bg={
                          Array.isArray(responses[question.id]?.answer) &&
                          responses[question.id].answer.includes(option.id)
                            ? 'primaryLight'
                            : 'background'
                        }
                        onClick={() =>
                          handleAnswerSelect(question.id, option.id, true)
                        }
                        cursor="pointer"
                      >
                        <Div
                          width="20px"
                          height="20px"
                          border="2px solid"
                          borderColor={
                            Array.isArray(responses[question.id]?.answer) &&
                            responses[question.id].answer.includes(option.id)
                              ? 'primary'
                              : 'border'
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mr="S"
                          flexShrink="0"
                        >
                          {Array.isArray(responses[question.id]?.answer) &&
                            responses[question.id].answer.includes(
                              option.id
                            ) && (
                              <Div width="12px" height="12px" bg="primary" />
                            )}
                        </Div>
                        <Typography variant="body" size="small" color="text">
                          {option.text}
                        </Typography>
                      </Div>
                    ))
                  ) : (
                    <Textarea
                      value={
                        typeof responses[question.id]?.answer === 'string'
                          ? responses[question.id].answer
                          : ''
                      }
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setResponses((prev) => ({
                          ...prev,
                          [question.id]: {
                            ...prev[question.id],
                            answer: e.target.value,
                          },
                        }));
                      }}
                      width="100%"
                      minHeight="100px"
                      p="M"
                      border="1px solid"
                      borderColor="border"
                      borderRadius="S"
                    />
                  )}
                </Div>
              </Div>
            ))}

            <Button
              onClick={handleSubmit}
              variant="primary"
              width="100%"
              size="medium"
              disabled={isSubmitting}
              py="M"
            >
              {isSubmitting ? (
                <Div
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="text"
                >
                  <SpinnerSVG width="100%" maxWidth="2rem" maxHeight="2rem" />
                </Div>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </Div>
        )}
      </Div>
    </Layout>
  );
};

export default Assessment;
