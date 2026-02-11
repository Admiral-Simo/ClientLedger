-- CLIENTS (IDs start at 100)
INSERT INTO clients (id, name, email, country, default_currency, owner_id)
VALUES
    (100, 'TechStart Solutions', 'billing@techstart.io', 'USA', 'USD', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (101, 'Casablanca Creative', 'hello@casa-creative.ma', 'Morocco', 'MAD', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (102, 'German Health GmbH', 'contact@ghealth.de', 'Germany', 'EUR', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (103, 'Dubai FinTech', 'info@dubaifintech.ae', 'UAE', 'USD', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (104, 'London Law LLP', 'accounts@londonlaw.uk', 'UK', 'GBP', '31e990ae-a0f1-702d-feff-9443c3e0d1c7');

-- CONTRACTS (Now includes created_at)
INSERT INTO contracts (id, title, total_value, currency, status, client_id, owner_id, created_at)
VALUES
-- TechStart Solutions (Client 100) - Long term client
(100, 'SaaS Backend MVP', 5000.00, 'USD', 'PAID', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-01-10 10:00:00'),
(101, 'Q1 Maintenance', 1500.00, 'USD', 'PAID', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-02-01 09:30:00'),
(102, 'API Integration (Stripe)', 2500.00, 'USD', 'PENDING', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-03-15 14:00:00'),
(103, 'AWS Migration', 4000.00, 'USD', 'DRAFT', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', CURRENT_TIMESTAMP),

-- Casablanca Creative (Client 101) - Local projects
(104, 'E-commerce Website', 12000.00, 'MAD', 'OVERDUE', 101, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-01-05 11:00:00'),
(105, 'Mobile App UI Design', 8500.00, 'MAD', 'PAID', 101, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-01-20 16:45:00'),
(106, 'SEO Optimization', 3000.00, 'MAD', 'PENDING', 101, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-02-10 09:00:00'),

-- German Health GmbH (Client 102) - High value
(107, 'Patient Data Security Audit', 3200.00, 'EUR', 'PAID', 102, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-02-05 13:00:00'),
(108, 'GDPR Compliance Consulting', 4500.00, 'EUR', 'PENDING', 102, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-03-01 10:30:00'),
(109, 'Legacy System Upgrade', 15000.00, 'EUR', 'DRAFT', 102, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', CURRENT_TIMESTAMP),

-- Dubai FinTech (Client 103) - Fast turnaround
(110, 'Blockchain Prototype', 8000.00, 'USD', 'PAID', 103, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-01-15 08:00:00'),
(111, 'Smart Contract Audit', 6000.00, 'USD', 'OVERDUE', 103, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-02-20 17:00:00'),

-- London Law LLP (Client 104)
(112, 'Legal CRM Setup', 2500.00, 'GBP', 'PAID', 104, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-01-25 12:00:00'),
(113, 'Email Server Migration', 1800.00, 'GBP', 'PENDING', 104, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', '2025-03-05 15:00:00'),
(114, 'Cybersecurity Retainer', 1000.00, 'GBP', 'DRAFT', 104, '31e990ae-a0f1-702d-feff-9443c3e0d1c7', CURRENT_TIMESTAMP);