# 📅 Sprint 3 Backlog: "The Growth Engine"
Now that the product is "Professional," we need to focus on Scale and Intelligence. Sprint 3 is about giving the user insights and automation.

Theme: Analytics & Automated Workflows

## 🎫 Ticket #1: The "Visual Analytics" Dashboard
-> The Problem: The current "Stats Cards" are okay, but they don't show trends. "Am I making more money than last month?"

-> The Business Value: Retention. Users log in just to see the pretty charts. It makes them feel successful.

The Task:

- Frontend: Install Recharts (or stick with your Pie Chart library).

- Backend: Create an endpoint GET /api/stats/revenue-over-time.

- UI: Add a Bar Chart showing "Monthly Revenue" (Jan, Feb, Mar).

- Logic: Calculate grouped sums by month in Java/SQL.

## 🎫 Ticket #2: Automated "Overdue" Reminders (Cron Jobs)
-> The Problem: Clients forget to pay. Freelancers hate chasing them.

-> The Business Value: "Set and Forget." The app does the awkward "Hey, you owe me money" conversation for them.

The Task:

- Backend (Spring Boot): Implement a @Scheduled task (Cron Job) that runs every morning at 9 AM.

- Logic: Find all contracts where status = ACTIVE and dueDate < TODAY.

- Action: Automatically send an email template: "Reminder: Invoice #123 is Overdue."

- Flag: Add a "Reminded On" date column so we don't spam them daily.

## 🎫 Ticket #3: Client "Portal" (The "Wow" Factor)
-> The Problem: Clients constantly email: "Can you send me that invoice again?"

-> The Business Value: Self-Service. You save the freelancer time by letting the client help themselves.

The Task:

- Public Route: Create a public, read-only page: /p/invoice/{uuid}.

- Security: Use a GUID (UUID) so it's unguessable but doesn't require login.

- View: A simple page where the client can see the Invoice Amount, Status, and click "Download PDF."

- Terraform: Ensure this route is open (not blocked by Cognito).

## 🎫 Ticket #4: Database Backups & Monitoring (DevOps Hygiene)
-> The Problem: If you deploy a bad update and corrupt the DB, it's game over.

-> The Business Value: Business Continuity.

The Task:

- Terraform: Enable RDS Automated Backups (7-day retention).

- CloudWatch: Set up an Alarm if "5xx Errors" > 5 in 1 minute (alerts your email).

- Why: This proves you are ready for paying customers.

# 🚀 Schedule (Sprint 3)
Monday: Ticket #1: Visual Analytics (Bar Charts). (High visual impact).

Tuesday: Ticket #4: DB Backups & Alarms. (Eat the vegetables before dessert).

Wednesday: Ticket #3: Public Client Portal (Part 1 - Backend UUIDs).

Thursday: Ticket #3: Public Client Portal (Part 2 - Frontend View).

Friday: Ticket #2: Automated Cron Jobs (The "Magic")
