# Authentication Routes (`authRoutes.js`)

**Location:** `server/src/routes/authRoutes.js`

**Role:** Defines the HTTP endpoints for:
- user/employee/company registration
- login
- logout
- retrieving the current authenticated user

## Endpoints

### POST `/register/employee`
- Controller: `authController.registerEmployee`
- Auth: public

### POST `/register/company`
- Controller: `authController.registerCompany`
- Auth: public

### POST `/login`
- Controller: `authController.login`
- Auth: public

### GET `/logout`
- Controller: `authController.logout`
- Auth: public (token cookie cleared by controller)

### GET `/me`
- Controller: `authController.getMe`
- Middleware: `protect` from `server/src/middleware/auth` (attaches `req.user`)

## Request/Response overview

- Registration/login endpoints expect the relevant credential fields in `req.body`.
- Protected endpoint `/me` returns the authenticated user attached to `req.user`.

