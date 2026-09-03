# Product Requirements Document (PRD)

# Project Camp

**Version:** 1.0.0  
**Product Type:** Full-Stack Project Management System

---

## 1. Product Overview

**Product Name:** Project Camp

Project Camp is a full-stack collaborative project management application designed to help teams organize projects, manage team members, track tasks and subtasks, maintain project notes, and securely manage user accounts.

The system consists of a React frontend, a Node.js/Express RESTful backend, and a MongoDB database.

The application provides role-based access control with three user roles:

- **Admin**
- **Project Admin**
- **Member**

Project Camp also provides JWT-based authentication, email verification, password recovery, file uploads, profile management, and light/dark theme support.

---

## 2. Target Users

### 2.1 Admin

Admins have full system and project-level access.

Admins can:

- Create projects
- Update projects
- Delete projects
- Add project members
- Remove project members
- Update member roles
- Create, update, and delete tasks
- Create, update, and delete subtasks
- Create, update, and delete project notes
- View project information

### 2.2 Project Admin

Project Admins have administrative permissions within projects they are assigned to.

Project Admins can:

- View assigned projects
- Create tasks
- Update tasks
- Delete tasks
- Create subtasks
- Delete subtasks
- Update permitted subtask information
- View project members
- View project notes

Project Admins cannot:

- Create projects
- Update projects
- Delete projects
- Manage project members
- Update member roles
- Create, update, or delete project notes

### 2.3 Team Members

Members have basic project access.

Members can:

- View assigned projects
- View project information
- View tasks
- Update permitted subtask completion status
- View project notes

Members cannot:

- Create projects
- Manage project members
- Create, update, or delete tasks
- Create or delete subtasks
- Create, update, or delete project notes

---

## 3. Core Features

### 3.1 User Authentication & Authorization

#### User Registration

Users can create an account using:

- Email
- Username
- Full name
- Password

The registration process must:

- Validate required fields
- Validate password requirements
- Prevent duplicate email addresses
- Prevent duplicate usernames
- Create the account as unverified
- Generate an email verification token
- Send a verification email

#### User Login

Users can authenticate using their email and password.

Successful authentication provides:

- Access token
- Refresh token
- Authenticated user information

Authentication uses JWT tokens and HTTP-only cookies.

#### Email Verification

Users receive a verification email after registration.

The verification process must:

1. Generate a temporary verification token.
2. Send the verification link through email.
3. Allow the user to open the verification link.
4. Validate the verification token and expiry.
5. Mark the user's email as verified.
6. Remove the verification token after successful verification.

Users who have not verified their email are shown an email verification notification inside the application.

Users can request another verification email.

#### Logout

Authenticated users can log out.

Logout must:

- Clear authentication cookies
- Invalidate the stored refresh token

#### Password Management

Authenticated users can change their password using:

- Current password
- New password

The new password must be different from the current password.

Users who forget their password can request a password reset through email.

The password recovery flow consists of:

1. Password reset request
2. Password reset email
3. Password reset token validation
4. New password submission
5. Password update

#### Token Management

The system uses:

- JWT access tokens
- JWT refresh tokens
- Token expiry
- Refresh-token rotation

Expired access tokens can be refreshed using the refresh-token endpoint.

---

### 3.2 Dashboard

The Dashboard provides an overview of the user's accessible projects.

The Dashboard acts as the primary landing page for authenticated users and provides navigation to project-related functionality.

---

### 3.3 Project Management

#### Project Creation

Admins can create projects using:

- Project name
- Project description

The project is associated with the user who created it.

#### Project Listing

Users can view projects they have access to.

The project listing provides:

- Project name
- Project description
- Member information
- Navigation to project details

#### Project Details

Authorized users can view individual project information.

Project details include:

- Project information
- Project members
- Tasks
- Notes

#### Project Updates

Only Admin users can update project information.

#### Project Deletion

Only Admin users can delete projects.

---

### 3.4 Team Member Management

#### Member Addition

Admins can add users to projects using their email address.

When adding a member, the Admin can assign one of the following roles:

- Member
- Project Admin
- Admin

#### Member Listing

Authorized users can view the project's members.

Member information includes:

- Full name
- Username
- Project role

#### Role Management

Admins can update a project member's role.

#### Member Removal

Admins can remove members from a project.

---

### 3.5 Task Management

Tasks belong to projects and can be assigned to project members.

