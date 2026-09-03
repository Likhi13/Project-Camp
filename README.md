# Project Camp

A full-stack collaborative project management application built to help teams organize projects, manage members, track tasks and subtasks, maintain project notes, and securely manage user accounts.

## Features

- User registration and login
- JWT authentication with access and refresh tokens
- HTTP-only authentication cookies
- Email verification
- Resend verification email
- Forgot/reset password functionality
- Secure password change
- Role-based access control
- Project creation and management
- Project member management
- Project role management
- Task management
- Task assignment
- Task status tracking
- Subtask management
- Project notes
- Task file attachments
- User avatar uploads
- Profile settings
- Light/dark theme
- API health check

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Nodemailer
- CORS

---

## User Roles

Project Camp uses three levels of role-based access control:

| Role | Description |
|---|---|
| `admin` | Full system and project access |
| `project_admin` | Administrative access within assigned projects |
| `member` | Basic project access |

### Permission Overview

| Feature | Admin | Project Admin | Member |
|---|:---:|:---:|:---:|
| Create Project | ✓ | ✗ | ✗ |
| Update Project | ✓ | ✗ | ✗ |
| Delete Project | ✓ | ✗ | ✗ |
| Manage Project Members | ✓ | ✗ | ✗ |
| Create Tasks | ✓ | ✓ | ✗ |
| Update Tasks | ✓ | ✓ | ✗ |
| Delete Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |
| Create Subtasks | ✓ | ✓ | ✗ |
| Update Subtask Status | ✓ | ✓ | ✓ |
| Delete Subtasks | ✓ | ✓ | ✗ |
| Create Notes | ✓ | ✗ | ✗ |
| Update Notes | ✓ | ✗ | ✗ |
| Delete Notes | ✓ | ✗ | ✗ |
| View Notes | ✓ | ✓ | ✓ |

> Authorization is enforced on the backend. Frontend role-based controls only determine which actions are displayed to the user.

---

## Core Functionality

### Authentication

Project Camp provides a complete authentication and account-management flow.

Users can:

- Register an account
- Verify their email
- Log in
- Log out
- Refresh their access token
- Change their password
- Request a password reset
- Reset a forgotten password
- Resend email verification

New accounts are created as unverified and must complete email verification.

---

### Dashboard

The Dashboard provides an overview of the user's accessible projects and serves as the primary entry point into the application.

---

### Projects

Admins can:

- Create projects
- Update projects
- Delete projects

Users can:

- View accessible projects
- Open individual project details
- View project information

---

### Team Members

Admins can manage project membership.

Functionality includes:

- Add members using email
- View project members
- Assign project roles
- Update member roles
- Remove members

Available project roles:

```text
Admin
Project Admin
Member
```

---

### Tasks

Tasks are associated with projects and can be assigned to project members.

Task functionality includes:

- Create tasks
- View tasks
- View task details
- Update tasks
- Delete tasks
- Assign tasks
- Track task status
- Add file attachments

Task statuses:

```text
todo
in_progress
done
```

---

### Subtasks

Tasks can contain multiple subtasks.

Subtask functionality includes:

- Create subtasks
- Update subtasks
- Delete subtasks
- Track completion status

Members can update permitted subtask completion information.

---

### Project Notes

Projects can contain notes for project-related information.

All authorized project users can view notes.

Only Admins can:

- Create notes
- Update notes
- Delete notes

---

### File Uploads

Project Camp supports file uploads using Multer.

Supported uploads include:

- Task attachments
- User profile avatars

Uploaded files include relevant metadata such as:

- URL
- MIME type
- File size

---

### Profile Settings

Users can manage their account through Profile Settings.

Available functionality:

- Update full name
- Update username
- Upload/change avatar
- View email address
- View email verification status
- Resend verification email
- Change password

Username changes are validated to prevent duplicate usernames.

---

### Theme

The frontend supports:

- Light mode
- Dark mode

Theme styling is applied throughout the application.

---

## Application Structure

The project is organized into separate frontend and backend applications.

```text
Project Camp
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── ...
│   └── ...
│
├── PRD.md
└── README.md
```

---

## API

The backend API is versioned under:

