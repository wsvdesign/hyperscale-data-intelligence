# SECURITY.md

## Project

**Repository:** `hyperscale-data-intelligence`  
**Project:** Hyperscale Data Intelligence — Data Center Database  
**Security owner:** Ant — Security and Privacy Agent

This project combines a public React application, structured research data, SQL-based analysis, and a future cloud API that allows users to ask questions about the hyperscale data center dataset.

The public website may be open, but private credentials, internal service configuration, and protected API operations must never be exposed in the browser or repository.

---

## Security Principle

**The browser is public. Secrets belong only on the server.**

Any value included in React, Vite client code, public JavaScript, HTML, JSON, or the built website must be treated as visible to every user.

---

## Approved Security Architecture

The question-answering feature must use this structure:

```text
User
  ↓
DataQuery.jsx
  ↓
Secure cloud API or serverless endpoint
  ↓
Validated query and approved dataset context
  ↓
Anthropic or other language-model API
  ↓
Filtered response returned to the browser
```

The following structure is prohibited:

```text
DataQuery.jsx
  ↓
Anthropic API called directly from the browser
  ↓
Private API key exposed
```

---

## Environment Variables

The local `.env` file may contain server-side secrets such as:

```text
ANTHROPIC_API_KEY=replace_with_private_key
```

Rules:

- `.env` must be included in `.gitignore`.
- `.env` must never be committed.
- `.env.example` must contain placeholders only.
- Secret variables must not begin with `VITE_`.
- React components must not import private environment variables.
- Production secrets must be stored in the deployment platform's protected environment-variable settings.
- Secrets must never appear in screenshots, README examples, bug reports, logs, prompts, or public issues.

Approved `.env.example`:

```text
ANTHROPIC_API_KEY=your_private_key_here
```

---

