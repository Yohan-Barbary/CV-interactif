<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(false, null, 'Méthode non autorisée');
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    jsonResponse(false, null, 'Données invalides');
}

// Validation des données
$errors = validateProduct($data);
if (!empty($errors)) {
    jsonResponse(false, null, implode(', ', $errors));
}

try {
    $stmt = $pdo->prepare("
        UPDATE products 
        SET name = :name,
            price = :price,
            description = :description,
            stock = :stock
        WHERE id = :id
    ");
    
    $result = $stmt->execute([
        'id' => $data['id'],
        'name' => sanitizeInput($data['name']),
        'price' => floatval($data['price']),
        'description' => sanitizeInput($data['description']),
        'stock' => intval($data['stock'])
    ]);
    
    if ($stmt->rowCount() === 0) {
        jsonResponse(false, null, 'Produit non trouvé');
    }
    
    jsonResponse(true, $data, 'Produit mis à jour avec succès');
    
} catch(PDOException $e) {
    jsonResponse(false, null, 'Erreur lors de la mise à jour du produit: ' . $e->getMessage());
} 