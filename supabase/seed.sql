-- LMS MVP Seed Data
-- Run this after schema.sql

-- Insert demo classes
INSERT INTO classes (id, title, description, thumbnail_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Introduction to Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'),
  ('22222222-2222-2222-2222-222222222222', 'React Fundamentals', 'Master React.js from basics to advanced concepts including hooks, state management, and more.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
  ('33333333-3333-3333-3333-333333333333', 'Database Design & SQL', 'Learn how to design efficient databases and write powerful SQL queries.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400');

-- Insert grades for Web Development class
INSERT INTO grades (id, class_id, name, order_index, requires_grade_id, requires_min_score) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Beginner', 1, NULL, NULL),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Intermediate', 2, 'a1111111-1111-1111-1111-111111111111', 70),
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Advanced', 3, 'a2222222-2222-2222-2222-222222222222', 80);

-- Insert grades for React class
INSERT INTO grades (id, class_id, name, order_index, requires_grade_id, requires_min_score) VALUES
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Beginner', 1, NULL, NULL),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Intermediate', 2, 'b1111111-1111-1111-1111-111111111111', 70),
  ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Advanced', 3, 'b2222222-2222-2222-2222-222222222222', 75);

-- Insert grades for Database class
INSERT INTO grades (id, class_id, name, order_index, requires_grade_id, requires_min_score) VALUES
  ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Beginner', 1, NULL, NULL),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Advanced', 2, 'c1111111-1111-1111-1111-111111111111', 70);

-- Insert lessons for Web Development - Beginner
INSERT INTO lessons (class_id, grade_id, title, content, order_index, is_required_for_test) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'What is HTML?', 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements represented by tags.

## Key Concepts
- HTML elements are represented by tags
- Tags usually come in pairs (opening and closing)
- The browser does not display the HTML tags but uses them to render content

## Basic Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>My First Heading</h1>
  <p>My first paragraph.</p>
</body>
</html>
```', 1, true),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'CSS Basics', 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and the overall visual presentation.

## Selectors
- Element selector: `p { color: blue; }`
- Class selector: `.classname { color: red; }`
- ID selector: `#idname { color: green; }`

## Box Model
Every element is a box with: content, padding, border, and margin.', 2, true),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'JavaScript Introduction', 'JavaScript is a programming language that adds interactivity to your website. It can update content, animate images, and much more.

## Variables
```javascript
let name = "John";
const age = 25;
var oldWay = "deprecated";
```

## Functions
```javascript
function greet(name) {
  return "Hello, " + name + "!";
}
```', 3, true);

-- Insert lessons for Web Development - Intermediate
INSERT INTO lessons (class_id, grade_id, title, content, order_index, is_required_for_test) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Responsive Design', 'Learn how to create websites that work on all devices using media queries and flexible layouts.', 1, true),
  ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'CSS Flexbox', 'Master the flexible box layout model for creating complex layouts with ease.', 2, true),
  ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'DOM Manipulation', 'Learn how to interact with HTML elements using JavaScript and the Document Object Model.', 3, true);

-- Insert lessons for React - Beginner
INSERT INTO lessons (class_id, grade_id, title, content, order_index, is_required_for_test) VALUES
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'What is React?', 'React is a JavaScript library for building user interfaces. It lets you create reusable UI components.

## Key Features
- Component-based architecture
- Virtual DOM for performance
- Declarative UI
- One-way data flow', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Components and Props', 'Components are the building blocks of React applications. Props allow you to pass data to components.

## Function Component
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```', 2, true),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'State and Hooks', 'Learn about useState and useEffect hooks for managing component state and side effects.

## useState
```jsx
const [count, setCount] = useState(0);
```

## useEffect
```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```', 3, true);

-- Insert lessons for Database - Beginner
INSERT INTO lessons (class_id, grade_id, title, content, order_index, is_required_for_test) VALUES
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Introduction to Databases', 'A database is an organized collection of structured information stored electronically. Learn about different types of databases and when to use them.', 1, true),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'SQL Basics', 'SQL (Structured Query Language) is the standard language for managing relational databases.

## Basic Commands
- SELECT: Retrieve data
- INSERT: Add new records
- UPDATE: Modify existing records
- DELETE: Remove records', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Tables and Relationships', 'Learn how to design tables and create relationships between them using primary and foreign keys.', 3, true);

-- Insert test questions for Web Development - Beginner
INSERT INTO test_questions (class_id, grade_id, question, options, correct_answer, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"]', 0, 1),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Which CSS property is used to change the text color?', '["font-color", "text-color", "color", "foreground-color"]', 2, 2),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Which keyword is used to declare a constant in JavaScript?', '["var", "let", "const", "constant"]', 2, 3),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'What is the correct HTML tag for the largest heading?', '["<heading>", "<h6>", "<h1>", "<head>"]', 2, 4),
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Which HTML attribute is used to define inline styles?', '["class", "styles", "style", "font"]', 2, 5);

-- Insert test questions for React - Beginner
INSERT INTO test_questions (class_id, grade_id, question, options, correct_answer, order_index) VALUES
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'What is React?', '["A database", "A JavaScript library for building UIs", "A CSS framework", "A programming language"]', 1, 1),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'What hook is used to manage state in functional components?', '["useEffect", "useContext", "useState", "useReducer"]', 2, 2),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'How do you pass data to a child component?', '["Using state", "Using props", "Using context", "Using refs"]', 1, 3),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'What is JSX?', '["A JavaScript extension that allows HTML-like syntax", "A CSS preprocessor", "A testing framework", "A build tool"]', 0, 4),
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Which hook is used for side effects?', '["useState", "useEffect", "useMemo", "useCallback"]', 1, 5);

-- Insert test questions for Database - Beginner
INSERT INTO test_questions (class_id, grade_id, question, options, correct_answer, order_index) VALUES
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'What does SQL stand for?', '["Structured Query Language", "Simple Question Language", "Standard Query Logic", "Sequential Query Language"]', 0, 1),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Which SQL command is used to retrieve data?', '["GET", "FETCH", "SELECT", "RETRIEVE"]', 2, 2),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'What is a primary key?', '["A key that can have duplicate values", "A unique identifier for each record", "A foreign reference", "An index"]', 1, 3),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Which command adds new records to a table?', '["ADD", "INSERT", "CREATE", "APPEND"]', 1, 4),
  ('33333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'What is a foreign key?', '["A primary key from another table", "An encrypted key", "A backup key", "An auto-generated key"]', 0, 5);
