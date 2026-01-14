import type {
  Class,
  Enrollment,
  EnrollmentWithClass,
  FinalTest,
  Grade,
  GradeRequirement,
  JourneyEvent,
  JourneyEventType,
  JourneyEventWithClass,
  Lesson,
  LessonProgress,
  TestAttempt,
} from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

// ============================================
// CLASSES
// ============================================

export async function getClasses(): Promise<Array<Class>> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Array<Class>
}

export async function getClassById(classId: string): Promise<Class> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()

  if (error) throw error
  return data as Class
}

// ============================================
// GRADES
// ============================================

export async function getGradesByClassId(
  classId: string,
): Promise<Array<Grade>> {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('class_id', classId)
    .eq('is_published', true)
    .order('order', { ascending: true })

  if (error) throw error
  return data as Array<Grade>
}

export async function getGradeById(gradeId: string): Promise<Grade> {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('id', gradeId)
    .single()

  if (error) throw error
  return data as Grade
}

export async function getGradeRequirements(
  gradeId: string,
): Promise<Array<GradeRequirement>> {
  const { data, error } = await supabase
    .from('grade_requirements')
    .select('*')
    .eq('grade_id', gradeId)

  if (error) throw error
  return data as Array<GradeRequirement>
}

// ============================================
// LESSONS
// ============================================

export async function getLessonsByClassId(
  classId: string,
): Promise<Array<Lesson>> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('class_id', classId)
    .eq('is_published', true)
    .order('order', { ascending: true })

  if (error) throw error
  return data as Array<Lesson>
}

export async function getLessonsByGradeId(
  gradeId: string,
): Promise<Array<Lesson>> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('grade_id', gradeId)
    .eq('is_published', true)
    .order('order', { ascending: true })

  if (error) throw error
  return data as Array<Lesson>
}

export async function getLessonById(lessonId: string): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error) throw error
  return data as Lesson
}

// ============================================
// ENROLLMENTS
// ============================================

export async function getEnrollmentsByUserId(
  userId: string,
): Promise<Array<EnrollmentWithClass>> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
      *,
      classes (*)
    `,
    )
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  if (error) throw error
  return data as Array<EnrollmentWithClass>
}

export async function getEnrollmentForClass(
  userId: string,
  classId: string,
): Promise<Enrollment | null> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('class_id', classId)
    .maybeSingle()

  if (error) throw error
  return data as Enrollment | null
}

export async function getActiveEnrollments(
  userId: string,
): Promise<Array<EnrollmentWithClass>> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
      *,
      classes (*)
    `,
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false })

  if (error) throw error
  return data as Array<EnrollmentWithClass>
}

