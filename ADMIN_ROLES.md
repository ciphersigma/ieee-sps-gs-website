# IEEE SPS Gujarat - Role-Based Admin System

## Overview
The admin system now supports role-based authentication with separate dashboards for different types of administrators.

## User Roles

### 1. Super Administrator
- **Email**: `prashantchettiyar@ieee.org` (Primary)
- **Email**: `superadmin@ieee.org` (Demo)
- **Password**: `demo123`
- **Access**: Full system control
- **Dashboard**: Super Admin Dashboard
- **Permissions**: All features including:
  - User management
  - Branch management
  - Database migration
  - System settings
  - All content management

### 2. Student Branch Administrators
Branch admins have access to manage their specific student branch content and events.

#### DAIICT Branch Admin
- **Email**: `admin@daiict.ac.in`
- **Password**: `demo123`
- **Organization**: DAIICT Student Branch
- **Permissions**: events, members, content

#### IIT Gandhinagar Branch Admin
- **Email**: `admin@iitgn.ac.in`
- **Password**: `demo123`
- **Organization**: IIT Gandhinagar Student Branch
- **Permissions**: events, members, content

#### NIT Surat Branch Admin
- **Email**: `admin@nitsurat.ac.in`
- **Password**: `demo123`
- **Organization**: NIT Surat Student Branch
- **Permissions**: events, members (limited access)

## Features

### Super Admin Dashboard
- System-wide statistics
- Branch management tools
- User management (coming soon)
- Database migration tools
- Global content oversight

### Branch Admin Dashboard
- Branch-specific statistics
- Event management for their branch
- Member management for their branch
- Content creation for their branch
- Achievement tracking

## Permission System

### Available Permissions
- `events`: Create and manage events
- `members`: Manage branch members
- `content`: Create and manage content
- `settings`: Configure branch settings
- `all`: Super admin access (all permissions)

### Role Hierarchy
1. **Super Admin**: Has all permissions and can access all features
2. **Student Branch Admin**: Has specific permissions based on their branch needs
3. **Content Manager**: Limited to content management (future role)
4. **Event Manager**: Limited to event management (future role)

## Technical Implementation

### Authentication Context
- Located in `src/contexts/AuthContext.jsx`
- Handles login/logout
- Manages user sessions
- Provides role and permission checking functions

### Protected Routes
- Located in `src/routes/AdminRoutes.jsx`
- Role-based route protection
- Permission-based feature access
- Automatic dashboard selection based on user role

### Dashboard Components
- **SuperAdminDash.jsx**: For super administrators
- **AdminDashboard.jsx**: For student branch administrators

## Usage

1. Navigate to `/admin/login`
2. Use one of the demo accounts listed above
3. The system will automatically redirect to the appropriate dashboard
4. Access to features is controlled by user permissions

## Future Enhancements

- User management interface for super admins
- Branch management system
- Advanced permission granularity
- Audit logging
- Multi-factor authentication
- Password reset functionality

## Development Notes

- All demo accounts use the password `demo123`
- User data is stored in localStorage for demo purposes
- In production, this would integrate with a proper backend authentication system
- The system is designed to be easily extensible for additional roles and permissions