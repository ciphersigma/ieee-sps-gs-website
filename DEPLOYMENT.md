# Production Deployment Guide

## 🚨 CRITICAL: Before Deployment

### 1. Regenerate ALL Credentials
- **MongoDB**: Create new production database with new credentials
- **Cloudinary**: Create new account or regenerate API keys
- **JWT Secret**: Generate cryptographically secure 256-bit secret

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in production values
3. **NEVER commit .env files**

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install express-rate-limit

# Frontend
cd ../
npm install
```

## 🚀 Deployment Steps

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Set Environment Variables**:
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-256-bit-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-domain.com
```

2. **Deploy**:
```bash
npm run prod
```

### Frontend Deployment (Vercel/Netlify)

1. **Build for Production**:
```bash
npm run build
```

2. **Set Environment Variables**:
```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 🔒 Security Checklist

- [ ] All credentials regenerated
- [ ] .env files not committed
- [ ] HTTPS enabled
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Database access restricted
- [ ] Monitoring set up

## 📊 Monitoring

Set up monitoring for:
- API response times
- Error rates
- Database performance
- File upload success rates
- Authentication attempts

## 🔄 Updates

For future updates:
1. Test in staging environment
2. Backup database
3. Deploy during low-traffic hours
4. Monitor for issues post-deployment