import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

// Enrollment schemas
export const enrollmentSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  gradeId: z.string().uuid('Invalid grade ID'),
})

export type EnrollmentInput = z.infer<typeof enrollmentSchema>

// Lesson completion schema
export const lessonCompletionSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
})

export type LessonCompletionInput = z.infer<typeof lessonCompletionSchema>

// Test submission schema
export const testSubmissionSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
  answers: z.array(z.number().min(0).max(3)),
})

export type TestSubmissionInput = z.infer<typeof testSubmissionSchema>
