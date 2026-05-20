# User Service (`userService.js`)

**Location:** `server/src/services/userService.js`

**Role:** Encapsulates user persistence and retrieval operations used by controllers.

## Exports

### `updateUserById(id, updates)`
Updates a user document by id.

**Inputs**
- `id`: target user id
- `updates`: fields to update

**Outputs**
- Returns updated user data (implementation dependent).

### `getUserById(id)`
Fetches a user document by id.

**Inputs**
- `id`: target user id

**Outputs**
- Returns user data (implementation dependent).

## Authorization
Authorization is enforced in controllers (e.g., `userController.updateProfile`) using `req.user` + role checks.

