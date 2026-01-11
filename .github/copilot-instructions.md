# TeacherMoments AI Coding Guidelines

## Architecture Overview

TeacherMoments is a **monorepo** with three independent services in a yarn workspace:
- **frontend/**: React Router v7 (SSR) with TypeScript, Tailwind, Socket.io client
- **backend/**: Express.js REST API with Socket.io server, Passport auth, MongoDB
- **workers/**: BullMQ background job processors for AI generation and asset processing

Services communicate via REST APIs, Socket.io events, and Redis-backed job queues.

## Critical Workflows

### Development Commands
```bash
# Run all services from root
yarn dev           # Frontend dev server (port varies)
yarn server        # Backend with nodemon (port 4000)
yarn workers       # Workers with nodemon (port 5000)

# Production
yarn build         # Build frontend
yarn start         # Run frontend production server
yarn server:start  # Run backend production
yarn workers:start # Run workers production
```

### Module Registration Pattern
All backend modules follow a strict initialization pattern in `backend/modules/[module]/index.js`:
```javascript
import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './[module].model.js';
import routes from './[module].routes.js';

// Register Mongoose model
registerModel({ name: 'ModelName', model, type: 'app' });

// Register Express routes
registerRoutes(routes);
```

Module imports are centralized in `backend/modules/index.js` and automatically loaded at startup. **Never** manually instantiate models or routes elsewhere.

## Path Aliases & Imports

- **Backend/Workers**: Use `#core/*` for core imports (defined in package.json `imports`)
  ```javascript
  import hasPermissions from '#core/authentication/middleware/hasPermissions.js';
  ```
- **Frontend**: Use `~/` for workspace-relative imports
  ```typescript
  import NavigationContainer from '~/modules/navigation/containers/navigationContainer';
  ```
- **Always** use `.js` extensions even for TypeScript files (ESM requirement)

## Event-Driven Architecture

### Backend Event System
Uses `minivents` for internal service events (`backend/core/events/index.js`):
```javascript
import { emit, on } from '#core/events/index.js';

// Listen for lifecycle events
on('core:server:started', ({ server, sessionStore }) => { });
on('core:io:connected', (socket) => { });
```

### Socket.io Patterns
Real-time communication uses namespaced events with entity IDs:
```javascript
// Backend: Broadcast to all clients except sender
socket.broadcast.emit(`SCENARIO:${scenarioId}_EVENT:SLIDE_LOCK_STATUS`, data);

// Workers: Emit job progress via getSockets()
const sockets = await getSockets();
sockets.emit(`workers:generate:${job.id}`, { event: 'GENERATING' });
```

## Background Jobs (BullMQ)

Jobs are queued in backend, processed by workers:

1. **Backend**: Queue creation in `backend/core/queues/index.js`
   ```javascript
   import QUEUES from './queues.js';
   QUEUES.generate.add('JOB_NAME', { payload: data });
   ```

2. **Workers**: Job handlers in `workers/runners/[queue].js`
   ```javascript
   export default async (job) => {
     switch (job.name) {
       case 'JOB_NAME':
         // Process job.data.payload
         break;
     }
   }
   ```

Workers must handle progress updates via Socket.io (see `workers/runners/generate.js`).

## Frontend Routing

Uses React Router v7 file-based routing defined in `frontend/routes.ts`:
```typescript
export default [
  index("./modules/dashboard/routes/homeRoute.tsx"),
  ...prefix("scenarios", [
    layout("./modules/scenarios/routes/scenarioEditorLayout.tsx", [
      route(":id/create", "./modules/scenarios/routes/createScenarioRoute.tsx"),
    ])
  ])
] satisfies RouteConfig;
```

Routes are strongly typed - modify `routes.ts`, not individual files.

## Backend Route Registration

Routes use a declarative schema with Joi validation (`backend/modules/*/[module].routes.js`):
```javascript
export default [{
  route: '/scenarios',
  controller: scenariosController,
  all: {
    query: { searchValue: Joi.string().allow('').default('') },
    middleware: [isAuthenticated]
  },
  create: {
    body: { name: Joi.string().required() },
    middleware: [isAuthenticated, hasPermissions(['ADMIN'])]
  }
}];
```

Controllers receive validated `req.body`, `req.query`, `req.params` automatically.

## Database Patterns

### Schema Definition
Schemas are separated from models (`backend/modules/*/[module].schema.js`):
```javascript
const schema = {
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};
export default schema;
```

### Multilingual Fields
Use `buildLanguageSchema()` for i18n support:
```javascript
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
const title = buildLanguageSchema('title', { type: String, default: '' });
// Generates: title_en, title_fr, etc.
```

## Module Structure Convention

Both frontend and backend modules follow:
```
modules/[feature]/
  ├── index.js              # Module registration (backend only)
  ├── [feature].model.js    # Mongoose model (backend)
  ├── [feature].schema.js   # Mongoose schema (backend)
  ├── [feature].routes.js   # Route definitions (backend)
  ├── [feature].controller.js  # CRUD controller (backend)
  ├── routes/               # React Router routes (frontend)
  ├── components/           # React components (frontend)
  ├── containers/           # Container components (frontend)
  ├── services/             # Business logic (both)
  └── helpers/              # Utility functions (both)
```

## Configuration Files

Static configs in `config/`:
- `blocks.json` - Block type definitions for scenario builder
- `googleFonts.json`, `websafeFonts.json` - Typography options
- `languages.json` - Supported locales

Load via standard imports, not dynamic requires.

## Environment Setup

- Uses `.env` in root (loaded via dotenv in each service)
- Required vars: `MONGODB_URL`, `REDIS_URL`, `SESSION_SECRET`, `API_PREFIX`
- Workers check `SHOULD_RUN_WORKERS=true` to enable processing

## Testing & Debugging

- No test suite currently configured
- Use `nodemon` for auto-reload during development
- Check `backend/core/io/index.js` for Socket.io connection issues
- Workers log job lifecycle: 'Job started', 'Job completed', 'Job failed'

## Common Gotchas

1. **ESM Only**: All code uses ES modules - no CommonJS
2. **File Extensions**: Always include `.js` in imports, even for `.ts` files
3. **Socket Namespacing**: Event names must include entity IDs for proper scoping
4. **Model Registration**: Models registered once at startup, not per-file
5. **Route Validation**: Joi schemas are enforced - missing fields cause 400 errors
6. **Workers Separation**: Workers access backend core via `#core/*` but maintain separate instance
