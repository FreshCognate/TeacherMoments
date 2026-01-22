# AGENTS.md

This file provides guidance for AI agents working on the TeacherMoments codebase.

## Project Overview

TeacherMoments is an educational platform for creating, managing, and running interactive teaching scenarios. The application enables educators to build scenario-based learning experiences that students can engage with, featuring real-time feedback and response tracking.

## Technology Stack

### Frontend (`/frontend`)
- **Framework**: React 18 with React Router 7 (SSR enabled)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Key Libraries**: Slate (rich text), Framer Motion, Socket.io-client, DnD Kit

### Backend (`/backend`)
- **Runtime**: Node.js 24.x
- **Framework**: Express 4
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io with Redis adapter
- **Auth**: Passport.js with local strategy
- **Queue**: BullMQ

### Workers (`/workers`)
- **Runtime**: Node.js 24.x
- **Queue**: BullMQ
- **AI**: OpenAI integration
- **Media**: FFmpeg, Sharp

## Project Structure

```
TeacherMoments/
├── backend/                 # Express API server (port 4000)
│   ├── core/               # Core infrastructure
│   │   ├── app/           # Route registration, validation
│   │   ├── authentication/# Passport setup, auth routes
│   │   ├── databases/     # MongoDB connection, models
│   │   ├── io/            # Socket.io setup
│   │   └── queues/        # BullMQ setup
│   └── modules/           # Feature modules (scenarios, cohorts, etc.)
│
├── frontend/               # React app (port 3000)
│   ├── core/              # Shared utilities, hooks, components
│   ├── modules/           # Feature modules
│   ├── uikit/             # Reusable UI components
│   └── routes.ts          # Route definitions
│
├── workers/                # Background job processor (port 5000)
│   ├── tasks/             # Task definitions
│   ├── runners/           # Job runners
│   └── agents/            # AI agents
│
└── config/                 # Shared configuration
```

## Development Commands

```bash
# Install dependencies
yarn install

# Start all services for development
yarn dev         # Frontend dev server (port 3000)
yarn server      # Backend with nodemon (port 4000)
yarn workers     # Workers with nodemon (port 5000)

# Production builds
yarn build       # Build frontend
yarn start       # Production frontend server
yarn server:start    # Production backend
yarn workers:start   # Production workers
```

## Code Conventions

### Backend Module Structure

Each backend feature module follows this pattern:

```
modules/[feature]/
├── index.js              # Exports and registration
├── [feature].controller.js   # Request handlers
├── [feature].routes.js       # Route definitions with Joi validation
├── [feature].schema.js       # Mongoose schema
├── services/             # Business logic
└── helpers/              # Utilities
```

### Route Registration

Routes follow a Rails-like CRUD pattern with 5 methods that map to HTTP verbs:

| Method   | HTTP   | URL Pattern       |
|----------|--------|-------------------|
| `all`    | GET    | `/route`          |
| `create` | POST   | `/route`          |
| `read`   | GET    | `/route/:param`   |
| `update` | PUT    | `/route/:param`   |
| `delete` | DELETE | `/route/:param`   |

Each route object has a `route` (URL path), `controller`, and CRUD method configs:

```javascript
export default [{
  route: '/scenarios',
  controller,
  all: {
    query: { searchValue: Joi.string().default('') },
    middleware: [isAuthenticated, hasPermissions(['ADMIN'])],
  },
  create: {
    body: { name: Joi.string().required() },
    middleware: [isAuthenticated, hasPermissions(['ADMIN'])],
  },
  read: {
    param: 'id',
    middleware: [isAuthenticated],
  },
  update: {
    param: 'id',
    body: { name: Joi.string() },
    middleware: [isAuthenticated, hasPermissions(['ADMIN'])],
  },
  delete: {
    param: 'id',
    middleware: [isAuthenticated, hasPermissions(['ADMIN'])],
  }
}];
```

### Frontend Module Structure

```
modules/[feature]/
├── routes/          # Route components (page-level)
├── containers/      # Business logic components
├── components/      # Presentational components
├── helpers/         # Utilities
└── schemas/         # Form/data schemas
```

### Path Aliases (Frontend)

- `~/modules` - Feature modules
- `~/core` - Core utilities
- `~/uikit` - UI components

### Styling

Use Tailwind CSS utility classes. The project has custom color tokens defined in `tailwind.config.ts`.

## Key Patterns

### Authentication & Authorization

- Use `isAuthenticated()` middleware for protected routes
- Use `hasPermissions()` for role-based access
- Roles: `SUPER_ADMIN`, `ADMIN`, `FACILITATOR`, `USER`

### Validation

Each CRUD method config supports these Joi validation options:

```javascript
{
  param: 'id',              // URL parameter name (for read/update/delete)
  body: { ... },            // Request body validation
  query: { ... },           // Query string validation
  files: { ... },           // File upload validation
  middleware: [ ... ],      // Express middleware array
  props: { ... }            // Additional properties passed to controller
}
```

### Real-time Updates

Socket.io is used for real-time collaboration. Events are emitted via the event system in `core/events/`.

### Background Jobs

Long-running tasks (audio processing, AI generation) go through BullMQ queues. Add new tasks in `workers/tasks/`.

## Important Files

### Entry Points
- `backend/core/index.js` - Backend entry
- `backend/core/server.js` - Express server setup
- `frontend/root.tsx` - React root component
- `frontend/routes.ts` - All route definitions
- `workers/index.js` - Worker entry

### Configuration
- `frontend/vite.config.ts` - Vite configuration
- `frontend/tailwind.config.ts` - Tailwind configuration
- `frontend/react-router.config.ts` - React Router config

## Database

MongoDB with Mongoose. Schemas are defined in each module's `*.schema.js` file.

Common patterns:
- `buildLanguageSchema()` for multi-language fields
- Timestamps enabled by default
- Soft deletes where applicable

## External Services

- **Storage**: AWS S3 compatible (DigitalOcean Spaces)
- **Email**: Postmark
- **AI**: OpenAI API
- **CAPTCHA**: Cloudflare Turnstile

## Code Style

- ESLint with semistandard rules (relaxed)
- Semicolons required
- Single quotes for strings
- 2-space indentation
- Functional React components
- CommonJS in backend, ES modules in frontend

## Testing

No automated test suite is currently configured. Manual testing is required.

## Common Tasks

### Adding a New Backend Module

1. Create folder in `backend/modules/[name]/`
2. Add schema, controller, routes, and index.js
3. Register routes in `core/app/app.routes.js`

### Adding a New Frontend Route

1. Create route component in `frontend/modules/[feature]/routes/`
2. Add route definition in `frontend/routes.ts`

### Adding a Background Task

1. Create task definition in `workers/tasks/`
2. Register in appropriate runner (`workers/runners/`)
3. Queue jobs from backend using BullMQ

## Notes for AI Agents

- Always validate inputs with Joi schemas on backend routes
- Use the existing module patterns when adding new features
- Check `hasPermissions()` for proper authorization
- Use path aliases (`~/`) in frontend imports
- Real-time features should emit socket events
- Long-running operations should use the queue system
- Frontend uses SSR - be mindful of server vs client code
