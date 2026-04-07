# 📌 BACKEND ARCHITECTURE MASTER PLAN (MODULAR)

---

## 1. Project Overview

**System purpose**

Ustura is a multi-role barber reservation platform for:
- Customers booking 30-minute appointments with a selected salon and barber
- Salon owners managing salons, staff, working hours, and daily operations
- Barbers viewing only their own appointments
- Receptionists managing salon-wide appointments without staff-administration authority
- Super admins approving owner onboarding and platform-level operations

**Core flows**

1. Customer authentication and session refresh
2. Public salon discovery and salon detail retrieval
3. Reservation booking with slot availability and collision prevention
4. Owner salon setup, working-hours management, and staff management
5. Barber/receptionist reservation operations by role
6. Owner onboarding approval flow for salon activation

**Current reality**

The repository already has the right modular monolith intent, but the backend is still a scaffold:
- Most modules contain only TODO shells
- Build is currently broken
- Unit tests are absent
- The only e2e test is a stale Nest starter test
- Runtime-critical dependencies from the docs are not installed in `package.json`

**Target architecture summary**

The backend should remain a **modular monolith**, not a microservice system. The target state is:
- Strict module-owned write boundaries
- Clean architecture inside each module
- Direct synchronous calls only for invariants and request-critical validations
- Event-driven communication for side effects
- Raw SQL repositories hidden behind module contracts
- Reservation consistency enforced by PostgreSQL transaction + Redis lock + active-slot uniqueness

---

## 2. Current Modular Structure Analysis

**Existing Nest modules**
- `AppModule`
- `ConfigModule`
- `DatabaseModule`
- `AuthModule`
- `UserModule`
- `SalonModule`
- `StaffModule`
- `ReservationModule`

**Existing cross-cutting layer**
- `common/` for decorators, guards, filters, interceptors, enums, interfaces, pipes

| Module / Layer | Intended Responsibility | Current Assessment | Main Issues |
|---|---|---|---|
| `AppModule` | Composition root | Minimal and acceptable as a shell | No global guards, filters, interceptors, Swagger, CORS, or versioning wired at bootstrap |
| `ConfigModule` | Centralized env/config management | Not implemented | Empty module; scattered `process.env` access; build currently fails on env parsing |
| `DatabaseModule` | DB connectivity and transaction boundary | Not implemented | `DatabaseService` is a placeholder; no pool, no transaction helper, no query abstraction |
| `AuthModule` | Register/login/refresh/logout | Empty shell | No JWT strategy, no guards, no hashing, no token rotation, no dependencies installed |
| `UserModule` | Canonical user data | Empty shell with boundary leakage | Repository exported directly; overlaps with Auth concerns; DTOs mix credential and profile semantics |
| `SalonModule` | Public salon read + owner salon management | Empty shell | No split between public catalog and owner management; no working-hours validation |
| `StaffModule` | Staff membership and employee operations | Empty shell | No contract with User/Salon modules; role invariants unresolved |
| `ReservationModule` | Booking, cancellation, salon calendars, slots | Empty shell | Highest future complexity; slot logic TODO; status model too weak for documented staff flow |
| `common/` | Shared technical building blocks | Already drifting into business scope | `reservation-status` and slot/JWT constants do not belong in a generic shared layer |

**Coupling assessment**

Current coupling is deceptively low because the modules do almost nothing yet. If implemented as-is, coupling will become tight because:
- repositories are exposed across module boundaries
- module-specific enums/constants already live in `common`
- DTOs mirror DB column names
- no public module contracts are defined

**Code smells already present**

- Pseudo-modularity: module folders exist, but behavior is not implemented
- Shared-layer leakage: reservation domain concepts live in `common`
- Infrastructure drift: docs require JWT/Swagger/Redis/pg/bcrypt/class-validator, but runtime deps are missing
- HTTP/DB leakage: DTOs use snake_case fields such as `photo_url`, `working_hours`, `user_id`
- Security shells: `JwtAuthGuard`, `RolesGuard`, `JwtStrategy`, validation pipe are placeholders
- Build/test drift: compile fails, `npm test` finds no unit tests, e2e test still expects Nest starter root route

