# Production Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://pssmv2020_db_user:7ETuWyzn45sHEqZ2@cluster0.tfid0vg.mongodb.net/ieee_sps_gujarat?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Initialize Users
```bash
cd backend
npm run init-users
```

### 4. Start Backend
```bash
npm run dev
```

## Frontend Setup

### 1. Environment Variables
Update `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Start Frontend
```bash
npm run dev
```

## Production Accounts

### Super Administrator
- **Email**: `prashantchettiyar@ieee.org`
- **Password**: `admin123`
- **Access**: Full system control

### Branch Administrators
- **DAIICT**: `admin@daiict.ac.in` / `admin123`
- **IIT Gandhinagar**: `admin@iitgn.ac.in` / `admin123`
- **NIT Surat**: `admin@nitsurat.ac.in` / `admin123`

## Security Features

- ✅ **JWT Authentication** with secure tokens
- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **Token Expiration** (7 days default)
- ✅ **Role-based Access Control**
- ✅ **Permission System**
- ✅ **Automatic Token Refresh**
- ✅ **Secure Headers** with Helmet

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Protected Routes
All existing routes now require authentication:
- `/api/events/*` - Events management
- `/api/members/*` - Members management
- `/api/content/*` - Content management
- `/api/research/*` - Research management
- `/api/admin/*` - Admin functions

## Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum),
  organization: String,
  branch_id: String,
  permissions: [String],
  is_active: Boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date
}
```

## Production Deployment

### 1. Environment Variables
Set secure values for:
- `JWT_SECRET` - Use a strong, random secret
- `MONGODB_URI` - Production MongoDB connection
- `NODE_ENV=production`

### 2. Security Considerations
- Change default passwords
- Use HTTPS in production
- Set up proper CORS origins
- Enable rate limiting
- Set up monitoring and logging

### 3. Database Backup
- Regular MongoDB backups
- User data export/import capabilities
- Audit logging for admin actions