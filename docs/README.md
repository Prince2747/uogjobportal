# University of Gondar Job Portal

A comprehensive web application for managing job postings, applications, and recruitment processes at the University of Gondar.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The University of Gondar Job Portal is a modern web application designed to streamline the recruitment process for the university. It provides a centralized platform for posting jobs, managing applications, conducting interviews, and facilitating communication between HR personnel and job applicants.

### Key Objectives
- Digitize the university's recruitment process
- Provide role-based access control for different user types
- Enable real-time communication between HR and applicants
- Support video interviews and document management
- Maintain comprehensive application tracking

## ✨ Features

### Core Features
- **User Authentication & Authorization**: Secure login with role-based access
- **Job Management**: Create, edit, and manage job postings
- **Application Tracking**: Complete application lifecycle management
- **Real-time Chat**: WebSocket-based communication system
- **Video Interviews**: Peer-to-peer video calling functionality
- **Admin Dashboard**: Comprehensive administrative controls
- **Responsive Design**: Mobile-first, responsive user interface

### Advanced Features
- **Multi-language Support**: English and Amharic localization
- **Email Notifications**: Automated email system for updates
- **Search & Filtering**: Advanced job search capabilities
- **Document Management**: Resume and document upload system
- **Analytics Dashboard**: Recruitment metrics and insights

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.3.0 (React 18)
- **Styling**: Tailwind CSS with DaisyUI components
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **State Management**: React hooks and context

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js v4
- **Database ORM**: Prisma
- **Password Hashing**: bcryptjs

### Database
- **Primary Database**: MySQL
- **Caching**: Redis (Upstash)
- **Session Storage**: Database sessions

### Real-time Features
- **WebSockets**: Socket.io
- **Video Calling**: PeerJS
- **Chat System**: Custom implementation with Redis

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm
- **Database Migration**: Prisma Migrate

## 🏗 Architecture

### Project Structure
```
uogjobportal/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── applicant/         # Applicant portal pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Shared components
│   ├── hr/                # HR dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── scripts/              # Database and utility scripts
└── types/                # TypeScript type definitions
```

### Database Architecture
The application uses a relational database with the following key entities:
- **Users**: Core user management with role-based access
- **Jobs**: Job posting management
- **Applications**: Application tracking and status management
- **Chats**: Real-time communication records
- **Sessions**: User session management

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- MySQL database
- Redis instance (for caching and real-time features)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd uogjobportal
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env.local` file:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/uog_job_portal"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Redis
UPSTASH_REDIS_URL="your-redis-url"
UPSTASH_REDIS_TOKEN="your-redis-token"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@uog.edu.et"
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Create admin user (optional)
node scripts/createAdmin.js
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `NEXTAUTH_URL` | Application base URL | Yes |
| `NEXTAUTH_SECRET` | JWT signing secret | Yes |
| `UPSTASH_REDIS_URL` | Redis connection URL | Yes |
| `UPSTASH_REDIS_TOKEN` | Redis authentication token | Yes |
| `SMTP_HOST` | Email server host | No |
| `SMTP_PORT` | Email server port | No |
| `SMTP_USER` | Email username | No |
| `SMTP_PASSWORD` | Email password | No |

### Database Configuration
The application uses Prisma for database management. Key configuration files:
- `prisma/schema.prisma`: Database schema definition
- `prisma/migrations/`: Database migration files

## 👥 User Roles

### 1. Admin (`ADMIN`)
- **Access**: Full system access
- **Capabilities**:
  - User management (create, edit, delete users)
  - System configuration
  - Analytics and reporting
  - Job posting oversight

### 2. HR Personnel (`HR`)
- **Access**: HR dashboard and recruitment tools
- **Capabilities**:
  - Job posting management
  - Application review and processing
  - Candidate communication
  - Interview scheduling
  - Video interviews

### 3. Department Staff (`DEPARTMENT`)
- **Access**: Department-specific features
- **Capabilities**:
  - View department job postings
  - Review applications for department positions
  - Collaborate with HR on hiring decisions

### 4. Job Applicants (`APPLICANT`)
- **Access**: Applicant portal
- **Capabilities**:
  - Browse and search job listings
  - Submit job applications
  - Track application status
  - Communicate with HR
  - Participate in video interviews

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Computer Science"
}
```

#### POST `/api/auth/signin`
Authenticate user credentials.

### Admin Endpoints

#### GET `/api/admin/dashboard`
Retrieve dashboard statistics.

**Response:**
```json
{
  "totalUsers": 150,
  "activeJobs": 25,
  "totalApplications": 300
}
```

#### GET `/api/admin/users`
Retrieve paginated user list with filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `role`: Filter by user role
- `status`: Filter by user status

### HR Endpoints

#### GET `/api/hr/stats`
Retrieve HR-specific statistics.

**Response:**
```json
{
  "totalApplicants": 100,
  "activeJobs": 15,
  "pendingApplications": 45,
  "totalChats": 20
}
```

## 🗄 Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE User (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191),
  email VARCHAR(191) UNIQUE,
  hashedPassword TEXT,
  role ENUM('ADMIN', 'HR', 'DEPARTMENT', 'APPLICANT'),
  isActive BOOLEAN DEFAULT true,
  department VARCHAR(191),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);
```

#### Jobs Table
```sql
CREATE TABLE Job (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  department VARCHAR(191) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'CLOSED'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);
```

#### Applications Table
```sql
CREATE TABLE Application (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  jobId VARCHAR(191) NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (jobId) REFERENCES Job(id)
);
```

## 💻 Development Guide

### Code Organization

#### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
}
```

#### API Route Structure
```typescript
// app/api/example/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // API logic here
    
    return NextResponse.json({ data: "response" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npx prisma studio          # Open database browser
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Generate Prisma client
```

### Testing

#### Manual Testing
- Use the admin account created by `scripts/createAdmin.js`
- Test different user roles and permissions
- Verify real-time features (chat, video calls)

#### Database Testing
```bash
# Count users
node scripts/countUsers.ts

# List all users
node scripts/listUsers.ts
```

## 🚀 Deployment

### Production Build

1. **Environment Setup**
```bash
# Set production environment variables
export NODE_ENV=production
export NEXTAUTH_URL=https://your-domain.com
```

2. **Database Migration**
```bash
npx prisma migrate deploy
```

3. **Build Application**
```bash
npm run build
```

4. **Start Production Server**
```bash
npm start
```

### Deployment Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: Redis for session and chat data
- **Database Optimization**: Prisma query optimization

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make changes and commit**
```bash
git commit -m "Add: your feature description"
```

4. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request**

### Code Standards

- **TypeScript**: Use strict typing
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent code formatting
- **Commit Messages**: Use conventional commit format

### Security Considerations

- **Authentication**: Secure password hashing with bcrypt
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection

## 📞 Support

For technical support or questions:
- **Email**: support@uog.edu.et
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests

## 📄 License

This project is proprietary software developed for the University of Gondar. All rights reserved.

---

**University of Gondar Job Portal** - Connecting talent with opportunity in higher education.