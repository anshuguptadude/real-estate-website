<?php
require_once __DIR__ . '/db.php';
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT data_json FROM properties WHERE is_deleted = 0 ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $properties = [];
    foreach ($rows as $json) {
        $decoded = json_decode($json, true);
        if ($decoded) $properties[] = $decoded;
    }
    jsonOutput($properties);
}

if ($method === 'POST') {
    $data = jsonInput();
    if (empty($data['id'])) {
        $data['id'] = 'prop-user-' . (int)(microtime(true) * 1000);
    }
    $id = $data['id'];
    $title = $data['title'] ?? 'Untitled Property';
    $locality = $data['locality'] ?? 'Agra';
    $propType = $data['propertyType'] ?? 'Luxury Villa';
    $price = (int)($data['price'] ?? 0);
    $status = $data['status'] ?? 'Active';
    $now = date('Y-m-d H:i:s');
    $data['updatedAt'] = $now;

    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("INSERT INTO properties (id, title, locality, property_type, price, status, is_deleted, data_json, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
        ON CONFLICT(id) DO UPDATE SET 
            title = excluded.title,
            locality = excluded.locality,
            property_type = excluded.property_type,
            price = excluded.price,
            status = excluded.status,
            is_deleted = 0,
            data_json = excluded.data_json,
            updated_at = excluded.updated_at");
    $stmt->execute([$id, $title, $locality, $propType, $price, $status, $json, $now]);

    jsonOutput(["success" => true, "property" => $data]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $body = jsonInput();
        $id = $body['id'] ?? null;
    }
    if (!$id) {
        jsonOutput(["error" => "Property ID is required"], 400);
    }

    $now = date('Y-m-d H:i:s');
    // 1. Soft-delete property
    $stmt = $pdo->prepare("UPDATE properties SET is_deleted = 1, updated_at = ? WHERE id = ?");
    $stmt->execute([$now, $id]);

    // 2. Insert tombstone
    $tomb = $pdo->prepare("INSERT OR REPLACE INTO deleted_records (id, type, deleted_at) VALUES (?, 'property', ?)");
    $tomb->execute([$id, $now]);

    jsonOutput(["success" => true, "id" => $id]);
}

jsonOutput(["error" => "Method not allowed"], 405);
