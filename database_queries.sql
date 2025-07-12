-- =====================================================
-- PhishTracer - Requêtes SQL utiles
-- =====================================================

-- 1. Voir tous les utilisateurs
SELECT id, name, email, role, isActive, lastLogin, createdAt 
FROM users 
ORDER BY createdAt DESC;

-- 2. Voir tous les scans avec les informations utilisateur
SELECT 
    s.id,
    s.url,
    s.status,
    s.disposition,
    s.brand,
    s.createdAt,
    u.name as userName,
    u.email as userEmail
FROM scans s
JOIN users u ON s.userId = u.id
ORDER BY s.createdAt DESC;

-- 3. Statistiques des scans par disposition
SELECT 
    disposition,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM scans), 2) as percentage
FROM scans 
GROUP BY disposition;

-- 4. Scans par utilisateur
SELECT 
    u.name,
    u.email,
    COUNT(s.id) as totalScans,
    COUNT(CASE WHEN s.disposition = 'phish' THEN 1 END) as phishingScans,
    COUNT(CASE WHEN s.disposition = 'safe' THEN 1 END) as safeScans
FROM users u
LEFT JOIN scans s ON u.id = s.userId
GROUP BY u.id, u.name, u.email
ORDER BY totalScans DESC;

-- 5. Scans récents (derniers 7 jours)
SELECT 
    s.url,
    s.disposition,
    s.brand,
    s.createdAt,
    u.name as userName
FROM scans s
JOIN users u ON s.userId = u.id
WHERE s.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY s.createdAt DESC;

-- 6. Marques les plus ciblées par les phishings
SELECT 
    brand,
    COUNT(*) as totalPhishing
FROM scans 
WHERE disposition = 'phish' AND brand IS NOT NULL
GROUP BY brand
ORDER BY totalPhishing DESC
LIMIT 10;

-- 7. Utilisateurs les plus actifs
SELECT 
    u.name,
    u.email,
    COUNT(s.id) as scanCount,
    MAX(s.createdAt) as lastScan
FROM users u
LEFT JOIN scans s ON u.id = s.userId
GROUP BY u.id, u.name, u.email
HAVING scanCount > 0
ORDER BY scanCount DESC;

-- 8. Scans en échec
SELECT 
    s.id,
    s.url,
    s.errorMessage,
    s.createdAt,
    u.name as userName
FROM scans s
JOIN users u ON s.userId = u.id
WHERE s.status = 'failed' OR s.errorMessage IS NOT NULL
ORDER BY s.createdAt DESC;

-- 9. Statistiques quotidiennes (derniers 30 jours)
SELECT 
    DATE(s.createdAt) as date,
    COUNT(*) as totalScans,
    COUNT(CASE WHEN s.disposition = 'phish' THEN 1 END) as phishingScans,
    COUNT(CASE WHEN s.disposition = 'safe' THEN 1 END) as safeScans
FROM scans s
WHERE s.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(s.createdAt)
ORDER BY date DESC;

-- 10. Nettoyage des anciens scans (exemple)
-- DELETE FROM scans WHERE createdAt < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- 11. Désactiver un utilisateur
-- UPDATE users SET isActive = 0 WHERE id = [USER_ID];

-- 12. Voir les sessions actives (utilisateurs connectés récemment)
SELECT 
    name,
    email,
    lastLogin,
    TIMESTAMPDIFF(MINUTE, lastLogin, NOW()) as minutesSinceLastLogin
FROM users 
WHERE lastLogin IS NOT NULL
ORDER BY lastLogin DESC; 