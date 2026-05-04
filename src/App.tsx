import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { AppShell } from './layout/AppShell'

// Import all page components
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DoctorsPage from './pages/DoctorsPage'
import PatientsPage from './pages/PatientsPage'
import CasesPage from './pages/CasesPage'
import PendingAppointmentsPage from './pages/PendingAppointmentsPage'
import MyAppointmentsPage from './pages/MyAppointmentsPage'
import UsersPage from './pages/UsersPage'
import ExportsPage from './pages/ExportsPage'
import DoctorAvailabilityPage from './pages/DoctorAvailabilityPage'
import AdminStatsPage from './pages/AdminStatsPage'

/**
 * Main application router configuration
 * Routes are organized by authentication and role-based access control:
 * - Public routes: login, register, unauthorized
 * - ADMIN_DOCTOR routes: pending appointments management
 * - ADMIN routes: doctors, users, exports, statistics
 * - ADMIN_DOCTOR routes: patient/case/appointment management
 * - PATIENT routes: personal appointments
 * - DOCTOR routes: availability settings
 * - DOCTOR_PATIENT routes: personal exports
 */
export default function App() {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />

      {/* ADMIN and DOCTOR only: pending appointments */}
      <Route element={<RequireAuth roles={['ADMIN', 'DOCTOR']} />}>
        <Route path="/pending-appointments" element={
          <AppShell>
            <PendingAppointmentsPage />
          </AppShell>
        } />
      </Route>

      {/* All authenticated routes wrapped with app shell and navigation */}
      <Route element={<RequireAuth />}>
        {/* Dashboard accessible to all authenticated users */}
        <Route
          path="/"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />

        {/* ADMIN only: doctor, user, and report management */}
        <Route element={<RequireAuth roles={['ADMIN']} />}>
          <Route path="/doctors" element={<AppShell><DoctorsPage /></AppShell>} />
          <Route path="/users" element={<AppShell><UsersPage /></AppShell>} />
          <Route path="/exports" element={<AppShell><ExportsPage mode="ADMIN" /></AppShell>} />
        </Route>

        {/* ADMIN and DOCTOR: patient, case, and appointment management */}
        <Route element={<RequireAuth roles={['ADMIN', 'DOCTOR']} />}>
          <Route path="/patients" element={<AppShell><PatientsPage /></AppShell>} />
          <Route path="/cases" element={<AppShell><CasesPage /></AppShell>} />
          <Route path="/appointments" element={<AppShell><PendingAppointmentsPage /></AppShell>} />
        </Route>

        {/* PATIENT only: personal appointments */}
        <Route element={<RequireAuth roles={['PATIENT']} />}>
          <Route path="/my-appointments" element={<AppShell><MyAppointmentsPage /></AppShell>} />
        </Route>

        {/* DOCTOR and PATIENT: personal exports */}
        <Route element={<RequireAuth roles={['DOCTOR', 'PATIENT']} />}>
          <Route path="/exports-mine" element={<AppShell><ExportsPage mode="MINE" /></AppShell>} />
        </Route>

        {/* DOCTOR only: manage clinic availability */}
        <Route element={<RequireAuth roles={['DOCTOR']} />}>
          <Route path="/availability" element={<AppShell><DoctorAvailabilityPage /></AppShell>} />
        </Route>

        {/* ADMIN only: view system statistics */}
        <Route element={<RequireAuth roles={['ADMIN']} />}>
          <Route path="/admin-stats" element={<AppShell><AdminStatsPage /></AppShell>} />
        </Route>
      </Route>
    </Routes>
  )
}