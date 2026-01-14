-- ============================================
-- LMS MVP Database Schema
-- Migration 003: Seed Data
-- 2 Demo Classes, 2-3 Grades each, ~5 Lessons, 1 Final Test
-- ============================================

-- Use DO block to generate UUIDs and reference them
DO $$
DECLARE
  -- Class IDs
  class1_id UUID := uuid_generate_v4();
  class2_id UUID := uuid_generate_v4();
  
  -- Grade IDs for Class 1
  grade1_beginner_id UUID := uuid_generate_v4();
  grade1_intermediate_id UUID := uuid_generate_v4();
  grade1_advanced_id UUID := uuid_generate_v4();
  
  -- Grade IDs for Class 2
  grade2_getting_started_id UUID := uuid_generate_v4();
  grade2_intermediate_id UUID := uuid_generate_v4();
  
  -- Lesson IDs
  lesson1_1_id UUID := uuid_generate_v4();
  lesson1_2_id UUID := uuid_generate_v4();
  lesson1_3_id UUID := uuid_generate_v4();
  lesson2_1_id UUID := uuid_generate_v4();
  lesson2_2_id UUID := uuid_generate_v4();
  
  -- Test IDs
  test1_id UUID := uuid_generate_v4();
  test2_id UUID := uuid_generate_v4();

BEGIN
-- ============================================
-- CLASS 1: Web Development Fundamentals
-- ============================================
INSERT INTO classes (id, title, description, thumbnail_url, is_published) VALUES
(
  class1_id,
  'Web Development Fundamentals',
  'Learn the core technologies of the web: HTML, CSS, and JavaScript. This comprehensive course takes you from beginner to confident web developer.',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  TRUE
);

-- Grades for Class 1
INSERT INTO grades (id, class_id, name, description, "order", is_published) VALUES
(
  grade1_beginner_id,
  class1_id,
  'Beginner',
  'Start your web development journey with HTML and basic CSS.',
  1,
  TRUE
),
(
  grade1_intermediate_id,
  class1_id,
  'Intermediate',
  'Level up with advanced CSS, Flexbox, Grid, and responsive design.',
  2,
  TRUE
),
(
  grade1_advanced_id,
  class1_id,
  'Advanced',
  'Master JavaScript fundamentals and DOM manipulation.',
  3,
  TRUE
);

-- Grade requirements for Class 1
INSERT INTO grade_requirements (grade_id, required_grade_id, min_score) VALUES
(
  grade1_intermediate_id,
  grade1_beginner_id,
  70
),
(
  grade1_advanced_id,
  grade1_intermediate_id,
  70
);

-- Lessons for Class 1
INSERT INTO lessons (id, class_id, grade_id, title, content, "order", is_published, is_required, estimated_minutes) VALUES
(
  lesson1_1_id,
  class1_id,
  grade1_beginner_id,
  'Introduction to HTML',
  '# Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## What You''ll Learn
- HTML document structure
- Common HTML elements
- Semantic markup

## HTML Document Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
```

## Key Takeaways
- Every HTML document starts with `<!DOCTYPE html>`
- The `<html>` element is the root element
- The `<head>` contains metadata
- The `<body>` contains visible content',
  1,
  TRUE,
  TRUE,
  15
),
(
  lesson1_2_id,
  class1_id,
  grade1_beginner_id,
  'Basic CSS Styling',
  '# Basic CSS Styling

CSS (Cascading Style Sheets) is used to style and layout web pages.

## Connecting CSS to HTML

There are three ways to add CSS:
1. Inline styles
2. Internal stylesheet
3. External stylesheet (recommended)

## Example

```css
/* styles.css */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
}

