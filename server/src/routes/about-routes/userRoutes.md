# User Routes (`userRoutes.js`)

**Location:** `server/src/routes/userRoutes.js`

**Role:** Defines user profile endpoints.

## Global middleware
- Applies `authMiddleware.protect` to all routes in this router.
- Requests are authenticated and the user context is attached to `req.user`.

## Endpoints

### GET `/:id`
- Controller: `userController.getUserData`

### PATCH `/:id/profile`
- Controller: `userController.updateProfile`
- Rate limiting: `express-rate-limit` instance applied to profile updates

Rate limiter configuration (conceptual):
- Window: 15 minutes
- Max: 10 update requests per IP per window

## Request/Response overview
- `getUserData` uses `req.params.id`.
- `updateProfile` uses:
  - `req.params.id` to determine which user to update
  - `req.body` for profile fields

