# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EliteFit is a full-stack fitness platform with a .NET 8 backend and React frontend. It supports user workout tracking, nutrition/recipe management, achievements/gamification, and a staff admin panel.

## Commands

### Backend (.NET 8)
```bash
# Run the API (Swagger at http://localhost:5193/swagger)
dotnet run --project EliteBackend/EliteFit.Api

# Build solution
dotnet build EliteBackend/EliteFit.sln

# EF Core migrations (run from solution root)
dotnet ef migrations add <MigrationName> --project EliteBackend/EliteFit.Persistence --startup-project EliteBackend/EliteFit.Api
dotnet ef database update --project EliteBackend/EliteFit.Persistence --startup-project EliteBackend/EliteFit.Api
```

### Frontend (React + Vite)
```bash
cd EliteFront
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Architecture

### Backend — Clean Architecture (5 layers)

```
EliteFit.Api          → Controllers, middleware, DI registration (Program.cs)
EliteFit.Application  → MediatR handlers, DTOs, FluentValidation validators, AutoMapper profiles
EliteFit.Domain       → Entities, interfaces, base classes (no external dependencies)
EliteFit.Infrastructure → IJwtTokenService, IPasswordService, IEmailService, IFileStorageService
EliteFit.Persistence  → EF Core DbContext, generic + specialized repositories
```

**Dependency rule**: all layers depend inward toward Domain; Domain has zero external dependencies.

### CQRS via MediatR

All API operations go through MediatR. The pipeline automatically runs:
1. **ValidationBehavior** — FluentValidation validators for the request
2. **CachingBehavior** — distributed memory cache (opt-in per query)

Feature handlers live in `EliteFit.Application/Features/` organized as `{Feature}/{Commands|Queries}/{Handler}.cs`.

### Dual-Database Strategy

- **MySQL** (via Pomelo EF Core) — all transactional data; snake_case table naming convention in `ApplicationDbContext`
- **MongoDB** — audit logs (`AuditLog`) and read-optimized models; accessed via `MongoDbContext`

For recipes, there are separate **command** (`RecipeAdminRepository`) and **query** (`RecipesQueryRepositories`) repositories following CQRS read/write separation.

### Frontend — React + Vite

Routes are defined in [EliteFront/src/routes.jsx](EliteFront/src/routes.jsx) with three layout contexts:
- **Guest** — unauthenticated pages (Home, Login, Signup, marketing, onboarding)
- **User** — authenticated member pages (Dashboard, Workouts, Nutrition, Achievements)
- **Staff** — admin panel (User Management, CMS, Analytics)

All page components use lazy loading via `React.lazy` + `Suspense`. Role-specific layouts wrap the nested routes.

### Authentication

JWT Bearer tokens (60-minute expiry) issued by `IJwtTokenService`. Refresh tokens stored in the database. Password reset uses a secure token flow. CORS is currently set to AllowAll (development only).

## Key Configuration

Backend ports: HTTP `5193`, HTTPS `7049`. Frontend dev server: `5173`.

Sensitive config (`Jwt:Secret`, database passwords) must be set via environment variables or `appsettings.Development.json` (git-ignored). Do not commit credentials.

The connection string in `appsettings.json` targets `AERO14\SQLEXPRESS` — update for your environment.

## Domain Entities

Major entity groups in `EliteFit.Domain/Entities/`:
- **Auth/Users**: `User`, `UserProfile`, `UserRole`, `RefreshToken`, `PasswordResetToken`
- **Fitness**: `WorkoutVideo`, `ExerciseCategory`, `Recipe`, `RecipeAllergenInfo`
- **Goals & Gamification**: `Goal`, `UserGoal`, `Badge`, `UserBadge`, `UserStreak`, `Notification`
- **Allergies**: `Allergy`, `UserAllergy`
- **System**: `Role`, `Permission`, `RolePermission`, `FileEntity`, `Setting`, `AuditLog`

All entities extend `BaseEntity` which provides `Id`, `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`.

## Notes

- Code comments in the repository are written in **Albanian**.
- The `IEmailService` is implemented but disabled (`Email:Enabled: false` in config).