Each task may contain:

- Title
- Description
- Assignee
- Status
- Subtasks
- File attachments
- Creation information
- Update information

#### Task Creation

Admins and Project Admins can create tasks.

Tasks can be assigned to project members.

#### Task Listing

Authorized project users can view tasks belonging to a project.

#### Task Details

Authorized users can view individual task details, including:

- Task information
- Assignee
- Status
- Subtasks
- Attachments

#### Task Updates

Admins and Project Admins can update task information and status.

#### Task Deletion

Admins and Project Admins can delete tasks.

#### Task Assignment

Tasks can be assigned to specific project members.

#### Task Status

Tasks use a three-state status system:

| Status | Description |
|---|---|
| `todo` | Task has not been started |
| `in_progress` | Task is currently being worked on |
| `done` | Task has been completed |

---

### 3.6 Subtask Management

Tasks can contain multiple subtasks.

#### Subtask Creation

Admins and Project Admins can create subtasks under existing tasks.

#### Subtask Updates

Subtasks can be updated according to the user's project role.

Members can update permitted subtask completion information.

#### Subtask Deletion

Admins and Project Admins can delete subtasks.

---

### 3.7 Project Notes

Projects can contain notes for project-related information and collaboration.

#### Note Creation

Only Admins can create project notes.

#### Note Listing

Authorized project users can view project notes.

#### Note Details

Authorized project users can view individual notes.

#### Note Updates

Only Admins can update notes.

#### Note Deletion

Only Admins can delete notes.

---

### 3.8 File Management

Project Camp supports file uploads for project-related functionality.

#### Task Attachments

Tasks support multiple file attachments.

File metadata includes:

- File URL
- MIME type
- File size

#### User Avatars

Users can upload profile avatar images.

Avatar uploads are handled through the backend upload middleware.

Files are stored in the application's public image directory and served through the backend.

---

### 3.9 Profile Settings

Authenticated users have access to a Profile Settings page.

Users can:

- View profile information
- Update full name
- Update username
- Upload/change profile avatar
- View email address
- View email verification status
- Resend email verification
- Change password

Username updates must prevent duplicate usernames.

---

### 3.10 Theme Support

The frontend supports:

- Light mode
- Dark mode

Theme styling is applied consistently across the application interface, including:

- Authentication pages
- Sidebar
- Topbar
- Dashboard
- Projects
- Project details
- Tasks
- Notes
- Members
- Profile settings
- Forms and controls

---

### 3.11 System Health

The backend provides a health-check endpoint for monitoring API availability.

---

## 4. Frontend Requirements

### 4.1 Authentication Pages

The frontend provides:

- Login
- Register
- Verify Email
- Forgot Password
- Reset Password

Authentication forms provide:

- Client-side validation
- Loading states
- Error messages
- Success messages
- Password visibility controls

---

### 4.2 Application Layout

Authenticated users access the application through a shared layout containing:

- Sidebar navigation
- Topbar
- Main content area
- Theme toggle
- Logout functionality
- Email verification banner

The email verification banner is displayed when the authenticated user's email has not been verified.

---

### 4.3 Navigation

The Sidebar provides navigation to:

- Dashboard
- Projects
- Profile Settings

The Sidebar also displays accessible projects.

The Topbar displays the title of the current section and provides:

- Theme toggle
- Logout action

---

### 4.4 Dashboard

The Dashboard provides an overview of accessible projects and acts as the primary entry point into the application.

---

### 4.5 Projects Page

The Projects page provides:

- Project listing
- Project creation for authorized users
- Navigation to project details

---

### 4.6 Project Details Page

The Project Details page provides access to:

- Project information
- Members
- Tasks
- Notes

The available actions depend on the user's project role.

---

### 4.7 Profile Settings Page

The Profile Settings page contains:

#### Profile Section

- Full name
- Username
- Avatar
- Avatar upload

#### Email Section

- Email address
- Verification status
- Resend verification email

#### Password Section

- Current password
- New password
- Password change action

---

## 5. Backend Requirements

The backend provides a RESTful API under:

```text
/api/v1
```

The backend is responsible for:

- Authentication
- Authorization
- User management
- Project management
- Member management
- Task management
- Subtask management
- Notes
- File uploads
- Email functionality
- Password management
- API health monitoring

---

## 6. API Endpoints Structure

### 6.1 Authentication Routes

**Base Route:**

