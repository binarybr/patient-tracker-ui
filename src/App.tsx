import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { AppShell } from './layout/AppShell'

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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />

      <Route element={<RequireAuth roles={['ADMIN', 'DOCTOR']} />}>
        <Route path="/pending-appointments" element={
          <AppShell>
            <PendingAppointmentsPage />
          </AppShell>
        } />
      </Route>

      <Route element={<RequireAuth />}>
        <Route
          path="/"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />

        <Route element={<RequireAuth roles={['ADMIN']} />}>
          <Route path="/doctors" element={<AppShell><DoctorsPage /></AppShell>} />
          <Route path="/users" element={<AppShell><UsersPage /></AppShell>} />
          <Route path="/exports" element={<AppShell><ExportsPage mode="ADMIN" /></AppShell>} />
        </Route>

        <Route element={<RequireAuth roles={['ADMIN', 'DOCTOR']} />}>
          <Route path="/patients" element={<AppShell><PatientsPage /></AppShell>} />
          <Route path="/cases" element={<AppShell><CasesPage /></AppShell>} />
          <Route path="/appointments" element={<AppShell><PendingAppointmentsPage /></AppShell>} />
        </Route>

        <Route element={<RequireAuth roles={['PATIENT']} />}>
          <Route path="/my-appointments" element={<AppShell><MyAppointmentsPage /></AppShell>} />
        </Route>

        <Route element={<RequireAuth roles={['DOCTOR', 'PATIENT']} />}>
          <Route path="/exports-mine" element={<AppShell><ExportsPage mode="MINE" /></AppShell>} />
        </Route>

        <Route element={<RequireAuth roles={['DOCTOR']} />}>
          <Route path="/availability" element={<AppShell><DoctorAvailabilityPage /></AppShell>} />
        </Route>

        <Route element={<RequireAuth roles={['ADMIN']} />}>
          <Route path="/admin-stats" element={<AppShell><AdminStatsPage /></AppShell>} />
        </Route>
      </Route>
    </Routes>
  )
}