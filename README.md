# Patient Tracker UI

A React + TypeScript single-page application for managing patients, doctors, appointments, and medical cases.

## Overview

This frontend is built with Vite, React 19, TypeScript, Material UI, and React Query.
It supports role-based authentication and authorization with three roles:
- `ADMIN`
- `DOCTOR`
- `PATIENT`

The app expects a backend API available under `/api`, proxied during development to `http://localhost:8080`.

## Features

- JWT authentication with login and registration
- Role-based route protection and navigation
- Admin management for users, doctors, patients, cases, exports, and stats
- Doctor availability scheduling
- Appointment listing and pending appointment workflows
- Excel export links for admin and user-specific reports
- Reusable UI dialogs for confirmation and deletion

## Stack

- React 19
- TypeScript 6
- Vite 4
- MUI 9
- TanStack React Query 5
- React Router 7
- Axios
- dayjs
- React Hook Form
- Zod

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the app at `http://localhost:5173` and ensure the backend API is running on `http://localhost:8080`.

## Build

```bash
npm run build
```

This runs TypeScript build checks and the Vite production build.

## Lint

```bash
npm run lint
```

## Project Structure

- `src/main.tsx` - App entry point and provider setup
- `src/App.tsx` - Route configuration and layout
- `src/auth` - Authentication context, storage, and route protection
- `src/api` - Axios client and typed API endpoint wrappers
- `src/layout` - App shell and navigation menu
- `src/pages` - Feature pages and admin views
- `src/ui` - Shared UI components and dialogs
- `src/types` - TypeScript models for API data

## Authentication Flow

Authentication state is maintained in context:
- Access token and refresh token are stored in `localStorage`
- Axios interceptors attach access tokens and refresh on 401
- Protected routes use `RequireAuth` to enforce login and role access

## Notes

- The application assumes a backend API at `/api`.
- Development server proxies `/api` requests to `http://localhost:8080`.
- The app currently uses frontend routing and UI scaffolding tailored to a patient tracker environment.

## Contributing

If you extend the app, keep the role-based route rules and API wrappers consistent.

## License

This repository is private and unlicensed.
