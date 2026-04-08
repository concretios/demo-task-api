# Code Review Rules for Demo Task API

## Security
- Never store passwords in plaintext. Always use bcrypt with a minimum cost factor of 10.
- All API endpoints that modify data must require authentication.
- Validate and sanitize all user input at the route handler level using a validation library (e.g., joi, express-validator).
- Never expose stack traces or internal error details in API responses.
- Use parameterized queries if a database is introduced. No string concatenation for queries.

## Error Handling
- All route handlers must use try/catch or express error middleware.
- Return consistent error response format: `{ error: string, code?: string }`.
- Use appropriate HTTP status codes: 400 for validation, 401 for auth, 403 for authz, 404 for not found, 500 for server errors.

## Code Style
- Use `const` by default. Only use `let` when reassignment is necessary. Never use `var`.
- All functions must have JSDoc comments describing parameters and return values.
- Maximum function length: 30 lines. Extract helpers for longer functions.
- Use early returns to reduce nesting.

## API Design
- All list endpoints must support pagination with `page` and `limit` query parameters.
- Response format for lists: `{ data: [], meta: { page, limit, total } }`.
- Use plural nouns for resource endpoints (e.g., `/tasks`, not `/task`).
- Include `createdAt` and `updatedAt` timestamps on all resources.

## Testing
- All new endpoints must have corresponding test files.
- Test files go in a `tests/` directory mirroring the source structure.
- Minimum test coverage: happy path + one error case per endpoint.
