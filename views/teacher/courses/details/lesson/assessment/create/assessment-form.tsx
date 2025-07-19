/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { zodResolver } from '@hookform/resolvers/zod';
import React, { FC, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import z from 'zod';

import { AssessmentSchema, QuestionTypeSchema } from '@/zod';

type FormData = z.infer<typeof AssessmentSchema>;

interface AssessmentFormProps {
  lessonId: string;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  lessonId,
  onSubmit,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormData | null>(null);

  const defaultValues: FormData = initialData || {
    title: '',
    description: '',
    lessonId,
    passScore: 75,
    questions: [
      {
        id: v4(),
        text: '',
        type: 'SINGLE_CHOICE' as const,
        explanation: '',
        options: [
          { id: v4(), text: '', isCorrect: false },
          { id: v4(), text: '', isCorrect: false },
        ],
      },
    ],
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AssessmentSchema) as unknown as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const addQuestion = (
    type: z.infer<typeof QuestionTypeSchema> = 'SINGLE_CHOICE'
  ) => {
    const newQuestion = {
      id: v4(),
      text: '',
      type,
      explanation: '',
      options:
        type === 'TRUE_FALSE'
          ? [
              { id: v4(), text: 'True', isCorrect: false },
              { id: v4(), text: 'False', isCorrect: false },
            ]
          : [
              { id: v4(), text: '', isCorrect: false },
              { id: v4(), text: '', isCorrect: false },
            ],
    };

    appendQuestion(newQuestion);
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      setFormValues(data);
      await onSubmit(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save assessment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle option selection
  const handleOptionSelect = (qIndex: number, oIndex: number) => {
    const questionType = getValues(`questions.${qIndex}.type`);
    const options = [...(getValues(`questions.${qIndex}.options`) || [])];

    if (questionType === 'SINGLE_CHOICE' || questionType === 'TRUE_FALSE') {
      // Reset all options to false
      options.forEach((_, idx) => {
        setValue(
          `questions.${qIndex}.options.${idx}.isCorrect`,
          idx === oIndex
        );
      });
    } else {
      // Toggle the current option
      const currentValue = options[oIndex].isCorrect;
      setValue(
        `questions.${qIndex}.options.${oIndex}.isCorrect`,
        !currentValue
      );
    }
  };

  // Check if form has any errors
  const hasErrors = () => {
    return Object.keys(errors).length > 0;
  };

  // Check if required fields are filled
  const isFormComplete = () => {
    const values = getValues();

    // Check title
    if (!values.title || values.title.trim().length < 3) return false;

    // Check questions
    if (!values.questions || values.questions.length === 0) return false;

    for (const question of values.questions) {
      // Check question text
      if (!question.text || question.text.trim().length < 3) return false;

      // Check options for choice questions
      if (
        question.type === 'SINGLE_CHOICE' ||
        question.type === 'MULTIPLE_CHOICE' ||
        question.type === 'TRUE_FALSE'
      ) {
        // Check if at least one option is correct
        const hasCorrectOption = question.options?.some((opt) => opt.isCorrect);
        if (!hasCorrectOption) return false;

        // Check option texts
        for (const option of question.options || []) {
          if (!option.text || option.text.trim().length === 0) return false;
        }
      }
    }

    return true;
  };

  const canSubmit = isFormComplete() && !hasErrors();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assessment Title *
        </label>
        <input
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Lesson Assessment"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Describe the assessment..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passing Score (%) *
          </label>
          <input
            type="number"
            {...register('passScore', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.passScore ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min={0}
            max={100}
          />
          {errors.passScore && (
            <p className="mt-1 text-sm text-red-600">
              {errors.passScore.message}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => addQuestion('SINGLE_CHOICE')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        </div>

        {questionFields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No questions added yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add your first question to begin creating the assessment
            </p>
          </div>
        )}

        {questionFields.map((question, qIndex) => (
          <div
            key={question.id}
            className="bg-white border rounded-lg shadow-sm p-4 mb-6"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-800">
                Question #{qIndex + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text *
              </label>
              <input
                {...register(`questions.${qIndex}.text` as const)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.questions?.[qIndex]?.text
                    ? 'border-red-500'
                    : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your question"
              />
              {errors.questions?.[qIndex]?.text && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.questions[qIndex]?.text?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <Controller
                  name={`questions.${qIndex}.type` as const}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SINGLE_CHOICE">Single Choice</option>
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True/False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                      <option value="ESSAY">Essay</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation (Optional)
                </label>
                <input
                  {...register(`questions.${qIndex}.explanation` as const)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explanation for correct answer"
                />
              </div>
            </div>

            {(watch(`questions.${qIndex}.type`) === 'SINGLE_CHOICE' ||
              watch(`questions.${qIndex}.type`) === 'MULTIPLE_CHOICE' ||
              watch(`questions.${qIndex}.type`) === 'TRUE_FALSE') && (
              <QuestionOptions
                control={control}
                register={register}
                errors={errors}
                qIndex={qIndex}
                watch={watch}
                onOptionSelect={handleOptionSelect}
              />
            )}

            {errors.questions?.[qIndex]?.options && (
              <p className="mt-1 text-sm text-red-600">
                {errors.questions[qIndex]?.options?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          className={`w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !canSubmit ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? 'Saving Assessment...' : 'Save Assessment'}
        </button>

        {!canSubmit && !isSubmitting && (
          <div className="mt-3 p-3 bg-yellow-50 text-yellow-700 rounded-md">
            <p className="text-sm">
              {!isFormComplete()
                ? 'Please complete all required fields correctly'
                : 'Ok'}
            </p>
          </div>
        )}
      </div>

      {/* Debug output - remove in production */}
      {process.env.NODE_ENV === 'development' && formValues && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h4 className="font-medium mb-2">Form Data</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
};

interface QuestionOptionsProps {
  control: any;
  register: any;
  errors: any;
  qIndex: number;
  watch: any;
  onOptionSelect: (qIndex: number, oIndex: number) => void;
}

const QuestionOptions: FC<QuestionOptionsProps> = ({
  control,
  register,
  errors,
  qIndex,
  watch,
  onOptionSelect,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  const questionType = watch(`questions.${qIndex}.type`);
  const options = watch(`questions.${qIndex}.options`);

  const addOption = () => {
    append({ id: v4(), text: '', isCorrect: false });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-sm font-medium text-gray-700">Options</h5>
        {questionType !== 'TRUE_FALSE' && (
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Add Option
          </button>
        )}
      </div>

      {fields.map((option, oIndex) => (
        <div key={option.id} className="flex items-start mb-2">
          <div className="flex items-center h-5 mt-2.5 mr-2">
            <input
              type={questionType === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
              checked={options?.[oIndex]?.isCorrect || false}
              onChange={() => onOptionSelect(qIndex, oIndex)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
          </div>
          <div className="flex-1">
            <input
              {...register(
                `questions.${qIndex}.options.${oIndex}.text` as const
              )}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.questions?.[qIndex]?.options?.[oIndex]?.text
                  ? 'border-red-500'
                  : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Option text"
            />
          </div>
          {questionType !== 'TRUE_FALSE' && fields.length > 2 && (
            <button
              type="button"
              onClick={() => remove(oIndex)}
              className="ml-2 mt-2.5 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssessmentForm;
