🖥 Patient Tracker – Frontend (Admin & User UI)
📌 Overview
Patient Tracker Frontend is a React + MUI application designed for Admins, Doctors, and Patients.
It integrates seamlessly with the backend via REST APIs and is gateway‑ready for microservices.

🛠 Tech Stack

React
TypeScript
Material‑UI (MUI)
React Query
Axios
JWT Authentication
Vite / CRA


🧭 Application Sections
👤 Admin → User Management
Tabs:
Users | Doctors | Patients

Admins can:

Manage users
Approve / reject doctors
Soft delete, restore, or hard delete doctors & patients
View system stats


🩺 Doctor Management (Admin)

Doctor profiles
Approve / Reject
Soft Delete / Restore
Hard Delete (confirmed)
Availability management
Status indicators:

Pending
Approved
Deleted


Filters:

All / Pending / Approved / Deleted




🧑‍🤝‍🧑 Patient Management (Admin)

Patient profiles
Soft Delete / Restore
Hard Delete (confirmed)
Status visibility
Safe admin actions only


📅 Appointments

View appointments
Role‑specific views:

Patient → My Appointments
Doctor → My Schedule


Availability enforcement handled by backend


📁 Medical Cases

Case CRUD
Case history dialog
Version tracking UI
Immutable audit visibility


📊 Admin Stats

Users count
Doctors count
Patients count
Simple dashboard powered by /api/admin/stats


🧩 UI Patterns & Safety

Admin actions always guarded by confirmation dialogs
Hard delete requires typing DELETE
Soft delete is default
Restore available for all soft‑deleted records
Consistent UX across Users / Doctors / Patients


▶️ Running the Frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173


🔗 API Integration

Frontend points to:

/api/**


Backend handles routing
Ready for API Gateway without UI changes


✅ Current State
✅ Fully functional
✅ Admin‑safe
✅ Backend‑aligned
✅ Gateway‑ready
✅ No rewrites needed for microservices

🔮 Next Phase

API Gateway routing
Auth service separation
Zero frontend changes during migration