export async function getCompletedEnrollments(
  userId: string,
): Promise<Array<EnrollmentWithClass>> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
      *,
      classes (*)
    `,
    )
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (error) throw error
  return data as Array<EnrollmentWithClass>
}

export async function registerClass(
  userId: string,
  classId: string,
): Promise<Enrollment> {
  // Get the first grade for the class
  const { data: grades, error: gradesError } = await supabase
    .from('grades')
    .select('id')
    .eq('class_id', classId)
    .eq('is_published', true)
    .order('order', { ascending: true })
    .limit(1)

  if (gradesError) throw gradesError

  const firstGradeId = grades[0]?.id ?? null

  // Create enrollment
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      class_id: classId,
      current_grade_id: firstGradeId,
      status: 'active',
    })
    .select()
    .single()

  if (enrollmentError) throw enrollmentError

  // Create journey event
  await createJourneyEvent(userId, 'enrollment_started', {
    class_id: classId,
  })

  return enrollment as Enrollment
}

export async function updateEnrollmentGrade(
  enrollmentId: string,
  gradeId: string,
): Promise<Enrollment> {
  const { data, error } = await supabase
    .from('enrollments')
    .update({ current_grade_id: gradeId })
    .eq('id', enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data as Enrollment
}

// ============================================
// LESSON PROGRESS
// ============================================

export async function getLessonProgress(
  userId: string,
  enrollmentId: string,
): Promise<Array<LessonProgress>> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('enrollment_id', enrollmentId)

  if (error) throw error
  return data as Array<LessonProgress>
}

export async function getLessonProgressByClassId(
  userId: string,
  classId: string,
): Promise<Array<LessonProgress>> {
  // First get the enrollment for this class
  const enrollment = await getEnrollmentForClass(userId, classId)
  if (!enrollment) return []

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('enrollment_id', enrollment.id)

  if (error) throw error
  return data as Array<LessonProgress>
}

export async function getLessonProgressByGradeId(
  userId: string,
  gradeId: string,
): Promise<Array<LessonProgress>> {
  // Get lessons for this grade, then get progress for those lessons
  const lessons = await getLessonsByGradeId(gradeId)
  if (!lessons.length) return []

  const lessonIds = lessons.map((l) => l.id)

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  if (error) throw error
  return data as Array<LessonProgress>
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  enrollmentId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercent?: number,
): Promise<LessonProgress> {
  // Check if progress record exists
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  const now = new Date().toISOString()
  const updateData: Record<string, unknown> = {
    status,
    progress_percent: progressPercent ?? (status === 'completed' ? 100 : 0),
  }

  if (status === 'in_progress' && !existing) {
    updateData.started_at = now
  }
  if (status === 'completed') {
    updateData.completed_at = now
  }

  if (existing) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as LessonProgress
  } else {
    const { data, error } = await supabase
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        started_at: status !== 'not_started' ? now : null,
        ...updateData,
      })
      .select()
      .single()

    if (error) throw error
    return data as LessonProgress
  }
}

export async function completeLesson(
  userId: string,
  lessonId: string,
  enrollmentId: string,
  classId: string,
): Promise<LessonProgress> {
  const progress = await updateLessonProgress(
    userId,
    lessonId,
    enrollmentId,
    'completed',
    100,
  )

  // Create journey event
  await createJourneyEvent(userId, 'lesson_completed', {
    class_id: classId,
    lesson_id: lessonId,
  })

  return progress
}

// ============================================
// FINAL TESTS
// ============================================

export async function getFinalTestByGradeId(
  gradeId: string,
): Promise<FinalTest | null> {
  const { data, error } = await supabase
    .from('final_tests')
    .select('*')
    .eq('grade_id', gradeId)
    .eq('is_published', true)
    .maybeSingle()

  if (error) throw error
  return data as FinalTest | null
}

export async function getFinalTestByClassId(
  classId: string,
): Promise<Array<FinalTest>> {
  const { data, error } = await supabase
    .from('final_tests')
    .select('*')
    .eq('class_id', classId)
    .eq('is_published', true)

  if (error) throw error
  return data as Array<FinalTest>
}

// ============================================
// TEST ATTEMPTS
// ============================================

export async function getTestAttempts(
  userId: string,
  finalTestId: string,
): Promise<Array<TestAttempt>> {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('final_test_id', finalTestId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data as Array<TestAttempt>
}

export async function createTestAttempt(
  userId: string,
  finalTestId: string,
  enrollmentId: string,
): Promise<TestAttempt> {
  const { data, error } = await supabase
    .from('test_attempts')
    .insert({
      user_id: userId,
      final_test_id: finalTestId,
      enrollment_id: enrollmentId,
      answers: {},
    })
    .select()
    .single()

  if (error) throw error
  return data as TestAttempt
}

export async function submitTestAttempt(
  attemptId: string,
  answers: Record<string, number>,
  score: number,
  passed: boolean,
  timeSpentSeconds: number,
): Promise<TestAttempt> {
  const { data, error } = await supabase
    .from('test_attempts')
    .update({
      answers,
      score,
      passed,
      time_spent_seconds: timeSpentSeconds,
      submitted_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .select()
    .single()

  if (error) throw error
  return data as TestAttempt
}

// ============================================
// JOURNEY EVENTS
// ============================================

export async function createJourneyEvent(
  userId: string,
  eventType: JourneyEventType,
  options: {
    class_id?: string
    grade_id?: string
    lesson_id?: string
    test_attempt_id?: string
    metadata?: Record<string, unknown>
  } = {},
): Promise<JourneyEvent> {
  const { data, error } = await supabase
    .from('journey_events')
    .insert({
      user_id: userId,
      event_type: eventType,
      class_id: options.class_id ?? null,
      grade_id: options.grade_id ?? null,
      lesson_id: options.lesson_id ?? null,
      test_attempt_id: options.test_attempt_id ?? null,
      metadata: options.metadata ?? {},
    })
    .select()
    .single()

  if (error) throw error
  return data as JourneyEvent
}

export async function getJourneyEvents(
  userId: string,
  limit = 20,
): Promise<Array<JourneyEventWithClass>> {
  const { data, error } = await supabase
    .from('journey_events')
    .select(
      `
      *,
      classes:class_id (title)
    `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Array<JourneyEventWithClass>
}
