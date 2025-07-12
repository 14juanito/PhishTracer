-- =====================================================
-- PhishTracer Database Schema
-- =====================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS phishtracer;
USE phishtracer;

-- =====================================================
-- Table: users (Utilisateurs et Administrateurs)
-- =====================================================
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `isActive` tinyint(1) DEFAULT '1',
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: scans (Résultats des scans CheckPhish)
-- =====================================================
CREATE TABLE `scans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `url` text NOT NULL,
  `jobId` varchar(255) NOT NULL,
  `status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `disposition` enum('phish','safe','unknown') DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `insights` text,
  `screenshotPath` text,
  `resolved` tinyint(1) DEFAULT '0',
  `scanStartTs` bigint DEFAULT NULL,
  `scanEndTs` bigint DEFAULT NULL,
  `categories` json DEFAULT NULL,
  `errorMessage` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jobId` (`jobId`),
  KEY `userId` (`userId`),
  CONSTRAINT `scans_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Données d'initialisation
-- =====================================================

-- Création de l'administrateur par défaut
-- Mot de passe: admin123 (hashé avec bcrypt)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`) 
VALUES ('Administrateur', 'admin@phishtracer.com', '$2a$10$L9XptidnxXyVNlFgwt7BLOuHVTukAzI42qhjgqnLXG8SpeONoiUT.', 'admin', 1, NOW(), NOW());

-- =====================================================
-- Index et optimisations
-- =====================================================

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_scans_user_status ON scans(userId, status);
CREATE INDEX idx_scans_disposition ON scans(disposition);
CREATE INDEX idx_scans_created_at ON scans(createdAt);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email); 