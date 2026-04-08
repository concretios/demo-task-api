# API Design Patterns

## Request Validation
- Use middleware for request validation, not inline checks in route handlers.
- Validate request body schema, query parameters, and path parameters.
- Return all validation errors at once, not one at a time.

## Response Format
- All successful responses must include the resource or resource list directly.
- All error responses must use: `{ error: "Human readable message", code: "MACHINE_CODE" }`.
- Use HTTP 201 for resource creation, 200 for updates, 204 for deletes.

## Middleware
- Order: cors -> helmet -> rate-limit -> body-parser -> auth -> routes -> error-handler.
- Each middleware must call `next()` or send a response, never both.
- Error middleware must have the 4-parameter signature: `(err, req, res, next)`.

## Logging
- Log all incoming requests with method, path, and response status.
- Use structured logging (JSON format) for production.
- Include request ID in all log entries for traceability.
