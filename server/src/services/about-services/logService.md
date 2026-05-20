# Log Service (`logService.js`)

**Location:** `server/src/services/logService.js`

**Role:** Central service for creating audit/activity logs.

## Exports

### `createLog(userId, type, message)`
Creates and persists a log entry tied to a user.

**Inputs**
- `userId`: identifier for the user performing an action
- `type`: log category (e.g., `LOGIN`, `LOGOUT`, `PROFILE_UPDATE`)
- `message`: human-readable description

**Outputs**
- Returns the created log document/record (implementation dependent).

**Usage (examples from controllers)**
- `authController`: logs `LOGIN` and `LOGOUT`
- `userController`: logs `PROFILE_UPDATE`

