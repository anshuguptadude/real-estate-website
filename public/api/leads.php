<?php
require_once __DIR__ . '/db.php';
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT data_json FROM leads ORDER BY created_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $leads = [];
    foreach ($rows as $json) {
        $decoded = json_decode($json, true);
        if ($decoded) $leads[] = $decoded;
    }
    jsonOutput($leads);
}

if ($method === 'POST') {
    $data = jsonInput();
    if (empty($data['id'])) {
        $data['id'] = 'LEAD-' . (int)(microtime(true) * 1000);
    }
    $id = $data['id'];
    $buyerName = $data['buyerName'] ?? 'Prospective Client';
    $phone = $data['phone'] ?? '';
    $email = $data['email'] ?? '';
    $propertyTitle = $data['propertyTitle'] ?? 'Concierge Inquiry';
    $status = $data['status'] ?? 'new';
    $now = date('Y-m-d H:i:s');
    $data['createdAt'] = $data['createdAt'] ?? date('c');

    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("INSERT INTO leads (id, buyer_name, phone, email, property_title, status, data_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            buyer_name = excluded.buyer_name,
            phone = excluded.phone,
            email = excluded.email,
            property_title = excluded.property_title,
            status = excluded.status,
            data_json = excluded.data_json");
    $stmt->execute([$id, $buyerName, $phone, $email, $propertyTitle, $status, $json, $now]);

    jsonOutput(["success" => true, "lead" => $data]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $body = jsonInput();
        $id = $body['id'] ?? null;
    }
    if (!$id) {
        jsonOutput(["error" => "Lead ID is required"], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
    $stmt->execute([$id]);

    jsonOutput(["success" => true, "id" => $id]);
}

jsonOutput(["error" => "Method not allowed"], 405);
