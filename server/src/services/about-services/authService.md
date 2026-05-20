# Auth Service (`authService.js`)

**Location:** `server/src/services/authService.js`

**Role:** Implements authentication-related business logic for:
- registering employees/companies
- logging users in
- generating session tokens

## Exports

### `registerUser(userData, role)`
Creates a new user record and returns `{ user, token }`.

**Inputs**
- `userData`: expected fields include:
  - `name` (for `employee`)
  - `companyName` (for `company`)
  - `email`
  - `password`
- `role`: expected values (from controller usage) include:
  - `employee`
  - `company`

**Behavior (high-level)**
- Checks whether the email already exists.
- Hashes password before storage.
- Creates user with role-specific fields.
- Generates a JWT token for the new user.
- Ensures password is not returned.

**Outputs**
- On success: `{ user, token }`
- On failure: throws `AppError` (e.g., duplicate email)

### `loginUser(credentials)`
Authenticates a user and returns `{ user, token }`.

**Inputs**
- `credentials`:
  - `email`
  - `password`

**Behavior (high-level)**
- Loads user by email.
- Compares password hash.
- Generates a JWT token.
- Ensures password is not returned.

**Outputs**
- On success: `{ user, token }`
- On failure: throws `AppError` (invalid credentials)

## Token generation
- Uses JWT signing with `process.env.SECRET` (fallback provided in code).
- Token expiry is set to `7d`.

