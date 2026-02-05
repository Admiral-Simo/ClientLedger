🚀 Backlog: Next Week (The "Features & Polish" Sprint)
Now that the "plumbing" works, next week is about making it a usable product.

Theme: "CRUD & Visuals"

# Monday: Complete the CRUD (Update & Delete)
Backend: Add endpoints to Delete and Edit Clients and Contracts.

Challenge: If you delete a Client, what happens to their Contracts? (Cascade delete vs. Prevent delete).

Frontend: Add "Trash" icons and "Edit" buttons to the cards.

# Tuesday: Dashboard Analytics (The "SaaS" Feel)
Backend: Create a /stats endpoint.

Calculate: Total Revenue, Total Pending Amount, Number of Active Clients.

Frontend: Add 3 "Scorecards" at the top of the dashboard to display these numbers.

Bonus: Add a simple pie chart (Paid vs. Unpaid).

# Wednesday: Contract Status Workflow
Feature: Allow moving a contract through states: DRAFT → SENT → PAID.

UI: Add a dropdown or status chips on the Contract card to change the status securely.

# Thursday: PDF Generation (The High Value Feature)
Backend: Use a library like OpenPDF or iText to generate a simple PDF invoice when a user clicks "Download".

Endpoint: GET /api/contracts/{id}/pdf.

# Friday: UI/UX Cleanup & Mobile Fix
Styling: Replace the raw HTML buttons with a nice UI library (like Shadcn/UI or standard Tailwind components) so it doesn't look like a prototype.

Mobile Access: Since CloudFront is delayed, we might look at moving the Frontend to AWS Amplify (which gives free HTTPS automatically) to solve the "HTTP on mobile" issue permanently.

What is your preference for Monday? Do you want to start with the Delete/Edit features or jump straight to the Analytics/Stats?
