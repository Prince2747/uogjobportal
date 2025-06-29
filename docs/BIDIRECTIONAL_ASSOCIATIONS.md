# Bidirectional One-to-One Association Examples
## University of Gondar Job Portal System
### 2024

## 4.2.1 Bidirectional One-to-One Association Implementation

### User ↔ Account Association
```
    1        1
User ←→ Account
```

#### TypeScript Implementation

```typescript
// User class with bidirectional Account relationship
export class User {
  private account: Account;
  private id: string;
  private name: string;
  private email: string;
  private role: UserRole;

  constructor(id: string, name: string, email: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.account = new Account(this);
  }

  public getAccount(): Account {
    return this.account;
  }

  public setAccount(account: Account): void {
    if (this.account !== account) {
      const oldAccount = this.account;
      this.account = account;
      if (oldAccount !== null) {
        oldAccount.setOwner(null);
      }
      if (account !== null) {
        account.setOwner(this);
      }
    }
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }
}

// Account class with bidirectional User relationship
export class Account {
  private owner: User;
  private sessionToken: string;
  private provider: string;
  private providerAccountId: string;
  private accessToken: string;

  constructor(owner: User) {
    this.owner = owner;
    this.sessionToken = this.generateSessionToken();
    this.provider = "credentials";
    this.providerAccountId = owner.getId();
  }

  public getOwner(): User {
    return this.owner;
  }

  public setOwner(owner: User): void {
    if (this.owner !== owner) {
      const oldOwner = this.owner;
      this.owner = owner;
      if (oldOwner !== null) {
        oldOwner.setAccount(null);
      }
      if (owner !== null) {
        owner.setAccount(this);
      }
    }
  }

  public getSessionToken(): string {
    return this.sessionToken;
  }

  public getProvider(): string {
    return this.provider;
  }

  private generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR", 
  DEPARTMENT = "DEPARTMENT",
  APPLICANT = "APPLICANT"
}
```

### Application ↔ ApplicationStatus Association
```
      1           1
Application ←→ ApplicationStatus
```

#### TypeScript Implementation

```typescript
// Application class with bidirectional ApplicationStatus relationship
export class Application {
  private applicationStatus: ApplicationStatus;
  private id: string;
  private userId: string;
  private jobId: string;
  private submissionDate: Date;
  private documents: string[];

  constructor(id: string, userId: string, jobId: string) {
    this.id = id;
    this.userId = userId;
    this.jobId = jobId;
    this.submissionDate = new Date();
    this.documents = [];
    this.applicationStatus = new ApplicationStatus(this);
  }

  public getApplicationStatus(): ApplicationStatus {
    return this.applicationStatus;
  }

  public setApplicationStatus(status: ApplicationStatus): void {
    if (this.applicationStatus !== status) {
      const oldStatus = this.applicationStatus;
      this.applicationStatus = status;
      if (oldStatus !== null) {
        oldStatus.setApplication(null);
      }
      if (status !== null) {
        status.setApplication(this);
      }
    }
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getJobId(): string {
    return this.jobId;
  }

  public getSubmissionDate(): Date {
    return this.submissionDate;
  }

  public addDocument(document: string): void {
    this.documents.push(document);
  }

  public getDocuments(): string[] {
    return [...this.documents];
  }
}

// ApplicationStatus class with bidirectional Application relationship
export class ApplicationStatus {
  private application: Application;
  private status: StatusType;
  private lastUpdated: Date;
  private reviewerNotes: string;
  private reviewerId: string;

  constructor(application: Application) {
    this.application = application;
    this.status = StatusType.PENDING;
    this.lastUpdated = new Date();
    this.reviewerNotes = "";
  }

  public getApplication(): Application {
    return this.application;
  }

  public setApplication(application: Application): void {
    if (this.application !== application) {
      const oldApplication = this.application;
      this.application = application;
      if (oldApplication !== null) {
        oldApplication.setApplicationStatus(null);
      }
      if (application !== null) {
        application.setApplicationStatus(this);
      }
    }
  }

  public getStatus(): StatusType {
    return this.status;
  }

  public updateStatus(newStatus: StatusType, reviewerId: string, notes: string): void {
    this.status = newStatus;
    this.reviewerId = reviewerId;
    this.reviewerNotes = notes;
    this.lastUpdated = new Date();
  }

  public getLastUpdated(): Date {
    return this.lastUpdated;
  }

  public getReviewerNotes(): string {
    return this.reviewerNotes;
  }

  public getReviewerId(): string {
    return this.reviewerId;
  }
}

enum StatusType {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED", 
  REJECTED = "REJECTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
}
```

### Job ↔ JobRequirements Association
```
   1        1
Job ←→ JobRequirements
```

#### TypeScript Implementation

