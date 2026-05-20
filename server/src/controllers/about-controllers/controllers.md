# Controllers Overview (API Layer)

This document explains the **server controllers** under `server/src/controllers/` from a **developer/reader** perspective.

> Scope: The controllers described here are the three primary controller modules:
> - `authController.js`
> - `dashboardController.js`
> - `userController.js`

---

## authController.js
**Location:** `server/src/controllers/authController.js`

**Role:** Handles authentication and basic session lifecycle actions:
- employee/company registration
- login
- get current authenticated user
- logout

### Exposed actions (exports)

#### 1) `registerEmployee`
**Purpose:** Create a new user with role/type `employee` and return an authenticated session.

**Expected input** (from `req.body`):
- `name`
- `email`
- `password`

**Notes:**
- Performs required-field checks before delegating to the auth service.

**Outputs:**
- On success: returns an authenticated response by setting a token (cookie + JSON payload).
- On failure: returns an error via `next(new AppError(...))`.

#### 2) `registerCompany`
**Purpose:** Create a new company account and return an authenticated session.

**Expected input** (from `req.body`):
- `companyName`
- `email`
- `password`

**Outputs:**
- Same success/error patterns as `registerEmployee`.

#### 3) `login`
**Purpose:** Authenticate an existing user using credentials and return an authenticated session.

**Expected input** (from `req.body`):
- `email`
- `password`

**Side effects:**
- Creates a login log entry.

**Outputs:**
- On success: token is issued (cookie + JSON payload).

#### 4) `getMe`
**Purpose:** Fetch the currently authenticated user profile.

**Expected input source:**
- Uses `req.user` (populated by authentication/protect middleware).

**Outputs:**
- Returns the authenticated user data.

#### 5) `logout`
**Purpose:** End the user session by clearing the auth token cookie.

**Side effects:**
- Creates a logout log entry when the user context is available.

**Outputs:**
- Clears cookie and returns a success response.

### Dependencies / integrations (conceptual)
- Uses `authService` for registration/login operations.
- Uses `logService` for LOGIN/LOGOUT audit logs.
- Uses centralized utilities for async error handling and consistent responses.

---

## dashboardController.js
**Location:** `server/src/controllers/dashboardController.js`

**Role:** Provides dashboard data for aspirant users. Most methods rely on:
- `req.user.id` (authenticated user context)

### Exposed actions (exports)

#### 1) `getAspirantStats`
**Purpose:** Provide summary statistics for the aspirant.

**Expected input source:**
- `req.user.id`

**Typical dashboard output includes:**
- total applied jobs
- active applications count
- shortlisted count

#### 2) `getRecentActivity`
**Purpose:** Retrieve recent activity logs for the user.

**Expected query params** (optional):
- `page` (default: `1`)
- `limit` (default: `3`)

**Expected input source:**
- `req.user.id`

**Outputs:**
- Returns a paginated list of recent logs.

#### 3) `getRecommendedJobs`
**Purpose:** Fetch job recommendations based on user profile context.

**Expected query params** (optional):
- `page` (default: `1`)
- `limit` (default: `5`)

**Expected input source:**
- `req.user` (especially `aspirantProfile` fields)

**Recommendation signals (conceptual):**
- matching skills (when available)
- matching location preferences (when available)
- matching job type (when available)

**Outputs:**
- Returns a list of recommended jobs.

#### 4) `getApplications`
**Purpose:** List job applications for the aspirant.

**Expected query params** (optional):
- `page` (default: `1`)
- `limit` (default: `10`)

**Expected input source:**
- `req.user.id`

**Behavior highlights:**
- Returns applications sorted by most recent creation.
- Includes job summary information by populating job reference.

### Dependencies / integrations (conceptual)
- Uses models for jobs, applications, user logs.
- Uses centralized response utilities.

---

## userController.js
**Location:** `server/src/controllers/userController.js`

**Role:** Manage user profile updates and user retrieval.

### Exposed actions (exports)

#### 1) `updateProfile`
**Purpose:** Update user profile fields.

**Expected input**:
- `req.params.id` (target user id)
- `req.body` (fields to update)

**Authorization rules (developer view):**
- Users can update their own profile only.
- Admins can update other users.

**Safety behavior (conceptual):**
- Prevents direct updates to sensitive properties (e.g., password/role/email) by removing them from the updates payload.

**Side effects:**
- Creates a PROFILE_UPDATE audit log.

**Outputs:**
- Returns the updated user record.

#### 2) `getUserData`
**Purpose:** Fetch a user by id.

**Expected input**:
- `req.params.id`

**Outputs:**
- Returns user data through service-layer retrieval.

### Dependencies / integrations (conceptual)
- Uses `userService` for persistence/retrieval.
- Uses `logService` for audit logs.

---

## How to navigate the controllers (quick reference)

- **Authentication:** `authController.js`
  - registerEmployee, registerCompany, login, getMe, logout

- **Dashboard:** `dashboardController.js`
  - getAspirantStats, getRecentActivity, getRecommendedJobs, getApplications

- **User profile:** `userController.js`
  - updateProfile, getUserData

---

## Summary
These controllers form the main server-side request handlers:
- `authController.js` focuses on authentication/session lifecycle.
- `dashboardController.js` exposes aspirant dashboard data endpoints.
- `userController.js` provides profile update and user retrieval.