**Missing modules**

- `PlatformAdminModule` for super-admin actions and owner approval flow
- `NotificationModule` for reservation and onboarding side effects
- `AuditLogModule` for sensitive operational history
- `HealthModule` for readiness/liveness checks
- `CacheModule` abstraction for Redis cache and distributed locking

**Overloaded or wrongly bounded areas**

- `AuthModule` and `UserModule` have unclear ownership of user creation and identity lifecycle
- `SalonModule` must serve both public read models and owner-only management flows
- `StaffModule` must support owner CRUD, staff self-view, and receptionist operational queries
- `ReservationModule` must support booking commands, availability read models, cancellation, and role-scoped calendar projections
- `super_admin` exists in schema and enums, but no module owns that business capability

---

## 3. Target Modular Architecture (IMPROVED)

**Architectural rule for every module**

Each functional module must contain:
- `controllers/` for HTTP entrypoints only
- `application/` for command/query services and use cases
- `domain/` for entities, value objects, policies, state transitions
- `repositories/` for raw SQL persistence adapters
- `dto/` for request/response validation and transport models
- `interfaces/` for public contracts and injected ports

**Recommended internal shape**

```text
modules/<module>/
  controllers/
  application/
    commands/
    queries/
  domain/
    entities/
    value-objects/
    policies/
    services/
  repositories/
  dto/
  interfaces/
  <module>.module.ts
```

**Conceptual domain grouping**

| Domain Group | Module | Why It Exists |
|---|---|---|
| Core | `AuthModule` | Owns credentials, JWT issuance, refresh rotation, login/logout, auth guards integration |
| Core | `UserModule` | Owns canonical user records, profiles, role identity, user provisioning |
| Core | `PlatformAdminModule` | Owns super-admin flows, owner approval, and future platform governance |
| Business | `SalonModule` | Owns salon catalog, salon settings, working-hours policy, and owner-scoped salon writes |
| Business | `StaffModule` | Owns salon membership, barber/receptionist lifecycle, staff-scoped query policies |
| Business | `ReservationModule` | Owns booking, cancellation, slot availability generation, calendar read models, status transitions |
| System | `NotificationModule` | Owns outbound email/SMS/push adapters and event-driven side effects |
| System | `AuditLogModule` | Owns immutable audit records for auth, staff, and reservation events |
| System | `HealthModule` | Owns liveness/readiness endpoints and dependency diagnostics |
| Infrastructure | `ConfigModule` | Owns typed environment configuration and validation |
| Infrastructure | `DatabaseModule` | Owns pg pool, query execution, transaction runner |
| Infrastructure | `CacheModule` | Owns Redis cache, distributed lock service, short-lived projections |

**Boundary guidance**

- Keep the current top-level business modules to minimize churn: `auth`, `user`, `salon`, `staff`, `reservation`
- Add missing modules rather than collapsing everything into existing ones
- Inside existing modules, split generic services into **command/query services** to avoid fat service files

---

## 4. Module Communication Strategy

**Direct service calls via DI**

Use direct synchronous calls when the request cannot complete safely without the answer:
- `AuthModule -> UserModule` for `findByEmail`, `createCustomer`, `findById`
- `StaffModule -> UserModule` for employee account provisioning
- `StaffModule -> SalonModule` for salon ownership validation
- `ReservationModule -> SalonModule` for working-hours lookup and salon existence
- `ReservationModule -> StaffModule` for staff existence, active-state, and salon membership checks

**Event-based communication**

Use events for side effects that must not create transactional coupling:
- `user.registered`
- `owner.approved`
- `staff.created`
- `reservation.created`
- `reservation.cancelled`
- `reservation.status_changed`
- `auth.logged_out`

Subscribers:
- `NotificationModule`
- `AuditLogModule`
- cache invalidation handlers
- future analytics/reporting handlers

**Rules to prevent circular dependencies**

- No module may inject another module's repository directly
- Modules export **interfaces / application services**, not raw persistence adapters
- `forwardRef()` should be treated as a temporary escape hatch, not a design tool
- Shared policies such as "can owner manage this salon?" must live in explicit access/query services, not in controllers
- Mutation ownership is exclusive; only the owning module writes its tables
- Cross-table read joins are allowed only for read projections, never to bypass another module's invariants

