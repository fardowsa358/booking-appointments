-- cleanup.sql
USE medicare;

-- Delete duplicate doctors, keep only the first one of each
DELETE d1 FROM doctors d1
INNER JOIN doctors d2 
WHERE 
    d1.id > d2.id AND 
    d1.name = d2.name AND 
    d1.specialty = d2.specialty;

-- Delete duplicate services, keep only the first one of each  
DELETE s1 FROM services s1
INNER JOIN services s2 
WHERE 
    s1.id > s2.id AND 
    s1.name = s2.name;

-- Delete duplicate users (except admin), keep only the first one of each email
DELETE u1 FROM users u1
INNER JOIN users u2 
WHERE 
    u1.id > u2.id AND 
    u1.email = u2.email;

-- Reset auto-increment counters
ALTER TABLE doctors AUTO_INCREMENT = 1;
ALTER TABLE services AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;