# Dashboard Routes (`dashboardRoutes.js`)

**Location:** `server/src/routes/dashboardRoutes.js`

**Role:** Defines aspirant dashboard endpoints.

## Global middleware
- Applies `authMiddleware.protect` to all routes in this router.
- This middleware is expected to authenticate the request and attach user context to `req.user`.

## Endpoints

### GET `/aspirant/stats`
- Controller: `dashboardController.getAspirantStats`

### GET `/aspirant/recent-activity`
- Controller: `dashboardController.getRecentActivity`

Query params (optional):
- `page`
- `limit`

### GET `/aspirant/recommended-jobs`
- Controller: `dashboardController.getRecommendedJobs`

Query params (optional):
- `page`
- `limit`

### GET `/aspirant/applications`
- Controller: `dashboardController.getApplications`

Query params (optional):
- `page`
- `limit`

