<?php
// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'products_db');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch(PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Structure de la base de données
$sql = "CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

try {
    $pdo->exec($sql);
} catch(PDOException $e) {
    die("Erreur de création de table : " . $e->getMessage());
}

// Fonction utilitaire pour la validation des données
function validateProduct($data) {
    $errors = [];
    
    if (empty($data['name'])) {
        $errors[] = "Le nom du produit est requis";
    }
    
    if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] < 0) {
        $errors[] = "Le prix doit être un nombre positif";
    }
    
    if (empty($data['description'])) {
        $errors[] = "La description est requise";
    }
    
    if (!isset($data['stock']) || !is_numeric($data['stock']) || $data['stock'] < 0) {
        $errors[] = "Le stock doit être un nombre positif";
    }
    
    return $errors;
}

// Fonction pour nettoyer les données
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Fonction pour la réponse JSON
function jsonResponse($success, $data = null, $message = '') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
} 