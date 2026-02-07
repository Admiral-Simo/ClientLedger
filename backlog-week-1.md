# 📅 Next Week's Backlog: "Refinement & Expansion"
Now that the "Skeleton" is strong, next week is about adding Muscle and Skin. We want to turn this from a "Functional App" into a "Professional SaaS."

Theme: User Customization & Professional Polish

## 🎫 Ticket #1: Dynamic User Profile & Settings
-> The Problem: Right now, the PDF Invoice says "ClientLedger Inc." and "admin@clientledger.com" (hardcoded).

-> The Business Value: Users can't use this for their business unless their name is on the invoice.

The Task:

- Create a Settings Page (/dashboard/settings).

- Add fields: Company Name, Address, Tax ID, Phone.

- Save this to a new UserProfile table in RDS linked to Cognito Sub.

Backend: Update PdfService to read from this User Profile instead of hardcoded strings.

## 🎫 Ticket #2: Search & Filter (The "Power User" Feature)
The Problem: As soon as a user adds 10+ contracts, the dashboard becomes a scroll-fest.

-> The Business Value: Efficiency. Users need to find "That one unpaid contract from John" instantly.

The Task:

- Add a Search Bar to the Dashboard (Filter by Client Name or Contract Title).

- Add Filter Chips: "Show Only Overdue", "Show Only Drafts".

- Implement this filtering on the Frontend first (easier), or move to Backend filtering if you feel ambitious.

## 🎫 Ticket #3: The "Send Invoice" Feature (AWS SES Integration)
The Problem: Downloading a PDF is great, but users want to email it directly to the client.

-> The Business Value: Automation. You save the user a step (download -> open gmail -> attach -> send).

The Task:

- Terraform: Add AWS SES (Simple Email Service) to your infrastructure.

- Backend: Create an endpoint POST /api/contracts/{id}/email.

- Logic: Generate the PDF in memory, attach it to an email, and send it to client.email.

## 🎫 Ticket #4: Global Toast Notifications (UX Polish)
-> The Problem: alert("Saved!") is ugly and blocks the screen.

-> The Business Value: Perceived Quality. Smooth notifications make the app feel expensive.

The Task:

- Install sonner or react-hot-toast (Shadcn uses Sonner).

- Replace all alert() and confirm() calls with beautiful, non-blocking Toasts (Success, Error, Loading).

# Schedule

Sunday: Settings Page & Profile DB. (Get the PDF looking real).

Sunday: Search & Filter. (Make the dashboard feel snappy).

Monday: AWS SES Setup. (This is the tricky DevOps part).

Tuesday: Email Backend Logic. (Sending the actual emails).

Wednesday: UX Polish (Toasts) & Bug Fixes.
