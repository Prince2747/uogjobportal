# Deployment Guide

## Prerequisites

- Node.js 18+
- MySQL database
- Redis instance
- Domain name (for production)

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key"

# Redis
UPSTASH_REDIS_URL="redis://your-redis-url"
UPSTASH_REDIS_TOKEN="your-redis-token"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@uog.edu.et"
```

## Vercel Deployment (Recommended)

### 1. Prepare Your Repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

### 3. Database Setup
```bash
# Run migrations on production database
npx prisma migrate deploy

# Create admin user
node scripts/createAdmin.js
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/uog_portal
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: uog_portal
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

## Manual Server Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd uogjobportal

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start with PM2
pm2 start npm --name "uog-portal" -- start
pm2 save
pm2 startup
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate Setup

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Migration

### Production Migration
```bash
# Backup existing database
mysqldump -u username -p database_name > backup.sql

# Run migrations
npx prisma migrate deploy

# Verify migration
npx prisma studio
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs uog-portal

# Monitor processes
pm2 monit

# Restart application
pm2 restart uog-portal
```

### Health Checks
Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
}
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_job_status ON Job(status);
CREATE INDEX idx_application_status ON Application(status);
```

### 2. Redis Caching
```typescript
// Implement caching for frequently accessed data
const cachedData = await redis.get(`cache:${key}`);
if (cachedData) {
  return JSON.parse(cachedData);
}

const data = await fetchData();
await redis.setex(`cache:${key}`, 3600, JSON.stringify(data));
```

### 3. CDN Setup
Configure CDN for static assets:
- Images: `/public/images/*`
- Fonts: `/public/fonts/*`
- Icons: `/public/icons/*`

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Application Backup
```bash
# Backup application files
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/app
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database server is running
   - Check firewall settings

2. **Build Failures**
   - Clear `.next` directory
   - Delete `node_modules` and reinstall
   - Check TypeScript errors

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Ensure session storage is working

### Log Analysis
```bash
# Application logs
pm2 logs uog-portal --lines 100

# System logs
sudo journalctl -u nginx -f

# Database logs
sudo tail -f /var/log/mysql/error.log
```