---

## 5. Database & Entity Design

**Current table ownership**

| Table / Entity | Owning Module | Relationships | Architecture Rule |
|---|---|---|---|
| `users` | `UserModule` | owner of `salons`, member of `staff`, customer in `reservations`, owner of `refresh_tokens` | Never mutated outside `UserModule` |
| `refresh_tokens` | `AuthModule` | FK to `users` | Only `AuthModule` manages issue/revoke/rotate |
| `salons` | `SalonModule` | FK `owner_id -> users`, parent of `staff` and `reservations` | `SalonModule` owns writes; others consume read projections |
| `staff` | `StaffModule` | FK `user_id -> users`, FK `salon_id -> salons`, parent of `reservations` | `StaffModule` owns membership lifecycle |
| `reservations` | `ReservationModule` | FK `customer_id -> users`, `salon_id -> salons`, `staff_id -> staff` | `ReservationModule` owns booking and status lifecycle |

**Required table additions**

| Table | Purpose |
|---|---|
| `owner_applications` | Persist owner onboarding requests and approval status; closes the documented admin-approval gap |
| `audit_logs` | Store operational audit trail for security and support |
| `outbox_events` | Optional but strongly recommended before any module extraction |

**Schema corrections required**

- Replace the current hard unique constraint on `(staff_id, slot_start)` with a **partial unique index for active reservations only**
  - Otherwise a cancelled reservation permanently blocks rebooking that slot
- Extend reservation lifecycle to support staff operations
  - Recommended statuses: `pending`, `confirmed`, `cancelled`, `completed`, `no_show`
- Keep `slot_end` derived from `slot_start + 30 minutes`
- Validate `working_hours` JSONB against a strict schema in the `SalonModule` domain
- Add explicit timestamps and actor fields for operational changes where needed
  - `cancelled_at`, `cancelled_by_user_id`
  - `status_changed_at`, `status_changed_by_user_id`
- Add metadata to refresh tokens for traceability
  - `created_at`, `revoked_at`, `user_agent`, `ip_address`, `rotated_from`

**Important domain inconsistency**

The current model contains both `users.role` and `staff.role`. Keep both only if the invariant is explicit:
- `users.role` = global access identity
- `staff.role` = salon membership role
- `StaffModule` must enforce that `staff.role` and `users.role` are compatible

**Cross-module leakage rule**

- No module returns raw table rows from another module as its public contract
- Public responses should be module-owned projections such as:
  - `SalonSummary`
  - `StaffSummary`
  - `ReservationCalendarItem`
  - `OwnerDashboardMetrics`

---

## 6. Auth & Security (Modularized)

**`AuthModule` responsibilities**

- Customer self-registration
- Access token issuance
- Refresh token rotation
- Logout / logout-all
- Password verification and hashing
- Auth event emission
- Guard and strategy integration

**Guards and policies**

- `JwtAuthGuard`: validates JWT and attaches a typed principal
- `RolesGuard`: coarse RBAC gate
- Resource policies in services:
  - owner can manage only owned salons
  - barber can view only assigned reservations
  - receptionist can view salon reservations but not manage staff
- Avoid putting ownership logic directly in controllers

**RBAC model**

- `super_admin`: platform governance, owner approvals
- `owner`: salon writes, staff writes, salon-wide reservation visibility
- `barber`: own reservations only
- `receptionist`: salon-wide reservation operations, no staff lifecycle writes
- `customer`: own reservations only

**Token handling**

- Access token TTL: 15 minutes
- Refresh token TTL: 7 days
- Store only hashed refresh tokens in DB
- Rotate refresh tokens on every refresh
- Revoke all sessions on password change or suspicious token reuse
- Rate-limit `login` and `refresh`
- Never keep production fallback secrets in code

**Security baseline**

- `bcrypt` with cost factor `>= 12`
- `@nestjs/config` with env schema validation
- global validation pipe with `whitelist`, `forbidNonWhitelisted`, `transform`
- strict CORS by frontend origin
- `helmet` and secure headers
- structured exception format
- Swagger auth schemes for secured routes
- HTTPS in all non-local environments

