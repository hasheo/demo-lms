import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  completeLesson,
  getActiveEnrollments,
  getClassById,
  getClasses,
  getCompletedEnrollments,
  getEnrollmentForClass,
  getEnrollmentsByUserId,
  getFinalTestByGradeId,
  getGradeById,
  getGradeRequirements,
  getGradesByClassId,
  getJourneyEvents,
  getLessonById,
  getLessonProgress,
  getLessonProgressByClassId,
  getLessonProgressByGradeId,
  getLessonsByClassId,
  getLessonsByGradeId,
  getTestAttempts,
  registerClass,
  updateEnrollmentGrade,
  updateLessonProgress,
} from '@/lib/api'

// ============================================
// Query Keys
// ============================================
export const queryKeys = {
  classes: ['classes'] as const,
  class: (id: string) => ['classes', id] as const,
  grades: (classId: string) => ['grades', classId] as const,
  grade: (id: string) => ['grade', id] as const,
  gradeRequirements: (gradeId: string) =>
    ['gradeRequirements', gradeId] as const,
  lessons: (classId: string) => ['lessons', classId] as const,
  lessonsByGrade: (gradeId: string) => ['lessons', 'grade', gradeId] as const,
  lesson: (id: string) => ['lesson', id] as const,
  enrollments: (userId: string) => ['enrollments', userId] as const,
  activeEnrollments: (userId: string) =>
    ['enrollments', userId, 'active'] as const,
  completedEnrollments: (userId: string) =>
    ['enrollments', userId, 'completed'] as const,
  enrollmentForClass: (userId: string, classId: string) =>
    ['enrollment', userId, classId] as const,
  lessonProgress: (userId: string, enrollmentId: string) =>
    ['lessonProgress', userId, enrollmentId] as const,
  lessonProgressByClass: (userId: string, classId: string) =>
    ['lessonProgress', userId, 'class', classId] as const,
  lessonProgressByGrade: (userId: string, gradeId: string) =>
    ['lessonProgress', userId, 'grade', gradeId] as const,
  finalTest: (gradeId: string) => ['finalTest', gradeId] as const,
  testAttempts: (userId: string, testId: string) =>
    ['testAttempts', userId, testId] as const,
  journeyEvents: (userId: string) => ['journeyEvents', userId] as const,
}

// ============================================
// CLASSES
// ============================================
export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes,
    queryFn: getClasses,
  })
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: queryKeys.class(classId),
    queryFn: () => getClassById(classId),
    enabled: !!classId,
  })
}

// ============================================
// GRADES
// ============================================
export function useGrades(classId: string) {
  return useQuery({
    queryKey: queryKeys.grades(classId),
    queryFn: () => getGradesByClassId(classId),
    enabled: !!classId,
  })
}

export function useGrade(gradeId: string) {
  return useQuery({
    queryKey: queryKeys.grade(gradeId),
    queryFn: () => getGradeById(gradeId),
    enabled: !!gradeId,
  })
}

export function useGradeRequirements(gradeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.gradeRequirements(gradeId ?? ''),
    queryFn: () => getGradeRequirements(gradeId!),
    enabled: !!gradeId,
  })
}

// ============================================
// LESSONS
// ============================================
export function useLessons(classId: string) {
  return useQuery({
    queryKey: queryKeys.lessons(classId),
    queryFn: () => getLessonsByClassId(classId),
    enabled: !!classId,
  })
}

export function useLessonsByGrade(gradeId: string) {
  return useQuery({
    queryKey: queryKeys.lessonsByGrade(gradeId),
    queryFn: () => getLessonsByGradeId(gradeId),
    enabled: !!gradeId,
  })
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lesson(lessonId),
    queryFn: () => getLessonById(lessonId),
    enabled: !!lessonId,
  })
}

// ============================================
// ENROLLMENTS
// ============================================
export function useEnrollments(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.enrollments(userId ?? ''),
    queryFn: () => getEnrollmentsByUserId(userId!),
    enabled: !!userId,
  })
}

