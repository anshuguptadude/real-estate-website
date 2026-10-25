<?php
require_once __DIR__ . '/db.php';
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $email = isset($_GET['email']) ? strtolower(trim($_GET['email'])) : null;
    $phone = isset($_GET['phone']) ? trim($_GET['phone']) : null;

    if ($email || $phone) {
        if ($email) {
            $stmt = $pdo->prepare("SELECT data_json FROM accounts WHERE LOWER(email) = ? LIMIT 1");
            $stmt->execute([$email]);
        } else {
            $stmt = $pdo->prepare("SELECT data_json FROM accounts WHERE phone = ? LIMIT 1");
            $stmt->execute([$phone]);
        }
        $row = $stmt->fetchColumn();
        if ($row) {
            jsonOutput(json_decode($row, true));
        } else {
            jsonOutput(null, 404);
        }
    }

    // Return all accounts (for CEO/Admin management)
    $stmt = $pdo->query("SELECT data_json FROM accounts ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $accounts = [];
    foreach ($rows as $json) {
        $decoded = json_decode($json, true);
        if ($decoded) $accounts[] = $decoded;
    }
    jsonOutput($accounts);
}

if ($method === 'POST') {
    $data = jsonInput();
    if (empty($data['email'])) {
        jsonOutput(["error" => "Email is required"], 400);
    }
    $email = strtolower(trim($data['email']));
    $id = $data['id'] ?? ('RAE-' . rand(1000, 9999));
    $name = $data['name'] ?? 'User';
    $phone = $data['phone'] ?? '';
    $role = $data['role'] ?? 'buyer';
    $password = $data['password'] ?? '';
    $now = date('Y-m-d H:i:s');
    $data['id'] = $id;
    $data['updatedAt'] = $now;

    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("INSERT INTO accounts (id, email, phone, name, role, password, data_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            phone = excluded.phone,
            name = excluded.name,
            role = excluded.role,
            password = CASE WHEN excluded.password != '' THEN excluded.password ELSE accounts.password END,
            data_json = excluded.data_json,
            updated_at = excluded.updated_at");
    $stmt->execute([$id, $email, $phone, $name, $role, $password, $json, $now]);

    jsonOutput(["success" => true, "account" => $data]);
}

if ($method === 'DELETE') {
    $email = isset($_GET['email']) ? strtolower(trim($_GET['email'])) : null;
    $id = $_GET['id'] ?? null;
    if (!$email && !$id) {
        $body = jsonInput();
        $email = isset($body['email']) ? strtolower(trim($body['email'])) : null;
        $id = $body['id'] ?? null;
    }

    if (!$email && !$id) {
        jsonOutput(["error" => "Email or ID is required"], 400);
    }

    $now = date('Y-m-d H:i:s');
    if ($email) {
        $stmt = $pdo->prepare("DELETE FROM accounts WHERE LOWER(email) = ?");
        $stmt->execute([$email]);

        $tomb = $pdo->prepare("INSERT OR REPLACE INTO deleted_records (id, type, deleted_at) VALUES (?, 'account', ?)");
        $tomb->execute([$email, $now]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM accounts WHERE id = ?");
        $stmt->execute([$id]);
    }

    jsonOutput(["success" => true]);
}

jsonOutput(["error" => "Method not allowed"], 405);
