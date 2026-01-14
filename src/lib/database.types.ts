// Database types matching the new LMS schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Array<Json>

// ============================================
// Core Types
// ============================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  class_id: string
  name: string
  description: string | null
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface GradeRequirement {
  id: string
  grade_id: string
  required_grade_id: string | null
  min_score: number
  created_at: string
}

export interface Lesson {
  id: string
  class_id: string
  grade_id: string | null
  title: string
  content: string | null
  video_url: string | null
  order: number
  is_published: boolean
  is_required: boolean
  estimated_minutes: number
  created_at: string
  updated_at: string
}

export type EnrollmentStatus = 'active' | 'completed' | 'dropped'

export interface Enrollment {
  id: string
  user_id: string
  class_id: string
  current_grade_id: string | null
  status: EnrollmentStatus
  enrolled_at: string
  completed_at: string | null
}

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  enrollment_id: string
  status: LessonProgressStatus
  progress_percent: number
  started_at: string | null
  completed_at: string | null
}

export interface TestQuestion {
  id: string
  question: string
  type: 'multiple_choice'
  options: Array<string>
  correct_answer: number
  points: number
}

export interface FinalTest {
  id: string
  class_id: string
  grade_id: string | null
  title: string
  description: string | null
  passing_score: number
  time_limit_minutes: number | null
  max_attempts: number | null
  questions: Array<TestQuestion>
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TestAttempt {
  id: string
  user_id: string
  final_test_id: string
  enrollment_id: string
  answers: Record<string, number>
  score: number | null
  passed: boolean | null
  started_at: string
  submitted_at: string | null
  time_spent_seconds: number | null
}

export type JourneyEventType =
  | 'enrollment_started'
  | 'lesson_started'
  | 'lesson_completed'
  | 'test_started'
  | 'test_completed'
  | 'test_passed'
  | 'test_failed'
  | 'grade_completed'
  | 'class_completed'

export interface JourneyEvent {
  id: string
  user_id: string
  event_type: JourneyEventType
  class_id: string | null
  grade_id: string | null
  lesson_id: string | null
  test_attempt_id: string | null
  metadata: Json
  created_at: string
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface EnrollmentWithClass extends Enrollment {
  classes: Class
}

export interface EnrollmentWithDetails extends Enrollment {
  classes: Class
  grades: Grade | null
}

export interface LessonProgressWithLesson extends LessonProgress {
  lessons: Lesson
}

export interface JourneyEventWithClass extends JourneyEvent {
  classes: { title: string } | null
}