export function useActiveEnrollments(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activeEnrollments(userId ?? ''),
    queryFn: () => getActiveEnrollments(userId!),
    enabled: !!userId,
  })
}

export function useCompletedEnrollments(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.completedEnrollments(userId ?? ''),
    queryFn: () => getCompletedEnrollments(userId!),
    enabled: !!userId,
  })
}

export function useEnrollmentForClass(
  userId: string | undefined,
  classId: string,
) {
  return useQuery({
    queryKey: queryKeys.enrollmentForClass(userId ?? '', classId),
    queryFn: () => getEnrollmentForClass(userId!, classId),
    enabled: !!userId && !!classId,
  })
}

export function useRegisterClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, classId }: { userId: string; classId: string }) =>
      registerClass(userId, classId),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeEnrollments(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentForClass(
          variables.userId,
          variables.classId,
        ),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeyEvents(variables.userId),
      })
    },
  })
}

export function useUpdateEnrollmentGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      enrollmentId,
      gradeId,
      userId,
    }: {
      enrollmentId: string
      gradeId: string
      userId: string
    }) => updateEnrollmentGrade(enrollmentId, gradeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments(variables.userId),
      })
    },
  })
}

// ============================================
// LESSON PROGRESS
// ============================================
export function useLessonProgress(
  userId: string | undefined,
  enrollmentId: string,
) {
  return useQuery({
    queryKey: queryKeys.lessonProgress(userId ?? '', enrollmentId),
    queryFn: () => getLessonProgress(userId!, enrollmentId),
    enabled: !!userId && !!enrollmentId,
  })
}

export function useLessonProgressByClass(
  userId: string | undefined,
  classId: string,
) {
  return useQuery({
    queryKey: queryKeys.lessonProgressByClass(userId ?? '', classId),
    queryFn: () => getLessonProgressByClassId(userId!, classId),
    enabled: !!userId && !!classId,
  })
}

export function useLessonProgressByGrade(
  userId: string | undefined,
  gradeId: string,
) {
  return useQuery({
    queryKey: queryKeys.lessonProgressByGrade(userId ?? '', gradeId),
    queryFn: () => getLessonProgressByGradeId(userId!, gradeId),
    enabled: !!userId && !!gradeId,
  })
}

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      lessonId,
      enrollmentId,
      status,
      progressPercent,
    }: {
      userId: string
      lessonId: string
      enrollmentId: string
      status: 'not_started' | 'in_progress' | 'completed'
      progressPercent?: number
    }) =>
      updateLessonProgress(
        userId,
        lessonId,
        enrollmentId,
        status,
        progressPercent,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress(
          variables.userId,
          variables.enrollmentId,
        ),
      })
    },
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      lessonId,
      enrollmentId,
      classId,
    }: {
      userId: string
      lessonId: string
      enrollmentId: string
      classId: string
    }) => completeLesson(userId, lessonId, enrollmentId, classId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress(
          variables.userId,
          variables.enrollmentId,
        ),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgressByClass(
          variables.userId,
          variables.classId,
        ),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeyEvents(variables.userId),
      })
    },
  })
}

// ============================================
// FINAL TESTS
// ============================================
export function useFinalTestByGrade(gradeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.finalTest(gradeId ?? ''),
    queryFn: () => getFinalTestByGradeId(gradeId!),
    enabled: !!gradeId,
  })
}

export function useTestAttempts(
  userId: string | undefined,
  testId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.testAttempts(userId ?? '', testId ?? ''),
    queryFn: () => getTestAttempts(userId!, testId!),
    enabled: !!userId && !!testId,
  })
}

// ============================================
// JOURNEY EVENTS
// ============================================
export function useJourneyEvents(userId: string | undefined, limit = 20) {
  return useQuery({
    queryKey: queryKeys.journeyEvents(userId ?? ''),
    queryFn: () => getJourneyEvents(userId!, limit),
    enabled: !!userId,
  })
}