```text
/api/v1
```

### Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/current-user
POST   /api/v1/auth/change-password
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/verify-email/:verificationToken
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:resetToken
POST   /api/v1/auth/resend-email-verification
```

### Projects

```text
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:projectId
PUT    /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId
```

Project member management:

```text
GET    /api/v1/projects/:projectId/members
POST   /api/v1/projects/:projectId/members
PUT    /api/v1/projects/:projectId/members/:userId
DELETE /api/v1/projects/:projectId/members/:userId
```

### Tasks

```text
GET    /api/v1/tasks/:projectId
POST   /api/v1/tasks/:projectId
GET    /api/v1/tasks/:projectId/t/:taskId
PUT    /api/v1/tasks/:projectId/t/:taskId
DELETE /api/v1/tasks/:projectId/t/:taskId
POST   /api/v1/tasks/:projectId/t/:taskId/subtasks
PUT    /api/v1/tasks/:projectId/st/:subTaskId
DELETE /api/v1/tasks/:projectId/st/:subTaskId
```

### Notes

```text
GET    /api/v1/notes/:projectId
POST   /api/v1/notes/:projectId
GET    /api/v1/notes/:projectId/n/:noteId
PUT    /api/v1/notes/:projectId/n/:noteId
DELETE /api/v1/notes/:projectId/n/:noteId
```

### Health Check

```text
GET /api/v1/healthcheck/
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas database

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

EMAIL_VERIFICATION_REDIRECT_URL=http://localhost:5173/verify-email
FORGOT_PSWD_REDIRECT_URL=http://localhost:5173/reset-password

CORS_ORIGIN=http://localhost:5173
```

Start the backend in development:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8000/api/v1
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at the local Vite development URL.

---

## Environment Variables

### Backend

The backend requires environment variables for:

- MongoDB connection
- JWT access token configuration
- JWT refresh token configuration
- Email service configuration
- Frontend redirect URLs
- CORS configuration
- Server configuration

### Frontend

The frontend uses:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

For production, this should be replaced with the deployed backend API URL.

---

## Authentication Flow

```text
Register
   ↓
Verification Email
   ↓
Verify Email
   ↓
Login
   ↓
Access Token + Refresh Token
   ↓
Protected Application
```

### Password Recovery Flow

```text
Forgot Password
   ↓
Reset Email
   ↓
Reset Token
   ↓
New Password
   ↓
Password Updated
```

---

## Security

Project Camp implements:

- JWT authentication
- Access and refresh tokens
- HTTP-only cookies
- Password hashing
- Email verification
- Password reset tokens
- Token expiration
- Role-based authorization
- Protected API routes
- Input validation
- Password-change validation
- File upload restrictions
- CORS configuration

Sensitive environment variables and credentials should never be committed to GitHub.

---

## Database

MongoDB is used as the primary database.

The application stores information for:

- Users
- Projects
- Project members
- Tasks
- Subtasks
- Notes

---

## Deployment

The frontend and backend can be deployed separately.

Recommended deployment architecture:

```text
React Frontend
      ↓
   Vercel
      ↓
Express REST API
      ↓
   Render
      ↓
MongoDB Atlas
```

For production:

1. Deploy the backend.
2. Configure backend environment variables.
3. Configure production CORS settings.
4. Configure production authentication cookie settings.
5. Deploy the frontend.
6. Set `VITE_API_URL` to the deployed backend API.
7. Configure email verification and password-reset redirect URLs.
8. Test authentication, file uploads, and protected routes.

---

## Project Documentation

For detailed product requirements, see:

```text
PRD.md
```

The PRD covers:

- Product requirements
- User roles
- Frontend requirements
- Backend requirements
- API endpoints
- Permission matrix
- Data models
- Security requirements
- Deployment requirements
- Success criteria

---

## Future Improvements

Potential future improvements include:

- Real-time collaboration
- Notifications
- Task due dates
- Task reminders
- Search and filtering
- Project activity logs
- Dashboard analytics
- Drag-and-drop task boards
- Pagination
- Real-time task updates
- Cloud-based file storage
- More granular permissions

---

## License

This project is currently intended as a portfolio and project-management application.