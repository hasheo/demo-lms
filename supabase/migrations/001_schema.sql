-- ============================================
-- LMS MVP Database Schema
-- Migration 001: Core Tables + Indexes
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CLASSES
-- ============================================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_classes_is_published ON classes(is_published);
CREATE INDEX idx_classes_created_at ON classes(created_at DESC);

-- ============================================
-- 3. GRADES
-- ============================================
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(class_id, "order")
);

-- Indexes
CREATE INDEX idx_grades_class_id ON grades(class_id);
CREATE INDEX idx_grades_order ON grades(class_id, "order");

-- ============================================
-- 4. GRADE_REQUIREMENTS
-- ============================================
CREATE TABLE grade_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  required_grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  min_score INTEGER DEFAULT 0, -- minimum score required on the required grade's test
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(grade_id, required_grade_id)
);

-- Indexes
CREATE INDEX idx_grade_requirements_grade_id ON grade_requirements(grade_id);
CREATE INDEX idx_grade_requirements_required_grade_id ON grade_requirements(required_grade_id);

-- ============================================
-- 5. LESSONS
-- ============================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT, -- markdown content
  video_url TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  is_required BOOLEAN DEFAULT TRUE, -- required for grade completion
  estimated_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lessons_class_id ON lessons(class_id);
CREATE INDEX idx_lessons_grade_id ON lessons(grade_id);
CREATE INDEX idx_lessons_order ON lessons(class_id, grade_id, "order");
CREATE INDEX idx_lessons_is_published ON lessons(is_published);

-- ============================================
-- 6. ENROLLMENTS
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  current_grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, class_id)
);

-- Indexes
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(user_id, status);
CREATE INDEX idx_enrollments_current_grade ON enrollments(current_grade_id);

-- ============================================
-- 7. LESSON_PROGRESS
-- ============================================
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_enrollment_id ON lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(user_id, status);

-- ============================================
-- 8. FINAL_TESTS
-- ============================================
CREATE TABLE final_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 70,
  time_limit_minutes INTEGER, -- NULL means no time limit
  max_attempts INTEGER DEFAULT 3, -- NULL means unlimited
  questions JSONB NOT NULL DEFAULT '[]', -- Array of question objects
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question format in JSONB:
-- [
--   {
--     "id": "q1",
--     "question": "What is React?",
--     "type": "multiple_choice",
--     "options": ["A library", "A framework", "A language", "A database"],
--     "correct_answer": 0,
--     "points": 10
--   }
-- ]

-- Indexes
CREATE INDEX idx_final_tests_class_id ON final_tests(class_id);
CREATE INDEX idx_final_tests_grade_id ON final_tests(grade_id);
CREATE INDEX idx_final_tests_is_published ON final_tests(is_published);

-- ============================================
-- 9. TEST_ATTEMPTS
-- ============================================
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  final_test_id UUID NOT NULL REFERENCES final_tests(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}', -- { "q1": 0, "q2": 2, ... }
  score INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INTEGER
);

-- Indexes
CREATE INDEX idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_final_test_id ON test_attempts(final_test_id);
CREATE INDEX idx_test_attempts_enrollment_id ON test_attempts(enrollment_id);
CREATE INDEX idx_test_attempts_passed ON test_attempts(user_id, passed);

-- ============================================
-- 10. JOURNEY_EVENTS
-- ============================================
CREATE TABLE journey_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'enrollment_started',
    'lesson_started',
    'lesson_completed',
    'test_started',
    'test_completed',
    'test_passed',
    'test_failed',
    'grade_completed',
    'class_completed'
  )),
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journey_events_user_id ON journey_events(user_id);
CREATE INDEX idx_journey_events_created_at ON journey_events(user_id, created_at DESC);
CREATE INDEX idx_journey_events_event_type ON journey_events(event_type);
CREATE INDEX idx_journey_events_class_id ON journey_events(class_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_final_tests_updated_at
  BEFORE UPDATE ON final_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PROFILE CREATION TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN others THEN
    RAISE LOG 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
