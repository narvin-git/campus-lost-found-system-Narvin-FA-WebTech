CREATE DATABASE campus_lost_found;
USE campus_lost_found;

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Lost','Found') NOT NULL,
  location VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  contact VARCHAR(150) NOT NULL,
  status ENUM('Active','Claimed','Resolved') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);