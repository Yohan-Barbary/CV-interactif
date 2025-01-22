<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Méthode non autorisée');
}

try {
    // Gestion de la pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Récupération du nombre total de produits
    $total = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();

    // Récupération des produits avec pagination
    $stmt = $pdo->prepare("
        SELECT * FROM products 
        ORDER BY created_at DESC 
        LIMIT :limit OFFSET :offset
    ");
    
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $products = $stmt->fetchAll();
    
    jsonResponse(true, [
        'products' => $products,
        'pagination' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]
    ]);

} catch(PDOException $e) {
    jsonResponse(false, null, 'Erreur lors de la récupération des produits: ' . $e->getMessage());
} 