---

## 7. Core Modules Deep Dive

### AuthModule

- Responsibility: credentials, sessions, token lifecycle, authentication entrypoint
- Public API:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `POST /auth/logout-all`
- Internal logic:
  - verify password
  - hash password and refresh token
  - issue JWTs
  - rotate/revoke refresh tokens
  - publish auth events
- Dependencies:
  - `UserModule`
  - `DatabaseModule`
  - `AuditLogModule` via events
  - `NotificationModule` via events when needed
- What it MUST NOT do:
  - own user profile updates
  - create staff memberships
  - manage salon ownership
  - perform raw SQL from controllers

### UserModule

- Responsibility: canonical user records and user identity lookups
- Public API:
  - `GET /users/me`
  - `PATCH /users/me`
  - internal contracts: `findById`, `findByEmail`, `createCustomer`, `createEmployee`, `deactivateUser`
- Internal logic:
  - enforce email/phone uniqueness rules
  - role assignment policy
  - profile update policy
  - lightweight user provisioning for other modules
- Dependencies:
  - `DatabaseModule`
  - `AuditLogModule` via events
- What it MUST NOT do:
  - issue tokens
  - verify passwords
  - manage staff or salon writes
  - know reservation rules

### PlatformAdminModule

- Responsibility: super-admin operations and owner approval workflow
- Public API:
  - `POST /owner-applications`
  - `GET /admin/owner-applications`
  - `POST /admin/owner-applications/:id/approve`
  - `POST /admin/owner-applications/:id/reject`
- Internal logic:
  - record onboarding request
  - approve owner creation
  - provision owner user + salon atomically
  - publish onboarding events
- Dependencies:
  - `UserModule`
  - `SalonModule`
  - `NotificationModule`
  - `AuditLogModule`
- What it MUST NOT do:
  - handle customer booking
  - manage day-to-day salon operations
  - bypass owner/staff modules for writes

### SalonModule

- Responsibility: salon catalog and salon management
- Public API:
  - `GET /salons`
  - `GET /salons/:id`
  - `POST /salons`
  - `PATCH /salons/:id`
  - `DELETE /salons/:id`
- Internal logic:
  - owner access validation
  - working-hours schema validation
  - public read projections
  - active/inactive salon lifecycle
- Dependencies:
  - `UserModule` for owner validation
  - `DatabaseModule`
- What it MUST NOT do:
  - create staff users
  - create reservations
  - own availability calculations

### StaffModule

- Responsibility: salon staff lifecycle and staff-scoped access rules
- Public API:
  - `GET /salons/:salonId/staff`
  - `POST /salons/:salonId/staff`
  - `PATCH /salons/:salonId/staff/:staffId`
  - `DELETE /salons/:salonId/staff/:staffId`
  - optional: `GET /staff/me`
- Internal logic:
  - provision staff user accounts
  - enforce one membership per user per salon
  - manage active/inactive state
  - validate role compatibility
- Dependencies:
  - `UserModule`
  - `SalonModule`
  - `NotificationModule` via events
  - `AuditLogModule` via events
- What it MUST NOT do:
  - authenticate users
  - own salon settings
  - create or cancel reservations directly

### ReservationModule

- Responsibility: reservation commands, availability/slots, role-scoped calendars, reservation status lifecycle
- Public API:
  - `GET /salons/:salonId/slots?date=&staffId=`
  - `POST /reservations`
  - `GET /reservations/my`
  - `GET /reservations/salon/:salonId`
  - `PATCH /reservations/:id/status`
  - `DELETE /reservations/:id`
- Internal logic:
  - generate slots from salon working hours
  - filter booked slots
  - acquire Redis lock before booking
  - run booking in PostgreSQL transaction
  - enforce reservation state transitions
  - build owner/barber/receptionist calendar projections
- Dependencies:
  - `SalonModule` read contracts
  - `StaffModule` read contracts
  - `UserModule` read contracts
  - `CacheModule`
  - `DatabaseModule`
  - `AuditLogModule` and `NotificationModule` via events
- What it MUST NOT do:
  - create staff or salon records
  - manage user credentials
  - expose raw joined entities as public API

