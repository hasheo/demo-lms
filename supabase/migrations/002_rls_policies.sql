-- ============================================
-- LMS MVP Database Schema
-- Migration 002: Row Level Security Policies
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CLASSES POLICIES
-- ============================================
-- Anyone can read published classes
CREATE POLICY "Anyone can view published classes"
  ON classes FOR SELECT
  USING (is_published = TRUE);

-- ============================================
-- GRADES POLICIES
-- ============================================
-- Anyone can read published grades of published classes
CREATE POLICY "Anyone can view published grades"
  ON grades FOR SELECT
  USING (
    is_published = TRUE 
    AND EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = grades.class_id 
      AND classes.is_published = TRUE
    )
  );

-- ============================================
-- GRADE_REQUIREMENTS POLICIES
-- ============================================
-- Anyone can read grade requirements for published grades
CREATE POLICY "Anyone can view grade requirements"
  ON grade_requirements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grades 
      WHERE grades.id = grade_requirements.grade_id 
      AND grades.is_published = TRUE
    )
  );

-- ============================================
-- LESSONS POLICIES
-- ============================================
-- Anyone can read published lessons of published classes
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  USING (
    is_published = TRUE 
    AND EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = lessons.class_id 
      AND classes.is_published = TRUE
    )
  );

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================
-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create enrollments for themselves
CREATE POLICY "Users can create their own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = class_id 
      AND classes.is_published = TRUE
    )
  );

-- Users can update their own enrollments
CREATE POLICY "Users can update their own enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own enrollments (drop out)
CREATE POLICY "Users can delete their own enrollments"
  ON enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LESSON_PROGRESS POLICIES
-- ============================================
-- Users can view their own progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own progress records
CREATE POLICY "Users can create their own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = enrollment_id 
      AND enrollments.user_id = auth.uid()
    )
  );

-- Users can update their own progress
CREATE POLICY "Users can update their own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FINAL_TESTS POLICIES
-- ============================================
-- Anyone can read published tests of published classes
CREATE POLICY "Anyone can view published tests"
  ON final_tests FOR SELECT
  USING (
    is_published = TRUE 
    AND EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = final_tests.class_id 
      AND classes.is_published = TRUE
    )
  );

-- ============================================
-- TEST_ATTEMPTS POLICIES
-- ============================================
-- Users can view their own attempts
CREATE POLICY "Users can view their own test attempts"
  ON test_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own attempts
CREATE POLICY "Users can create their own test attempts"
  ON test_attempts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.id = enrollment_id 
      AND enrollments.user_id = auth.uid()
    )
  );

-- Users can update their own attempts (submit answers)
CREATE POLICY "Users can update their own test attempts"
  ON test_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- JOURNEY_EVENTS POLICIES
-- ============================================
-- Users can view their own events
CREATE POLICY "Users can view their own journey events"
  ON journey_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own events
CREATE POLICY "Users can create their own journey events"
  ON journey_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