.highlight {
  background-color: yellow;
  padding: 10px;
}
```

## CSS Selectors
- Element selector: `p { }`
- Class selector: `.classname { }`
- ID selector: `#idname { }`',
  2,
  TRUE,
  TRUE,
  20
),
(
  lesson1_3_id,
  class1_id,
  grade1_intermediate_id,
  'Flexbox Layout',
  '# Flexbox Layout

Flexbox is a powerful layout system for creating flexible, responsive layouts.

## Basic Flexbox Container

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
```

## Key Properties

### Container Properties
- `flex-direction`: row, column, row-reverse, column-reverse
- `justify-content`: flex-start, center, flex-end, space-between, space-around
- `align-items`: flex-start, center, flex-end, stretch

### Item Properties
- `flex-grow`: How much an item should grow
- `flex-shrink`: How much an item should shrink
- `flex-basis`: The initial size of an item',
  1,
  TRUE,
  TRUE,
  25
);

-- ============================================
-- CLASS 2: React Essentials
-- ============================================
INSERT INTO classes (id, title, description, thumbnail_url, is_published) VALUES
(
  class2_id,
  'React Essentials',
  'Master React, the popular JavaScript library for building user interfaces. Learn components, hooks, state management, and best practices.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  TRUE
);

-- Grades for Class 2
INSERT INTO grades (id, class_id, name, description, "order", is_published) VALUES
(
  grade2_getting_started_id,
  class2_id,
  'Getting Started',
  'Learn React basics: components, JSX, and props.',
  1,
  TRUE
),
(
  grade2_intermediate_id,
  class2_id,
  'Intermediate React',
  'Master hooks, state management, and effects.',
  2,
  TRUE
);

-- Grade requirements for Class 2
INSERT INTO grade_requirements (grade_id, required_grade_id, min_score) VALUES
(
  grade2_intermediate_id,
  grade2_getting_started_id,
  70
);

-- Lessons for Class 2
INSERT INTO lessons (id, class_id, grade_id, title, content, "order", is_published, is_required, estimated_minutes) VALUES
(
  lesson2_1_id,
  class2_id,
  grade2_getting_started_id,
  'Your First React Component',
  '# Your First React Component

Components are the building blocks of React applications.

## Function Components

```jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
```

## Using JSX

JSX is a syntax extension that looks like HTML:

```jsx
function Card() {
  return (
    <div className="card">
      <h2>Card Title</h2>
      <p>Card content goes here.</p>
    </div>
  );
}
```

## Exporting Components

```jsx
export default function App() {
  return (
    <div>
      <Welcome />
      <Card />
    </div>
  );
}
```',
  1,
  TRUE,
  TRUE,
  20
),
(
  lesson2_2_id,
  class2_id,
  grade2_getting_started_id,
  'Props and Data Flow',
  '# Props and Data Flow

Props allow you to pass data from parent to child components.

## Passing Props

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Greeting name="Alice" age={25} />
```

## Props are Read-Only

Props should never be modified by the child component. They flow one way: parent → child.

## Children Prop

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>This is the card content!</p>
</Card>
```',
  2,
  TRUE,
  TRUE,
  25
);

-- ============================================
-- FINAL TEST for Class 1, Beginner Grade
-- ============================================
INSERT INTO final_tests (id, class_id, grade_id, title, description, passing_score, time_limit_minutes, max_attempts, questions, is_published) VALUES
(
  test1_id,
  class1_id,
  grade1_beginner_id,
  'HTML & CSS Basics Test',
  'Test your knowledge of HTML fundamentals and basic CSS styling.',
  70,
  15,
  3,
  '[
    {
      "id": "q1",
      "question": "What does HTML stand for?",
      "type": "multiple_choice",
      "options": [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      "correct_answer": 0,
      "points": 20
    },
    {
      "id": "q2",
      "question": "Which HTML element is used for the largest heading?",
      "type": "multiple_choice",
      "options": [
        "<heading>",
        "<h6>",
        "<h1>",
        "<head>"
      ],
      "correct_answer": 2,
      "points": 20
    },
    {
      "id": "q3",
      "question": "What is the correct CSS syntax to change the background color?",
      "type": "multiple_choice",
      "options": [
        "background-color: blue;",
        "bgcolor: blue;",
        "color-background: blue;",
        "background: color blue;"
      ],
      "correct_answer": 0,
      "points": 20
    },
    {
      "id": "q4",
      "question": "Which CSS property is used to change the text color?",
      "type": "multiple_choice",
      "options": [
        "text-color",
        "font-color",
        "color",
        "foreground-color"
      ],
      "correct_answer": 2,
      "points": 20
    },
    {
      "id": "q5",
      "question": "Where in an HTML document should the <title> element be placed?",
      "type": "multiple_choice",
      "options": [
        "In the <body> section",
        "In the <head> section",
        "At the end of the document",
        "Anywhere in the document"
      ],
      "correct_answer": 1,
      "points": 20
    }
  ]',
  TRUE
);

-- ============================================
-- FINAL TEST for Class 2, Getting Started Grade
-- ============================================
INSERT INTO final_tests (id, class_id, grade_id, title, description, passing_score, time_limit_minutes, max_attempts, questions, is_published) VALUES
(
  test2_id,
  class2_id,
  grade2_getting_started_id,
  'React Basics Test',
  'Test your understanding of React components, JSX, and props.',
  70,
  10,
  3,
  '[
    {
      "id": "q1",
      "question": "What is JSX?",
      "type": "multiple_choice",
      "options": [
        "A JavaScript database",
        "A syntax extension for JavaScript that looks like HTML",
        "A CSS framework",
        "A testing library"
      ],
      "correct_answer": 1,
      "points": 25
    },
    {
      "id": "q2",
      "question": "How do you pass data from a parent to a child component?",
      "type": "multiple_choice",
      "options": [
        "Using state",
        "Using context",
        "Using props",
        "Using refs"
      ],
      "correct_answer": 2,
      "points": 25
    },
    {
      "id": "q3",
      "question": "What is the correct way to create a React function component?",
      "type": "multiple_choice",
      "options": [
        "function MyComponent() { return <div>Hello</div>; }",
        "class MyComponent { render() { return <div>Hello</div>; } }",
        "const MyComponent = <div>Hello</div>;",
        "React.create(MyComponent)"
      ],
      "correct_answer": 0,
      "points": 25
    },
    {
      "id": "q4",
      "question": "Can props be modified by the child component?",
      "type": "multiple_choice",
      "options": [
        "Yes, always",
        "Yes, but only in class components",
        "No, props are read-only",
        "Only if the parent allows it"
      ],
      "correct_answer": 2,
      "points": 25
    }
  ]',
  TRUE
);

END $$;