### NotificationModule

- Responsibility: outbound communication adapters
- Public API:
  - no required public REST endpoint in MVP
  - internal methods: `sendReservationCreated`, `sendReservationCancelled`, `sendOwnerApproved`
- Internal logic:
  - consume domain events
  - choose template and channel
  - retry non-critical delivery
- Dependencies:
  - email/SMS providers
  - event subscriptions
- What it MUST NOT do:
  - contain business authorization logic
  - block booking transactions on delivery failure

### AuditLogModule

- Responsibility: immutable operational trace
- Public API:
  - optional admin-only audit read endpoints
  - internal method: `record(event)`
- Internal logic:
  - persist who did what, to which aggregate, when
  - keep auth, staff, and reservation change history
- Dependencies:
  - `DatabaseModule`
  - event subscriptions
- What it MUST NOT do:
  - become a reporting engine
  - drive business behavior synchronously

### HealthModule

- Responsibility: operational diagnostics
- Public API:
  - `GET /health/live`
  - `GET /health/ready`
- Internal logic:
  - postgres ping
  - redis ping
  - config sanity checks
- Dependencies:
  - `DatabaseModule`
  - `CacheModule`
- What it MUST NOT do:
  - expose secrets
  - include domain behavior

---

## 8. Shared & Common Layer

**Recommended split**

- `common/`: framework-facing technical concerns
  - decorators
  - guards
  - interceptors
  - exception filters
  - pipes
- `shared/`: reusable technical primitives
  - `Clock`
  - `UuidGenerator`
  - `BaseSqlRepository`
  - `PaginatedResult`
  - `DomainEvent`
  - typed error classes

**Rules**

- Do not place domain enums in shared
- Do not place feature constants in shared
- Do not place DTOs in shared unless they are truly transport-agnostic
- Do not place repository implementations in shared
- Do not use shared as a shortcut to bypass module contracts

**Immediate cleanup required**

- Move `reservation-status.enum` into `ReservationModule`
- Move slot duration and Redis lock constants into `ReservationModule` or typed config
- Move JWT expiration constants into `AuthModule`/config
- Keep only truly cross-cutting auth contracts in shared, if needed

---

## 9. Scalability Strategy

**Stay a modular monolith first**

This system should stay monolithic until:
- reservation throughput or team scale justifies extraction
- event contracts are stable
- operational ownership is separated by team, not only by code folder

**Best extraction candidates later**

1. `NotificationModule`
2. public salon catalog/search read model
3. reporting/analytics read side
4. auth/session service only if multiple external clients or products appear

**Modules that should remain in the monolith longest**

- `ReservationModule`
- `StaffModule`
- `SalonModule`

These modules share strong transactional and policy coupling around booking invariants.

**Preparation for future extraction**

- introduce outbox events now
- keep public module contracts explicit
- avoid cross-module repository calls
- keep write ownership exclusive
- define stable domain events before any split

---

## 10. Performance

**Caching with Redis**

- cache public salon list for `5 minutes`
- cache slot availability for `30 seconds`
- cache owner dashboard metrics for `30-60 seconds`
- invalidate cache on:
  - salon update
  - staff update
  - reservation create/cancel/status change

**DB optimization**

- use `pg.Pool` with a small bounded pool, e.g. min `2`, max `10`
- no `SELECT *` in hot paths
- use narrow projection queries for list endpoints
- keep indexes for:
  - active salons by city
  - active staff by salon
  - reservations by `customer_id, slot_start desc`
  - reservations by `salon_id, slot_start`
  - active uniqueness on `staff_id + slot_start`
- use transaction wrapper for all reservation mutations
- prepared statements for high-frequency slot and reservation reads

**Lazy loading / projection strategy**

- list endpoints should return projections, not fully joined domain objects
- load detailed staff/customer context only on detail screens
- avoid fetching owner/staff/customer profile payloads when only names/status badges are needed
- split dashboard metrics queries from reservation list queries

---

## 11. Testing Strategy

**Unit tests per module**

- domain policies and state transitions
- application services with mocked ports
- guard/policy behavior by role matrix
- slot generation and booking rules

**Integration tests**