```typescript
// Job class with bidirectional JobRequirements relationship
export class Job {
  private jobRequirements: JobRequirements;
  private id: string;
  private title: string;
  private description: string;
  private department: string;
  private status: JobStatus;
  private createdAt: Date;
  private deadline: Date;

  constructor(id: string, title: string, description: string, department: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.department = department;
    this.status = JobStatus.ACTIVE;
    this.createdAt = new Date();
    this.jobRequirements = new JobRequirements(this);
  }

  public getJobRequirements(): JobRequirements {
    return this.jobRequirements;
  }

  public setJobRequirements(requirements: JobRequirements): void {
    if (this.jobRequirements !== requirements) {
      const oldRequirements = this.jobRequirements;
      this.jobRequirements = requirements;
      if (oldRequirements !== null) {
        oldRequirements.setJob(null);
      }
      if (requirements !== null) {
        requirements.setJob(this);
      }
    }
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getDepartment(): string {
    return this.department;
  }

  public getStatus(): JobStatus {
    return this.status;
  }

  public setStatus(status: JobStatus): void {
    this.status = status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setDeadline(deadline: Date): void {
    this.deadline = deadline;
  }

  public getDeadline(): Date {
    return this.deadline;
  }
}

// JobRequirements class with bidirectional Job relationship
export class JobRequirements {
  private job: Job;
  private educationLevel: string;
  private experienceYears: number;
  private skills: string[];
  private certifications: string[];
  private languageRequirements: string[];
  private salaryRange: SalaryRange;

  constructor(job: Job) {
    this.job = job;
    this.skills = [];
    this.certifications = [];
    this.languageRequirements = [];
    this.experienceYears = 0;
  }

  public getJob(): Job {
    return this.job;
  }

  public setJob(job: Job): void {
    if (this.job !== job) {
      const oldJob = this.job;
      this.job = job;
      if (oldJob !== null) {
        oldJob.setJobRequirements(null);
      }
      if (job !== null) {
        job.setJobRequirements(this);
      }
    }
  }

  public getEducationLevel(): string {
    return this.educationLevel;
  }

  public setEducationLevel(level: string): void {
    this.educationLevel = level;
  }

  public getExperienceYears(): number {
    return this.experienceYears;
  }

  public setExperienceYears(years: number): void {
    this.experienceYears = years;
  }

  public addSkill(skill: string): void {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  public removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }

  public getSkills(): string[] {
    return [...this.skills];
  }

  public addCertification(certification: string): void {
    if (!this.certifications.includes(certification)) {
      this.certifications.push(certification);
    }
  }

  public getCertifications(): string[] {
    return [...this.certifications];
  }

  public setSalaryRange(range: SalaryRange): void {
    this.salaryRange = range;
  }

  public getSalaryRange(): SalaryRange {
    return this.salaryRange;
  }
}

interface SalaryRange {
  minimum: number;
  maximum: number;
  currency: string;
}

enum JobStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE", 
  CLOSED = "CLOSED",
  DRAFT = "DRAFT"
}
```

### Chat ↔ ChatSession Association
```
   1         1
Chat ←→ ChatSession
```

#### TypeScript Implementation

```typescript
// Chat class with bidirectional ChatSession relationship
export class Chat {
  private chatSession: ChatSession;
  private id: string;
  private hrId: string;
  private applicantId: string;
  private status: ChatStatus;
  private createdAt: Date;
  private messages: ChatMessage[];

  constructor(id: string, hrId: string, applicantId: string) {
    this.id = id;
    this.hrId = hrId;
    this.applicantId = applicantId;
    this.status = ChatStatus.ACTIVE;
    this.createdAt = new Date();
    this.messages = [];
    this.chatSession = new ChatSession(this);
  }

  public getChatSession(): ChatSession {
    return this.chatSession;
  }

  public setChatSession(session: ChatSession): void {
    if (this.chatSession !== session) {
      const oldSession = this.chatSession;
      this.chatSession = session;
      if (oldSession !== null) {
        oldSession.setChat(null);
      }
      if (session !== null) {
        session.setChat(this);
      }
    }
  }

  public getId(): string {
    return this.id;
  }

  public getHrId(): string {
    return this.hrId;
  }

  public getApplicantId(): string {
    return this.applicantId;
  }

  public getStatus(): ChatStatus {
    return this.status;
  }

  public setStatus(status: ChatStatus): void {
    this.status = status;
  }

  public addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  public getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

// ChatSession class with bidirectional Chat relationship
export class ChatSession {
  private chat: Chat;
  private sessionId: string;
  private isActive: boolean;
  private lastActivity: Date;
  private participantCount: number;
  private sessionData: Map<string, any>;

  constructor(chat: Chat) {
    this.chat = chat;
    this.sessionId = this.generateSessionId();
    this.isActive = true;
    this.lastActivity = new Date();
    this.participantCount = 0;
    this.sessionData = new Map();
  }

  public getChat(): Chat {
    return this.chat;
  }

  public setChat(chat: Chat): void {
    if (this.chat !== chat) {
      const oldChat = this.chat;
      this.chat = chat;
      if (oldChat !== null) {
        oldChat.setChatSession(null);
      }
      if (chat !== null) {
        chat.setChatSession(this);
      }
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isSessionActive(): boolean {
    return this.isActive;
  }

  public activateSession(): void {
    this.isActive = true;
    this.updateLastActivity();
  }

  public deactivateSession(): void {
    this.isActive = false;
    this.updateLastActivity();
  }

  public updateLastActivity(): void {
    this.lastActivity = new Date();
  }

  public getLastActivity(): Date {
    return this.lastActivity;
  }

  public incrementParticipantCount(): void {
    this.participantCount++;
  }

  public decrementParticipantCount(): void {
    if (this.participantCount > 0) {
      this.participantCount--;
    }
  }

  public getParticipantCount(): number {
    return this.participantCount;
  }

  public setSessionData(key: string, value: any): void {
    this.sessionData.set(key, value);
  }

  public getSessionData(key: string): any {
    return this.sessionData.get(key);
  }

  private generateSessionId(): string {
    return `session_${this.chat.getId()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  messageType: MessageType;
}