```text
/api/v1/auth/
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Authenticate user |
| POST | `/logout` | Secured | Log out user |
| GET | `/current-user` | Secured | Get current user |
| POST | `/change-password` | Secured | Change password |
| POST | `/refresh-token` | Public | Refresh access token |
| GET | `/verify-email/:verificationToken` | Public | Verify email |
| POST | `/forgot-password` | Public | Request password reset |
| POST | `/reset-password/:resetToken` | Public | Reset password |
| POST | `/resend-email-verification` | Secured | Resend verification email |

---

### 6.2 Project Routes

**Base Route:**

```text
/api/v1/projects/
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Secured | List accessible projects |
| POST | `/` | Secured | Create project |
| GET | `/:projectId` | Secured | Get project details |
| PUT | `/:projectId` | Admin | Update project |
| DELETE | `/:projectId` | Admin | Delete project |
| GET | `/:projectId/members` | Secured | List project members |
| POST | `/:projectId/members` | Admin | Add project member |
| PUT | `/:projectId/members/:userId` | Admin | Update member role |
| DELETE | `/:projectId/members/:userId` | Admin | Remove member |

---

### 6.3 Task Routes

**Base Route:**

```text
/api/v1/tasks/
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:projectId` | Secured | List project tasks |
| POST | `/:projectId` | Admin / Project Admin | Create task |
| GET | `/:projectId/t/:taskId` | Secured | Get task details |
| PUT | `/:projectId/t/:taskId` | Admin / Project Admin | Update task |
| DELETE | `/:projectId/t/:taskId` | Admin / Project Admin | Delete task |
| POST | `/:projectId/t/:taskId/subtasks` | Admin / Project Admin | Create subtask |
| PUT | `/:projectId/st/:subTaskId` | Role-based | Update subtask |
| DELETE | `/:projectId/st/:subTaskId` | Admin / Project Admin | Delete subtask |

---

### 6.4 Note Routes

**Base Route:**

```text
/api/v1/notes/
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:projectId` | Secured | List project notes |
| POST | `/:projectId` | Admin | Create note |
| GET | `/:projectId/n/:noteId` | Secured | Get note details |
| PUT | `/:projectId/n/:noteId` | Admin | Update note |
| DELETE | `/:projectId/n/:noteId` | Admin | Delete note |

---

### 6.5 Health Check

**Base Route:**

```text
/api/v1/healthcheck/
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Return API health status |

---

## 7. Permission Matrix

| Feature | Admin | Project Admin | Member |
|---|---:|---:|---:|
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

Backend authorization is the final source of permission enforcement.

Frontend role-based controls are used to show or hide actions, but security must be enforced on the backend.

---

## 8. Data Models

### 8.1 User

The User model contains:

- Username
- Email
- Full name
- Password
- Avatar
- Email verification status
- Refresh token
- Email verification token
- Email verification expiry
- Password reset token
- Password reset expiry

### 8.2 Project

A Project contains:

- Project name
- Description
- Members
- Creator
- Creation information

### 8.3 Project Member

A Project Member record associates:

- User
- Project
- Project role

### 8.4 Task

A Task contains:

- Title
- Description
- Project
- Assignee
- Status
- Subtasks
- Attachments
- Creation/update information

### 8.5 Subtask

A Subtask belongs to a task and contains:

- Task association
- Project association
- Completion status
- Subtask information

### 8.6 Note

A Note belongs to a project and contains:

- Content
- Creator
- Creation information
- Update information

---

## 9. Security Requirements

Project Camp must implement:

- JWT-based authentication
- Access and refresh tokens
- HTTP-only authentication cookies
- Password hashing
- Email verification tokens
- Password reset tokens
- Token expiration
- Role-based authorization
- Protected API routes
- Input validation
- Password-change validation
- File upload restrictions
- CORS configuration
- Secure credential handling

Sensitive credentials and secrets must not be committed to source control.

Environment variables must be used for:

- Database credentials
- JWT secrets
- Email credentials
- API configuration
- Frontend/backend URLs

---

## 10. File Management

Project Camp supports file uploads through Multer.

### Supported Uploads

- Task attachments
- User avatar images

### File Handling

The system supports:

- File URL tracking
- MIME type tracking
- File size tracking
- File storage
- Upload size restrictions

Uploaded files are stored under the backend's public image directory and exposed through the backend's static file serving configuration.

---

## 11. Error Handling

The application must provide appropriate error handling for:

- Invalid credentials
- Invalid verification tokens
- Expired verification tokens
- Invalid password reset tokens
- Duplicate usernames
- Duplicate email addresses
- Unauthorized requests
- Forbidden actions
- Missing resources
- Invalid project/task IDs
- Failed file uploads
- Server errors

The frontend should provide:

- Loading states
- Error messages
- Success messages
- Empty states
- Confirmation prompts for destructive actions

---

## 12. Non-Functional Requirements

### 12.1 Security

Authentication and authorization must be enforced on protected backend routes.

### 12.2 Maintainability

The application should maintain a clear separation between:

- UI components
- Pages
- API services
- Authentication state
- Project state
- Backend controllers
- Routes
- Middleware
- Models
- Utilities

### 12.3 Responsiveness

The frontend should provide a usable interface across common desktop and mobile screen sizes.

### 12.4 Usability

The application should provide clear navigation, understandable feedback, and role-appropriate controls.

---

## 13. System Architecture

Project Camp follows a full-stack architecture:

```text
                    Project Camp
                         |
          +--------------+--------------+
          |                             |
          v                             v
   React Frontend                Express Backend
          |                             |
          |                         REST API
          |                             |
          +--------------+--------------+
                         |
                         v
                    MongoDB Database
                         |
              +----------+----------+
              |                     |
              v                     v
        Email Service          File Storage
