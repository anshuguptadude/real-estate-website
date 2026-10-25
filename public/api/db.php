<?php
// Royal Agra Estate - Native Backend API Database Engine
// Supports SQLite3 (Zero-Config Default) and MySQL (Optional via config.php)

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

function getDB() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $config_file = __DIR__ . '/config.php';
    if (file_exists($config_file)) {
        require_once $config_file;
    }

    try {
        if (defined('DB_TYPE') && DB_TYPE === 'mysql') {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } else {
            // Default: Embedded High-Performance SQLite3 on Hostinger SSD
            $db_dir = __DIR__ . '/data';
            if (!is_dir($db_dir)) {
                @mkdir($db_dir, 0755, true);
            }
            $db_file = $db_dir . '/royal_agra.db';
            $pdo = new PDO("sqlite:" . $db_file, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec("PRAGMA journal_mode = WAL;");
            $pdo->exec("PRAGMA synchronous = NORMAL;");
        }

        initTables($pdo);
        return $pdo;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database connection error", "details" => $e->getMessage()]);
        exit;
    }
}

function initTables($pdo) {
    // 1. Properties
    $pdo->exec("CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT,
        locality VARCHAR(100),
        property_type VARCHAR(100),
        price BIGINT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        is_deleted INTEGER DEFAULT 0,
        data_json TEXT,
        updated_at DATETIME
    )");

    // 2. Leads
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(100) PRIMARY KEY,
        buyer_name VARCHAR(255),
        phone VARCHAR(100),
        email VARCHAR(255),
        property_title TEXT,
        status VARCHAR(50) DEFAULT 'new',
        data_json TEXT,
        created_at DATETIME
    )");

    // 3. Accounts
    $pdo->exec("CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(100),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'buyer',
        password VARCHAR(255),
        data_json TEXT,
        updated_at DATETIME
    )");

    // 4. Projects
    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        status VARCHAR(100) DEFAULT 'Under Construction',
        is_deleted INTEGER DEFAULT 0,
        data_json TEXT,
        updated_at DATETIME
    )");

    // 5. Deleted Records Tombstones
    $pdo->exec("CREATE TABLE IF NOT EXISTS deleted_records (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(50),
        deleted_at DATETIME
    )");

    // Auto-seed if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM properties WHERE is_deleted = 0");
    $row = $stmt->fetch();
    if ($row && (int)$row['cnt'] === 0) {
        seedInitialData($pdo);
    }
}

function seedInitialData($pdo) {
    $seed_file = __DIR__ . '/initial_data.json';
    if (!file_exists($seed_file)) return;
    $seed = json_decode(file_get_contents($seed_file), true);
    if (!$seed) return;

    $now = date('Y-m-d H:i:s');

    // Seed Properties
    if (!empty($seed['properties'])) {
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO properties (id, title, locality, property_type, price, status, is_deleted, data_json, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)");
        foreach ($seed['properties'] as $p) {
            $stmt->execute([
                $p['id'] ?? ('prop-' . time()),
                $p['title'] ?? 'Luxury Estate',
                $p['locality'] ?? 'Agra',
                $p['propertyType'] ?? 'Luxury Villa',
                $p['price'] ?? 0,
                $p['status'] ?? 'Active',
                json_encode($p),
                $now
            ]);
        }
    }

    // Seed Accounts
    if (!empty($seed['accounts'])) {
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO accounts (id, email, phone, name, role, password, data_json, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($seed['accounts'] as $a) {
            $stmt->execute([
                $a['id'] ?? ('acc-' . time()),
                strtolower($a['email'] ?? ''),
                $a['phone'] ?? '',
                $a['name'] ?? 'User',
                $a['role'] ?? 'owner',
                $a['password'] ?? '',
                json_encode($a),
                $now
            ]);
        }
    }

    // Seed Admin Accounts
    $admins = [
        [
            'id' => 'admin-ceo-01',
            'email' => 'shrey123@gmail.com',
            'name' => 'Shrey Gupta',
            'phone' => '+91 9149079913',
            'role' => 'ceo',
            'password' => 'RoyalAgra@CEO2025',
            'memberSince' => '2024',
            'permissions' => ["FULL_ADDRESS_ACCESS", "AUTO_APPROVE", "APPROVALS_QUEUE", "LEAD_CRM_STREAM", "DELETE_LISTINGS", "LIVE_MAP_PINS", "PROJECTS_CMS"]
        ],
        [
            'id' => 'admin-abhishek-02',
            'email' => 'abhi9557138449@gmail.com',
            'name' => 'Abhishek Singh Jadon',
            'phone' => '+91 9557138449',
            'role' => 'admin',
            'password' => 'Abhi@Agra2025',
            'memberSince' => '2024',
            'permissions' => ["FULL_ADDRESS_ACCESS", "AUTO_APPROVE", "APPROVALS_QUEUE", "LEAD_CRM_STREAM", "DELETE_LISTINGS", "LIVE_MAP_PINS", "PROJECTS_CMS"]
        ]
    ];
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO accounts (id, email, phone, name, role, password, data_json, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($admins as $ad) {
        $stmt->execute([
            $ad['id'],
            strtolower($ad['email']),
            $ad['phone'],
            $ad['name'],
            $ad['role'],
            $ad['password'],
            json_encode($ad),
            $now
        ]);
    }

    // Seed Leads
    if (!empty($seed['leads'])) {
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO leads (id, buyer_name, phone, email, property_title, status, data_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($seed['leads'] as $l) {
            $stmt->execute([
                $l['id'] ?? ('lead-' . time()),
                $l['buyerName'] ?? 'Lead',
                $l['phone'] ?? '',
                $l['email'] ?? '',
                $l['propertyTitle'] ?? '',
                $l['status'] ?? 'new',
                json_encode($l),
                $now
            ]);
        }
    }

    // Seed Projects
    if (!empty($seed['projects'])) {
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO projects (id, name, status, is_deleted, data_json, updated_at) VALUES (?, ?, ?, 0, ?, ?)");
        foreach ($seed['projects'] as $pr) {
            $stmt->execute([
                $pr['id'] ?? ('proj-' . time()),
                $pr['name'] ?? 'Project',
                $pr['status'] ?? 'Under Construction',
                json_encode($pr),
                $now
            ]);
        }
    }
}

function jsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

function jsonOutput($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
