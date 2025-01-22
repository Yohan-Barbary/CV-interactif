<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Méthode non autorisée');
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    jsonResponse(false, null, 'Données invalides');
}

// Validation des données
$errors = validateProduct($data);
if (!empty($errors)) {
    jsonResponse(false, null, implode(', ', $errors));
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO products (name, price, description, stock) 
        VALUES (:name, :price, :description, :stock)
    ");
    
    $stmt->execute([
        'name' => sanitizeInput($data['name']),
        'price' => floatval($data['price']),
        'description' => sanitizeInput($data['description']),
        'stock' => intval($data['stock'])
    ]);
    
    $data['id'] = $pdo->lastInsertId();
    jsonResponse(true, $data, 'Produit ajouté avec succès');
    
} catch(PDOException $e) {
    jsonResponse(false, null, 'Erreur lors de l\'ajout du produit: ' . $e->getMessage());
} 