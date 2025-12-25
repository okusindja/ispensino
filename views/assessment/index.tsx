import { LessonAssessment, Question } from '@prisma/client';
import { Div, Textarea } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { Layout } from '@/components';
import { ArrowUpSVG, SpinnerSVG } from '@/components/svg';
import { fetcherWithCredentials } from '@/constants/fetchers';
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
            Falha ao carregar avaliação
          </Typography>
          <Button variant="primary" size="medium" onClick={() => router.back()}>
            Voltar à aula
          </Button>
        </Div>
      </Layout>
    );
  }

  if (!assessment) {
    return (
      <Layout hasGoBack>
        <Div
          color="text"
          height="50vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SpinnerSVG maxWidth="4rem" maxHeight="4rem" width="100%" />
        </Div>
      </Layout>
    );
  }

  return (
    <Layout hasGoBack>
      <Div width="100%" maxWidth="800px" mx="auto" p={['M', 'L']}>
        <Div
          mb="L"
          p="XL"
          bg="surface"
          borderRadius="M"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          <Div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={['column', 'row']}
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
                px="M"
                py="XS"
                bg="accent"
                display="flex"
                borderRadius="S"
                alignItems="center"
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
              p="M"
              mt="M"
              borderRadius="S"
              bg={isPassed ? 'successLight' : 'errorLight'}
            >
              <Typography
                mb="XS"
                color="text"
                size="extraSmall"
                variant="headline"
              >
                {isPassed ? '🎉 Parabéns! Você passou!' : 'Tente novamente!'}
              </Typography>
              <Typography variant="body" size="small" color="text">
                Your score: <strong>{score.toFixed(1)}%</strong> (Passing score:{' '}
                {assessment.passScore}%)
              </Typography>
              {!isPassed && (
                <Button
                  mt="M"
                  width="100%"
                  size="medium"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Tentar novamente
                </Button>
              )}
            </Div>
          )}
        </Div>

        {!hasSubmitted && (
          <Div
            p="XL"
            bg="surface"
            borderRadius="M"
            boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          >
            {assessment.questions.map((question, index) => (
              <Div
                mb="XL"
                pb="XL"
                key={question.id}
                borderColor="border"
                borderBottom="1px solid"
              >
                <Div display="flex" alignItems="flex-start" mb="M">
                  <Div
                    mr="M"
                    bg="primary"
                    width="28px"
                    color="white"
                    height="28px"
                    display="flex"
                    flexShrink="0"
                    borderRadius="50%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body" size="small">
                      {index + 1}
                    </Typography>
                  </Div>
                  <Div>
                    <Typography
                      mb="XS"
                      color="text"
                      size="extraSmall"
                      variant="headline"
                    >
                      {question.text}
                    </Typography>
                    {question.explanation && (
                      <Typography
                        size="small"
                        variant="body"
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
                        p="S"
                        mb="S"
                        display="flex"
                        key={option.id}
                        borderRadius="S"
                        alignItems="center"
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
                          mr="S"
                          width="20px"
                          height="20px"
                          display="flex"
                          flexShrink="0"
                          borderRadius="50%"
                          border="2px solid"
                          alignItems="center"
                          justifyContent="center"
                          borderColor={
                            responses[question.id]?.answer === option.id
                              ? 'primary'
                              : 'border'
                          }
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
                        p="S"
                        mb="S"
                        display="flex"
                        key={option.id}
                        borderRadius="S"
                        cursor="pointer"
                        alignItems="center"
                        bg={
                          Array.isArray(responses[question.id]?.answer) &&
                          responses[question.id].answer.includes(option.id)
                            ? 'primaryLight'
                            : 'background'
                        }
                        onClick={() =>
                          handleAnswerSelect(question.id, option.id, true)
                        }
                      >
                        <Div
                          mr="S"
                          width="20px"
                          height="20px"
                          display="flex"
                          flexShrink="0"
                          border="2px solid"
                          alignItems="center"
                          justifyContent="center"
                          borderColor={
                            Array.isArray(responses[question.id]?.answer) &&
                            responses[question.id].answer.includes(option.id)
                              ? 'primary'
                              : 'border'
                          }
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
                      p="M"
                      width="100%"
                      borderRadius="S"
                      minHeight="100px"
                      border="1px solid"
                      borderColor="border"
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
                    />
                  )}
                </Div>
              </Div>
            ))}

            <Button
              py="M"
              width="100%"
              size="medium"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Div
                  color="text"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
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
