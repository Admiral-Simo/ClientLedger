-- CLIENTS
INSERT INTO clients (id, name, email, country, default_currency, owner_id)
VALUES
    (100, 'TechStart Solutions', 'thementaliste08@gmail.com', 'USA', 'USD', '01d9204e-30c1-70f3-b784-3631c7b6b4cc'),
    (101, 'Casablanca Creative', 'thementaliste08@gmail.com', 'Morocco', 'MAD', '01d9204e-30c1-70f3-b784-3631c7b6b4cc'),
    (102, 'German Health GmbH', 'thementaliste08@gmail.com', 'Germany', 'EUR', '01d9204e-30c1-70f3-b784-3631c7b6b4cc'),
    (103, 'Dubai FinTech', 'thementaliste08@gmail.com', 'UAE', 'USD', '01d9204e-30c1-70f3-b784-3631c7b6b4cc'),
    (104, 'London Law LLP', 'thementaliste08@gmail.com', 'UK', 'GBP', '01d9204e-30c1-70f3-b784-3631c7b6b4cc');

-- MASSIVE 12-MONTH CONTRACT DATASET FOR VISUAL ANALYTICS
INSERT INTO contracts (id, title, total_value, currency, status, client_id, owner_id, created_at)
VALUES
-- ❄️ JANUARY (Strong Start)
(100, 'SaaS Backend MVP', 5000.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-01-10 10:00:00'),
(101, 'E-commerce Website', 12000.00, 'MAD', 'PAID', 101, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-01-05 11:00:00'),

-- 💘 FEBRUARY (Steady)
(102, 'Q1 Maintenance', 1500.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-02-01 09:30:00'),
(103, 'Patient Data Security Audit', 3200.00, 'EUR', 'PAID', 102, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-02-05 13:00:00'),
(104, 'Smart Contract Audit', 6000.00, 'USD', 'PAID', 103, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-02-20 17:00:00'),

-- 🍀 MARCH (Slight Dip)
(105, 'API Integration (Stripe)', 2500.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-03-15 14:00:00'),
(106, 'GDPR Compliance Consulting', 4500.00, 'EUR', 'PAID', 102, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-03-01 10:30:00'),

-- 🌧️ APRIL (Spring Growth)
(107, 'Cloud Infrastructure Setup', 8500.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-04-12 10:00:00'),
(108, 'Mobile App UI Design', 3000.00, 'MAD', 'PAID', 101, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-04-22 14:00:00'),

-- 🌺 MAY (Pre-Summer Push)
(109, 'Legacy System Upgrade', 15000.00, 'EUR', 'PAID', 102, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-05-05 09:00:00'),
(110, 'SEO Optimization', 2000.00, 'MAD', 'PAID', 101, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-05-18 11:30:00'),

-- ☀️ JUNE (Summer High)
(111, 'Blockchain Prototype', 18000.00, 'USD', 'PAID', 103, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-06-10 16:00:00'),

-- 🏖️ JULY (Summer Dip)
(112, 'Legal CRM Setup', 2500.00, 'GBP', 'PAID', 104, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-07-15 12:00:00'),
(113, 'Server Maintenance', 1000.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-07-28 09:00:00'),

-- 🎒 AUGUST (Ramping back up)
(114, 'Email Server Migration', 4800.00, 'GBP', 'PAID', 104, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-08-05 15:00:00'),
(115, 'Penetration Testing', 6500.00, 'EUR', 'PAID', 102, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-08-20 11:00:00'),

-- 🍂 SEPTEMBER (Solid Month)
(116, 'Custom Dashboard Dev', 9000.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-09-10 10:00:00'),
(117, 'Graphic Design Retainer', 1500.00, 'MAD', 'PAID', 101, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-09-25 14:30:00'),

-- 🎃 OCTOBER (Q4 Budget Spend)
(118, 'Enterprise Security Audit', 14000.00, 'EUR', 'PAID', 102, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-10-08 09:00:00'),

-- 🦃 NOVEMBER (Black Friday Prep)
(119, 'High-Traffic Scaling', 12500.00, 'USD', 'PAID', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-11-12 13:00:00'),
(120, 'Payment Gateway Fix', 3500.00, 'USD', 'PAID', 103, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-11-20 16:00:00'),

-- 🎄 DECEMBER (End of Year Spikes & Outstanding Debts)
(121, 'Full Stack Web App', 22000.00, 'USD', 'PAID', 103, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-12-05 10:00:00'),
(122, 'Q4 Server Costs', 1200.00, 'GBP', 'PAID', 104, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-12-15 11:00:00'),

-- 🚨 PENDING & OVERDUE (To populate the Pie Chart and Warning Cards)
(123, 'Cybersecurity Retainer', 5000.00, 'GBP', 'OVERDUE', 104, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-12-01 09:00:00'),
(124, 'AWS Database Migration', 8000.00, 'USD', 'OVERDUE', 100, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-11-15 14:00:00'),
(125, 'Frontend Refactor', 4500.00, 'MAD', 'PENDING', 101, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', '2026-12-28 10:00:00'),
(126, 'Smart Contract V2', 10000.00, 'USD', 'DRAFT', 103, '01d9204e-30c1-70f3-b784-3631c7b6b4cc', CURRENT_TIMESTAMP);

-- SETTINGS
INSERT INTO settings (id, company_name, address, phone, taxid, owner_id)
VALUES (100, 'ClientLedger Ops', 'Casablanca Tech Hub', '+212 600-000000', 'TAX-999', '01d9204e-30c1-70f3-b784-3631c7b6b4cc');