enum ChatStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  PAUSED = "PAUSED"
}

enum MessageType {
  TEXT = "TEXT",
  FILE = "FILE",
  IMAGE = "IMAGE",
  SYSTEM = "SYSTEM"
}
```

## 4.2.3 Database Implementation of Bidirectional Associations

### User-Account Relationship in Database Schema

```sql
-- User table (Primary entity)
CREATE TABLE User (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191),
  email VARCHAR(191) UNIQUE,
  hashedPassword TEXT,
  role ENUM('ADMIN', 'HR', 'DEPARTMENT', 'APPLICANT') DEFAULT 'APPLICANT',
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3)
);

-- Account table (Related entity with foreign key)
CREATE TABLE Account (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL UNIQUE, -- One-to-one constraint
  type VARCHAR(191) NOT NULL,
  provider VARCHAR(191) NOT NULL,
  providerAccountId VARCHAR(191) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(191),
  scope VARCHAR(191),
  id_token TEXT,
  session_state VARCHAR(191),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE INDEX Account_userId_unique (userId)
);
```

### Application-ApplicationStatus Relationship

```sql
-- Application table (Primary entity)
CREATE TABLE Application (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  jobId VARCHAR(191) NOT NULL,
  submissionDate DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (jobId) REFERENCES Job(id) ON DELETE CASCADE
);

-- ApplicationStatus table (Related entity)
CREATE TABLE ApplicationStatus (
  id VARCHAR(191) PRIMARY KEY,
  applicationId VARCHAR(191) NOT NULL UNIQUE, -- One-to-one constraint
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED') DEFAULT 'PENDING',
  lastUpdated DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  reviewerNotes TEXT,
  reviewerId VARCHAR(191),
  FOREIGN KEY (applicationId) REFERENCES Application(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewerId) REFERENCES User(id),
  UNIQUE INDEX ApplicationStatus_applicationId_unique (applicationId)
);
```

## 4.2.4 Sample Usage and Testing

### User-Account Association Usage

```typescript
// Create a new user with automatic account creation
const user = new User("usr_001", "Mulatu Mekonnen", "mulatu@uog.edu.et", UserRole.APPLICANT);

// Access the automatically created account
const account = user.getAccount();
console.log(`Session Token: ${account.getSessionToken()}`);
console.log(`Account Owner: ${account.getOwner().getName()}`);

// Verify bidirectional relationship
console.log(`User's Account ID: ${user.getAccount().getSessionToken()}`);
console.log(`Account's Owner Name: ${account.getOwner().getName()}`);

// Test relationship integrity
const newAccount = new Account(user);
user.setAccount(newAccount); // This will properly update both sides
```

### Application-ApplicationStatus Association Usage

```typescript
// Create a new application with automatic status creation
const application = new Application("app_001", "usr_001", "job_001");

// Access the automatically created status
const status = application.getApplicationStatus();
console.log(`Initial Status: ${status.getStatus()}`);

// Update application status
status.updateStatus(StatusType.UNDER_REVIEW, "hr_001", "Application meets basic requirements");

// Verify bidirectional relationship
console.log(`Application ID: ${status.getApplication().getId()}`);
console.log(`Status Last Updated: ${application.getApplicationStatus().getLastUpdated()}`);
```

### Job-JobRequirements Association Usage

```typescript
// Create a new job with automatic requirements creation
const job = new Job("job_001", "Associate Professor", "Teaching and research position", "Computer Science");

// Configure job requirements
const requirements = job.getJobRequirements();
requirements.setEducationLevel("PhD in Computer Science");
requirements.setExperienceYears(5);
requirements.addSkill("Machine Learning");
requirements.addSkill("Data Structures");
requirements.addCertification("Teaching Certificate");

// Verify bidirectional relationship
console.log(`Job Title: ${requirements.getJob().getTitle()}`);
console.log(`Required Skills: ${job.getJobRequirements().getSkills().join(", ")}`);
```

This implementation demonstrates proper bidirectional one-to-one associations in the University of Gondar Job Portal system, ensuring data integrity and maintaining referential consistency between related entities.

---

**WEB BASED JOB PORTAL SYSTEM FOR UOG**  
**2024**