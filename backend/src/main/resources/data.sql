-- CLIENTS (IDs start at 100 to avoid collision with new manual entries)
INSERT INTO clients (id, name, email, country, default_currency, owner_id)
VALUES
    (100, 'TechStart Solutions', 'billing@techstart.io', 'USA', 'USD', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (101, 'Casablanca Creative', 'hello@casa-creative.ma', 'Morocco', 'MAD', '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
    (102, 'German Health GmbH', 'contact@ghealth.de', 'Germany', 'EUR', '31e990ae-a0f1-702d-feff-9443c3e0d1c7');

-- CONTRACTS (Linked to the clients above)
INSERT INTO contracts (id, title, total_value, currency, status, client_id, owner_id)
VALUES
-- Contracts for TechStart (Client 100)
(100, 'SaaS Backend MVP', 5000.00, 'USD', 'PAID', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),
(101, 'Q3 Maintenance', 1500.00, 'USD', 'ACTIVE', 100, '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),

-- Contracts for Casablanca Creative (Client 101)
(102, 'E-commerce Website', 12000.00, 'MAD', 'DRAFT', 101, '31e990ae-a0f1-702d-feff-9443c3e0d1c7'),

-- Contracts for German Health (Client 102)
(103, 'Patient Data Security Audit', 3200.00, 'EUR', 'ACTIVE', 102, '31e990ae-a0f1-702d-feff-9443c3e0d1c7');