- repository tests against real PostgreSQL
- cache/lock tests against real Redis
- transaction rollback tests
- refresh token rotation tests

**E2E tests**

- customer registration/login/refresh/logout
- owner salon create/update
- owner adds staff
- customer books reservation
- barber sees only own reservations
- receptionist sees salon reservations but cannot manage staff
- owner dashboard queries
- Swagger availability smoke test

**Critical concurrency test**

- two parallel booking attempts for the same `staff_id + slot_start`
- expected result: one succeeds, one returns `409 Conflict`

**Current testing gap**

- no unit tests are currently detected
- e2e suite is a stale starter test and must be replaced entirely

---

## 12. Step-by-Step Refactor & Implementation Plan

1. Stabilize the foundation: add missing runtime packages (`@nestjs/config`, `@nestjs/swagger`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `class-validator`, `class-transformer`, `bcrypt`, `pg`, `ioredis`, `@nestjs/throttler`, `helmet`) and fix the current TypeScript build errors.
2. Implement `ConfigModule` with env schema validation and typed config objects for DB, JWT, Redis, CORS, and app settings.
3. Implement `DatabaseModule` properly: `pg.Pool`, `query()`, `transaction<T>()`, lifecycle hooks, timeouts, and structured SQL error translation.
4. Introduce `CacheModule` with two explicit services: `CacheService` and `DistributedLockService`.
5. Harden bootstrap in `main.ts`: global validation pipe, exception filter, transform interceptor, CORS, security headers, versioning, Swagger, and graceful shutdown.
6. Refactor `common/` and `shared/`: move module-specific enums/constants out of shared space and create strict rules for what belongs there.
7. Refactor `UserModule` first: canonical user repository, query contracts, provisioning methods, and profile update flow.
8. Implement `AuthModule` on top of `UserModule`: register, login, refresh rotation, logout, JWT strategy, `JwtAuthGuard`, `RolesGuard`, hashed refresh tokens.
9. Refactor `SalonModule` into separate command/query services: public catalog reads vs owner salon management.
10. Implement `StaffModule` with explicit dependencies on `UserModule` and `SalonModule`, including employee provisioning and role invariants.
11. Rework reservation schema: partial active-slot uniqueness, richer reservation status lifecycle, audit-friendly mutation metadata.
12. Implement `ReservationModule` in two internal tracks:
    - command side: create/cancel/status change
    - query side: my reservations, salon reservations, available slots, dashboard projections
13. Add Redis lock + PostgreSQL transaction around booking, then add the concurrency test before considering the module complete.
14. Add `PlatformAdminModule` to close the documented owner approval gap and align the `super_admin` role with actual behavior.
15. Add `NotificationModule` and `AuditLogModule` as event consumers, not synchronous dependencies of business transactions.
16. Replace the starter e2e test suite with role-based business flows and add repository integration tests for Postgres/Redis.
17. Add `HealthModule`, readiness checks, structured logging, and deployment hardening.
18. Only after all core flows are stable, optimize with cache invalidation, read-model tuning, and optional outbox support.

---

## 13. Anti-Patterns to Fix

- Empty modules that simulate architecture without implementing behavior
- Exporting repositories across module boundaries
- Putting business enums/constants into `common`
- Using DTO field names that leak DB column naming into the API surface
- Treating `*.service.ts` as a future god-object per module
- Hard-coding environment fallbacks for sensitive security values
- Relying on a blanket unique constraint that prevents rebooking cancelled slots
- Keeping `users.role` and `staff.role` without an enforced invariant
- Leaving bootstrap cross-cutting concerns unconfigured
- Keeping stale starter tests that do not validate real business behavior

---

## 14. Senior-Level Recommendations

- Keep the current modular monolith direction, but tighten it around **table ownership, service contracts, and explicit policies**.
- Treat `UserModule` as the canonical identity owner and `AuthModule` as the session owner; do not merge them into one god module.
- Keep `ReservationModule` as the scheduling center of gravity, but split it internally into command/query and availability policy services.
- Make side effects asynchronous early. Notifications, audit logs, and cache invalidation should consume events, not participate in booking transactions.
- Standardize API DTOs in camelCase and map to snake_case only at repository level.
- Move raw SQL into named repository query files or constants organized by module; do not scatter query strings through services.
- Introduce an outbox before any future extraction. It is the cheapest way to preserve consistency when the monolith grows.
- Do not extract microservices until operational pressure exists. For this system, disciplined module boundaries inside one codebase will deliver more reliability than premature distribution.

