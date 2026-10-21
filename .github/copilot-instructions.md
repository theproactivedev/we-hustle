# Repository Custom Instructions

## Project Context
- This is a monorepo. It consists of backend and frontend folders. The backend is using Express.js. And the frontend is built with React, TypeScript and Vite.
- We use Tailwind CSS for styling.

## Coding Standards
- Prefer descriptive variable names over short abbreviations.
- Use strict TypeScript types; avoid using `any`.
- Always use standard `function` declarations for all top-level React components.
- Do NOT use arrow functions (`const Component = () => {}`) for main component definitions.
- Place the `export default` or named export consistently according to existing patterns in the workspace.

## Internal Logic & Helper Functions
- Always use arrow functions (`const helper = () => {}`) for any internal event handlers, state setters, hooks, effects, or utilities defined inside the component scope.
- Use arrow functions with implicit returns for inline JSX mapping, filtering, or simple callbacks (e.g., `.map(item => ...)`).
- Avoid using the `function` keyword inside a component body.