```

### Frontend

Responsible for:

- User interface
- Routing
- Authentication state
- Project management UI
- Task management UI
- Member management UI
- Notes UI
- Profile settings
- API communication
- Role-aware controls
- Theme management

### Backend

Responsible for:

- REST API
- Authentication
- Authorization
- Business logic
- Database operations
- File uploads
- Email delivery
- Password management
- Health checks

### Database

MongoDB stores:

- Users
- Projects
- Project memberships
- Tasks
- Subtasks
- Notes

---

## 14. Development Environment

### Frontend

The frontend is built using React and Vite.

Example development API configuration:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend

The backend is built using Node.js and Express.

Example local API:

```text
http://localhost:8000/api/v1
```

### Database

MongoDB is used as the application's primary database.

---

## 15. Deployment Requirements

The frontend and backend should be deployable independently.

### Frontend Deployment

The React frontend can be deployed using a frontend hosting platform such as Vercel.

### Backend Deployment

The Express backend can be deployed using a Node.js-compatible hosting platform such as Render.

### Database Deployment

MongoDB Atlas can be used for production database hosting.

### Production Configuration

Production environment variables must be configured through the deployment platform.

The frontend must use the deployed backend API URL instead of the local development URL.

CORS and cookie configuration must be updated for the production frontend and backend domains.

---

## 16. Success Criteria

Project Camp is considered successful when:

- Users can register successfully.
- New users are initially marked as unverified.
- Email verification works through verification links.
- Users can resend verification emails.
- Users can log in and log out securely.
- Access tokens can be refreshed.
- Users can change their passwords securely.
- Users cannot change their password to the same current password.
- Users can recover forgotten passwords.
- Admins can create and manage projects.
- Admins can manage project members and roles.
- Project Admins can manage permitted tasks.
- Members can access permitted project information.
- Tasks and subtasks can be created and tracked.
- Project notes enforce Admin-only write permissions.
- File attachments can be uploaded.
- User avatars can be uploaded and displayed.
- Role-based permissions are enforced by the backend.
- Protected routes reject unauthorized requests.
- The frontend provides appropriate loading, error, and success states.
- Light and dark themes work consistently.
- The application can be deployed to a production environment.

---

## 17. Future Enhancements

Potential future improvements include:

- Real-time project collaboration
- Notifications
- Task due dates
- Task reminders
- Search and filtering
- Project activity logs
- Dashboard analytics
- Drag-and-drop task boards
- Pagination for large datasets
- Real-time task updates
- Cloud-based file storage
- More granular project permissions

---

## 18. Conclusion

Project Camp is a full-stack collaborative project management system that combines project organization, task tracking, team management, project notes, file handling, and secure account management.

The application provides a complete workflow from user registration and email verification to project creation, team management, task and subtask tracking, notes, file uploads, and profile management.

The system uses a React frontend, Node.js/Express backend, MongoDB database, JWT authentication, and role-based access control to provide a secure and maintainable project management platform.