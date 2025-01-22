<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(false, null, 'Méthode non autorisée');
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    jsonResponse(false, null, 'ID de produit invalide');
}

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute(['id' => $id]);
    
    if ($stmt->rowCount() === 0) {
        jsonResponse(false, null, 'Produit non trouvé');
    }
    
    jsonResponse(true, null, 'Produit supprimé avec succès');
    
} catch(PDOException $e) {
    jsonResponse(false, null, 'Erreur lors de la suppression du produit: ' . $e->getMessage());
} 