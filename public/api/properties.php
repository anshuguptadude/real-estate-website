<?php
require_once __DIR__ . '/db.php';
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Automatically normalize legacy 'published' status to 'Active' in database
    try {
        $pdo->exec("UPDATE properties SET status = 'Active', data_json = replace(data_json, '\"status\":\"published\"', '\"status\":\"Active\"') WHERE status = 'published' OR status = 'Published'");
    } catch (Exception $e) {}

    // Generate an ETag based on count and max updated_at for super-fast 304 response
    $stmt = $pdo->query("SELECT MAX(updated_at), COUNT(*) FROM properties WHERE is_deleted = 0");
    $meta = $stmt->fetch(PDO::FETCH_NUM);
    $etag = '"' . md5(($meta[0] ?? '') . '_' . ($meta[1] ?? '0')) . '"';
    header('ETag: ' . $etag);
    header('Cache-Control: public, max-age=15, must-revalidate');

    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }

    $stmt = $pdo->query("SELECT data_json FROM properties WHERE is_deleted = 0 ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $properties = [];
    foreach ($rows as $json) {
        $decoded = json_decode($json, true);
        if ($decoded) {
            if (isset($decoded['status']) && strtolower($decoded['status']) === 'published') {
                $decoded['status'] = 'Active';
            }
            $properties[] = $decoded;
        }
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
    if (strtolower($status) === 'published') {
        $status = 'Active';
        $data['status'] = 'Active';
    }
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
