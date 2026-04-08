# Security Rules

## Authentication
- All mutating endpoints (POST, PATCH, PUT, DELETE) must be behind authentication middleware.
- Use Bearer token authentication, not API key in query parameters.
- Tokens must have expiration (max 24 hours for access tokens).
- Implement rate limiting on authentication endpoints (max 5 attempts per minute).

## Data Protection
- Never log sensitive data (passwords, tokens, API keys, PII).
- Sanitize all user-provided strings before storing (trim whitespace, strip HTML).
- Set security headers: helmet middleware is required.
- Enable CORS only for specific allowed origins, never use wildcard `*` in production.

## Dependencies
- No dependencies with known critical CVEs.
- Pin exact versions in package.json (no ^ or ~ prefixes) for production deployments.
- Review new dependencies before adding: check download count, maintenance status, license.
