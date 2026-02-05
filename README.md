## Project Summary
**ClientLedger** is a focused SaaS (Software as a Service) solution designed to solve the administrative chaos faced by freelancers and small agencies. It transforms the messy reality of freelance work—scattered WhatsApp agreements, forgotten payment deadlines, and messy Excel sheets—into a streamlined, professional system of record.

## Why it matters
Freelancers are experts in their craft (coding, design, writing), but often amateurs at administration. They face three critical pain points:

## The Solution
🟢 The Solution: ClientLedger
A centralized dashboard that acts as the "Single Source of Truth" for every client interaction.
- It’s not just an invoice generator; it is a Contract Lifecycle Manager.
- It’s not just a to-do list; it is a Financial Health Monitor.

### 💸 Revenue Leakage:
Money is lost because follow-ups on unpaid invoices are forgotten or delayed.

### ⚖️ Scope Creep & Disputes:
Agreements made informally on WhatsApp or email are hard to reference later. "I thought this was included" disputes cost time and money.

### 🧾 Unprofessional Workflows:
Managing million-dollar skills with messy spreadsheets or text messages damages client trust.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend       | Next.js                        |
| Backend        | Java Spring Boot               |
| Database       | AWS RDS                        |
| Infrastructure | Terraform                      |
| Deployment     | AWS Cloud With CI/CD workflows |

## Cloud Architecture Diagram
![picture](screenshots/cloud-architecture.png)

## Database MVP Diagram
![picture](screenshots/database-mvp-diagram.png)

## Instructions to run the Application Locally
make sure you inject those environment variables in your local environment before running the application:

```bash
export DATABASE_URL="your_database_url
```

## Instructions to push the application to your AWS Environment

you must create in the infrastructure folder a file called `terraform.tfvars` and inject the following variables:

1: Navigate to the `infrastructure` directory and create the `terraform.tfvars` file:
```bash
cd infrastructure
touch terraform.tfvars
```

2: Add the following variables to the `terraform.tfvars` file:
```terraform
db_username          = "your_choosen_username"
db_password          = "your_choosen_password"
security_group_id    = "your_security_group_id"
db_subnet_group_name = "your_db_subnet_group_name"
```

3: Initialize Terraform:
```bash
terraform init
```

4: Review the planned infrastructure changes:
```bash
terraform plan
```

5: Deploy the infrastructure:
```bash
terraform deploy --auto-approve
```

6. (Optional) To destroy the created infrastructure, run:
```bash
terraform destroy --auto-approve
```