---

## 15. Recommended Target Folder Structure

```text
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── shared/
│   ├── core/
│   │   ├── domain-event.ts
│   │   ├── result.ts
│   │   └── errors/
│   ├── database/
│   │   ├── sql-query.ts
│   │   └── base-sql-repository.ts
│   └── utils/
├── config/
│   ├── app.config.ts
│   ├── cors.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   ├── env.validation.ts
│   └── config.module.ts
├── infrastructure/
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   └── migrations/
│   ├── cache/
│   │   ├── cache.module.ts
│   │   ├── cache.service.ts
│   │   └── distributed-lock.service.ts
│   └── observability/
├── modules/
│   ├── auth/
│   │   ├── application/
│   │   ├── controllers/
│   │   ├── domain/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── repositories/
│   │   ├── strategies/
│   │   └── auth.module.ts
│   ├── user/
│   ├── platform-admin/
│   ├── salon/
│   ├── staff/
│   ├── reservation/
│   ├── notification/
│   ├── audit-log/
│   └── health/
└── test/
    ├── integration/
    ├── e2e/
    └── fixtures/
```

---

## 16. Module Dependency Rules

### Allowed dependency directions

| From | Allowed To |
|---|---|
| `AuthModule` | `UserModule`, infrastructure modules |
| `UserModule` | infrastructure modules only |
| `PlatformAdminModule` | `UserModule`, `SalonModule`, infrastructure modules |
| `SalonModule` | `UserModule`, infrastructure modules |
| `StaffModule` | `UserModule`, `SalonModule`, infrastructure modules |
| `ReservationModule` | `SalonModule`, `StaffModule`, `UserModule`, infrastructure modules |
| `NotificationModule` | infrastructure modules only |
| `AuditLogModule` | infrastructure modules only |
| `HealthModule` | infrastructure modules only |

### Forbidden dependencies

- `UserModule -> AuthModule`
- `SalonModule -> ReservationModule`
- `StaffModule -> ReservationModule`
- any module -> another module's repository
- any controller -> repository
- `common/` -> business modules
- `shared/` -> business modules

### Enforcement recommendations

- Use exported provider tokens, not concrete classes, for cross-module contracts
- Add import-boundary lint rules
- Keep one public `index.ts` per module contract surface if needed

---

## 17. SQL & Repository Standards

### Repository rules

- One repository per aggregate root or cohesive read model
- Repositories return typed records, not `any`
- Repositories do not contain business branching
- All SQL is parameterized
- No dynamic SQL string concatenation for user input
- Query names should be stable and traceable for logs

### Query organization

```text
modules/reservation/repositories/sql/
  create-reservation.sql.ts
  find-customer-reservations.sql.ts
  find-salon-reservations.sql.ts
  find-staff-reservations-by-date.sql.ts
  update-reservation-status.sql.ts
```

### Transaction pattern

Use `DatabaseService.transaction(async (tx) => { ... })` for:
- create reservation
- cancel reservation
- create owner + salon bootstrap
- create staff + employee user provisioning
- destructive role/state changes with multiple table writes

### Reservation booking order

1. Validate salon exists and is active
2. Validate staff belongs to salon and is active
3. Validate customer is active
4. Acquire Redis lock on `reservation:<staffId>:<slotStart>`
5. Start DB transaction
6. Re-check conflicting active reservation in DB
7. Insert reservation
8. Commit
9. Release lock
10. Publish `reservation.created`

---

## 18. API Standards

### Response envelope

Use a consistent response shape:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error shape:

```json
{
  "success": false,
  "error": {
    "code": "RESERVATION_SLOT_CONFLICT",
    "message": "Selected slot is no longer available.",
    "details": {}
  }
}
```

### HTTP status conventions