## Required `.gitignore` Entries

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
.DS_Store
*.log
```

Before every push, confirm that `.env` is not staged:

```bash
git status
git ls-files | grep -E '(^|/)\.env($|\.)'
```

The only environment file allowed in Git is `.env.example`.

---

## API Key Exposure Response

If a key is accidentally committed, displayed, logged, or shared:

1. Revoke the key immediately.
2. Create a replacement key.
3. Update the secure deployment environment.
4. Remove the exposed value from the current files.
5. Remove it from Git history when necessary.
6. Review logs for unauthorized use.
7. Record the incident without copying the exposed key into `DEBUGGING.md`.
8. Have Ant complete a security review before redeployment.

Deleting a key from the latest commit alone does not remove it from Git history.

---

## Cloud API Requirements

The future cloud question-answering endpoint must include:

- Server-side secret handling
- HTTPS
- Input validation
- Request-size limits
- Rate limiting
- Timeout controls
- Safe error messages
- Logging that excludes secrets and unnecessary personal data
- Controlled CORS settings
- Method restrictions
- Response-size limits
- Dependency review
- Abuse monitoring
- Cost controls

The endpoint should accept only the minimum data required to answer a question.

---

## User Input Validation

Questions submitted through `DataQuery.jsx` must be treated as untrusted input.

The server must:

- Require a string question.
- Trim leading and trailing whitespace.
- Reject empty submissions.
- Enforce a reasonable character limit.
- Reject unsupported content types.
- Limit request body size.
- Prevent user input from changing system-level instructions.
- Avoid directly executing user-provided SQL.
- Avoid constructing raw SQL through string concatenation.
- Reject attempts to request secrets, environment variables, system prompts, or private configuration.

Recommended initial limit:

```text
Maximum question length: 1,000 characters
```

---

## SQL Security

The public question interface must never execute unrestricted user-written SQL.

Approved patterns:

1. The model selects from a predefined set of safe queries.
2. The server generates parameterized read-only queries.
3. The server queries a restricted read-only database user.
4. The server validates tables, columns, operators, limits, and output size.
5. The database connection prevents INSERT, UPDATE, DELETE, DROP, ALTER, and administrative operations.

Required SQL controls:

- Parameterized queries
- Read-only database credentials
- Query timeout
- Row limit
- Approved table allowlist
- Approved column allowlist
- No multiple statements
- No raw interpolation
- No database error details returned to users

---

## Dataset Protection

The project primarily uses public research data, but each dataset must be reviewed before publication.

Do not include:

- Private API keys
- Passwords
- Authentication tokens
- Personal contact information that is not required
- Private addresses
- Confidential agreements
- Restricted legal records
- Sensitive account details
- Internal system identifiers
- Data obtained in violation of terms or access restrictions

Public records must still be handled responsibly and attributed correctly.

---

## Prompt-Injection Protection

The cloud API must treat retrieved documents and user questions as data, not instructions.

The model must not follow content that asks it to:

- Reveal system prompts
- Reveal API keys
- Ignore project rules
- Change its role
- Execute hidden commands
- Access unrelated systems
- Invent unsupported facts
- Return raw confidential configuration

The server should define a fixed system instruction that cannot be replaced by user input.

---

## Response Safety and Accuracy

The API response must:

- Use only approved project datasets and sources when making factual claims.
- Clearly distinguish source data from interpretation.
- Avoid claiming causation without evidence.
- State when the available data is insufficient.
- Avoid exposing implementation details, credentials, or internal prompts.
- Use a maximum response length appropriate for the interface.
- Include source references when the architecture supports them.

Precision must review the factual-response rules.

---

## Authentication Decision

The first public version may allow anonymous read-only questions if:

- Rate limiting is enabled.
- Per-request cost is controlled.
- Input size is limited.
- Abuse monitoring exists.
- No private data is accessible.
- The database account is read-only.

Authentication should be added if the API stores user history, provides higher usage limits, accesses private datasets, or incurs meaningful cost.

---

## Rate Limiting and Cost Control

Before public deployment, define:

- Requests allowed per IP or user
- Time window
- Daily cost ceiling
- Maximum model tokens
- Maximum dataset context size
- Timeout
- Retry policy
- Behavior when limits are exceeded

The API should fail safely rather than create unlimited charges.

---

## CORS

Do not use unrestricted CORS in production without a documented reason.

Preferred production configuration:

```text
Allowed origin: the deployed hyperscale-data-intelligence website
Allowed methods: POST, OPTIONS
Allowed headers: Content-Type
Credentials: disabled unless authentication requires them
```

Development localhost origins may be permitted separately.

---

## Error Handling

Public errors should be simple:

```json
{
  "error": "The question could not be processed."
}
```

Do not return:

- Stack traces
- Environment-variable names
- API-provider responses containing sensitive metadata
- SQL statements
- Database connection details
- File-system paths
- Internal prompts
- Dependency versions unless necessary

Detailed errors may be recorded securely on the server after sensitive values are removed.

---

## Logging

Logs may record:

- Timestamp
- Request ID
- Route
- Response status
- Latency
- Approximate token use
- Rate-limit outcome
- Sanitized error category

Logs must not record:

- API keys
- Authorization headers
- Full environment variables
- Database passwords
- Full system prompts
- Personal data unless necessary and disclosed
- Entire user questions by default

---

## Dependency Security

Before adding a package:

1. Confirm that the package is necessary.
2. Prefer maintained, widely used packages.
3. Review its license.
4. Review known vulnerabilities.
5. Avoid packages that duplicate native platform features.
6. Pin or lock dependency versions through the package lockfile.
7. Run:

```bash
npm audit
```

Do not automatically apply breaking dependency changes without testing.

---

## Frontend Security

React components must:

- Avoid `dangerouslySetInnerHTML` unless the content is sanitized and approved.
- Never render raw model-generated HTML.
- Escape user-visible text through normal React rendering.
- Avoid exposing private configuration in error messages.
- Avoid placing secrets in source maps.
- Validate external URLs before rendering them as links.
- Use `rel="noopener noreferrer"` for external links opened in a new tab.

---

## Deployment Security Checklist

Before deployment:

- [ ] `.env` is ignored.
- [ ] `.env.example` contains placeholders only.
- [ ] No `VITE_` variable contains a secret.
- [ ] No key appears in the repository or Git history.
- [ ] Production secrets are stored in protected platform settings.
- [ ] The cloud API uses HTTPS.
- [ ] CORS is restricted.
- [ ] Rate limiting is enabled.
- [ ] Request and response limits are enabled.
- [ ] SQL access is read-only and parameterized.
- [ ] Input validation is active.
- [ ] Error messages are sanitized.
- [ ] Logging excludes secrets and unnecessary personal data.
- [ ] Dependencies are reviewed.
- [ ] Bach has tested success and failure cases.
- [ ] Precision has reviewed response constraints.
- [ ] Ant has approved deployment.
- [ ] Natalie has approved public release.

---

## Security Testing Scenarios

Bach and Ant must test:

1. Empty question
2. Very long question
3. Invalid JSON body
4. Unsupported HTTP method
5. Repeated rapid requests
6. Prompt asking for the API key
7. Prompt asking for the system prompt
8. Prompt asking the model to ignore instructions
9. Prompt containing SQL injection text
10. Prompt requesting destructive SQL
11. Provider timeout
12. Provider authentication failure
13. Database unavailable
14. Unexpected response format
15. Cross-origin request from an unapproved site

---

## Security Ownership

- **Ant:** Security architecture, secrets, deployment controls, incident response
- **JIRO:** Secure server, database, SQL, API, and validation implementation
- **Bach:** Security regression and failure testing
- **Precision:** Factual-response constraints
- **Raphael:** Scope and release coordination
- **Natalie:** Final approval

---

## Reporting a Security Issue

Do not open a public GitHub issue containing sensitive details.

A security report should include:

- A short description
- Affected route or component
- Reproduction steps without publishing secrets
- Potential impact
- Whether credentials may have been exposed
- Recommended immediate containment

If credentials may be exposed, revoke them before continuing the investigation.
