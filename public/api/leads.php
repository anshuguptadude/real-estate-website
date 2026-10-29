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
        if ($decoded) {
            $p = preg_replace('/[^0-9]/', '', $decoded['phone'] ?? '');
            $n = trim($decoded['buyerName'] ?? '');
            $e = strtolower(trim($decoded['email'] ?? ''));
            // Filter out any legacy dummy leads or owner numbers
            if (strlen($p) >= 10 && !str_ends_with($p, '9149079913') && !str_ends_with($p, '9557138449') && stripos($n, 'prospective buyer') === false && $e !== 'buyer@royalagraestate.in') {
                $leads[] = $decoded;
            }
        }
    }
    jsonOutput($leads);
}

if ($method === 'POST') {
    $data = jsonInput();

    // Server-side validation: Strictly reject dummy, placeholder, or company-owner phone numbers
    $buyerName = trim($data['buyerName'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = strtolower(trim($data['email'] ?? ''));
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);

    if (strlen($cleanPhone) < 10) {
        jsonOutput(["error" => "Valid 10-digit mobile number required"], 400);
    }
    if (str_ends_with($cleanPhone, '9149079913') || str_ends_with($cleanPhone, '9557138449')) {
        jsonOutput(["error" => "Company owner lines cannot be submitted as buyer leads"], 400);
    }
    if (stripos($buyerName, 'prospective buyer') !== false || strlen($buyerName) < 2) {
        jsonOutput(["error" => "Real buyer name is required"], 400);
    }
    if ($email === 'buyer@royalagraestate.in') {
        jsonOutput(["error" => "Invalid placeholder email"], 400);
    }

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