| Case | Status |
|---|---|
| success read | `200` |
| success create | `201` |
| success delete/cancel | `200` or `204` |
| invalid input | `400` |
| unauthenticated | `401` |
| unauthorized | `403` |
| not found | `404` |
| slot conflict / business conflict | `409` |
| rate limit | `429` |
| unexpected error | `500` |

### DTO rules

- request DTOs in camelCase
- response DTOs should be explicit, never raw DB rows
- validate UUIDs, enums, ISO dates, pagination params
- forbid unknown fields globally

### Versioning

- start with URI versioning: `/api/v1/...`
- do not introduce `/v2` until there is a breaking contract change

---

## 19. Reservation Domain Rules

### Required invariants

- one active reservation per `staffId + slotStart`
- slot duration is fixed at 30 minutes
- reservation must fall inside salon working hours
- reservation cannot be created for inactive salon/staff/customer
- barber can only see own assigned reservations
- receptionist can see salon reservations only
- owner can manage only owned salon reservations

### Recommended reservation statuses

| Status | Meaning |
|---|---|
| `pending` | newly created, waiting for operational confirmation if needed |
| `confirmed` | accepted and scheduled |
| `cancelled` | cancelled by customer/owner/receptionist |
| `completed` | appointment finished |
| `no_show` | customer did not attend |

### Valid transitions

| From | To |
|---|---|
| `pending` | `confirmed`, `cancelled`, `no_show` |
| `confirmed` | `completed`, `cancelled`, `no_show` |
| `cancelled` | none |
| `completed` | none |
| `no_show` | none |

---

## 20. Observability & Operations

### Logging

Adopt structured JSON logs with:
- request id
- user id
- role
- module
- operation
- duration
- error code

### Metrics

Track:
- auth login attempts / failures
- reservation create success / conflict / failure
- slot endpoint latency
- DB query latency by module
- Redis lock acquisition failures
- refresh token reuse detection

### Health checks

- `GET /health/live`: process alive
- `GET /health/ready`: DB + Redis ready
- include dependency status and latency
- never expose secrets or stack traces

### Deployment readiness

- separate configs for local/staging/prod
- run migrations before app start
- fail fast on invalid env
- graceful shutdown for pg and Redis
- set reverse-proxy trust only in controlled environments

---

## 21. Definition of Done Per Module

### AuthModule

- register/login/refresh/logout implemented
- access and refresh tokens tested
- rate limiting enabled
- Swagger documented
- unit + integration + e2e coverage

### UserModule

- profile read/update implemented
- uniqueness constraints enforced
- provisioning methods tested
- no auth/session logic inside module

### SalonModule

- public list/detail works
- owner CRUD works
- working-hours validation enforced
- cache invalidation wired

### StaffModule

- owner can create/update/deactivate staff
- receptionist cannot manage staff lifecycle
- user-role compatibility enforced
- staff list projections optimized

### ReservationModule

- slots generated correctly
- booking conflict prevention proven
- role-scoped read models implemented
- status transitions enforced and audited

### PlatformAdminModule

- owner application intake exists
- super-admin approval flow implemented
- owner + salon bootstrap transaction safe

---

## 22. Immediate Codebase Correction Checklist

1. Fix `parseInt(process.env...)` compile errors by validating env and defaulting before parse.
2. Replace empty `ConfigModule` with `@nestjs/config`.
3. Implement `DatabaseService` before any domain work continues.
4. Install missing dependencies required by the documented architecture.
5. Remove or replace the stale starter e2e test.
6. Add at least one real unit spec and one real e2e booking flow before new feature expansion.
7. Move module-specific enums/constants out of `common`.
8. Stop exporting repositories from modules unless strictly internal to that module.
9. Introduce typed auth principal and implement `JwtStrategy`, `JwtAuthGuard`, and `RolesGuard`.
10. Redesign reservation uniqueness so cancelled reservations do not block future bookings.

---

## 23. Final Architectural Position

Ustura should evolve as a **disciplined modular monolith with explicit contracts, transaction-safe booking logic, and event-driven side effects**. The current repository already has the right top-level module split; the work now is not structural reinvention, but **turning placeholders into enforceable boundaries**, aligning schema and role behavior with the documented MVP, and building the infrastructure required for correctness under load.
