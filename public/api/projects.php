<?php
require_once __DIR__ . '/db.php';
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT data_json FROM projects WHERE is_deleted = 0 ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $projects = [];
    foreach ($rows as $json) {
        $decoded = json_decode($json, true);
        if ($decoded) $projects[] = $decoded;
    }
    jsonOutput($projects);
}

if ($method === 'POST') {
    $action = $_GET['action'] ?? null;
    $now = date('Y-m-d H:i:s');

    if ($action === 'restore_defaults') {
        // Clear project tombstones and re-insert projects from initial_data.json
        $pdo->exec("DELETE FROM deleted_records WHERE type = 'project'");
        $pdo->exec("UPDATE projects SET is_deleted = 0");

        $seed_file = __DIR__ . '/initial_data.json';
        if (file_exists($seed_file)) {
            $seed = json_decode(file_get_contents($seed_file), true);
            if (!empty($seed['projects'])) {
                $stmt = $pdo->prepare("INSERT INTO projects (id, name, status, is_deleted, data_json, updated_at) VALUES (?, ?, ?, 0, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET is_deleted = 0, data_json = excluded.data_json, updated_at = excluded.updated_at");
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

        // Return updated list
        $stmt = $pdo->query("SELECT data_json FROM projects WHERE is_deleted = 0 ORDER BY updated_at DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $res = array_map(fn($j) => json_decode($j, true), $rows);
        jsonOutput(["success" => true, "projects" => $res]);
    }

    $data = jsonInput();
    if (empty($data['id'])) {
        $data['id'] = 'proj-' . (int)(microtime(true) * 1000);
    }
    $id = $data['id'];
    $name = $data['name'] ?? 'Luxury Project';
    $status = $data['status'] ?? 'Under Construction';
    $data['updatedAt'] = $now;

    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("INSERT INTO projects (id, name, status, is_deleted, data_json, updated_at)
        VALUES (?, ?, ?, 0, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            status = excluded.status,
            is_deleted = 0,
            data_json = excluded.data_json,
            updated_at = excluded.updated_at");
    $stmt->execute([$id, $name, $status, $json, $now]);

    jsonOutput(["success" => true, "project" => $data]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $body = jsonInput();
        $id = $body['id'] ?? null;
    }
    if (!$id) {
        jsonOutput(["error" => "Project ID is required"], 400);
    }

    $now = date('Y-m-d H:i:s');
    // 1. Soft-delete project
    $stmt = $pdo->prepare("UPDATE projects SET is_deleted = 1, updated_at = ? WHERE id = ?");
    $stmt->execute([$now, $id]);

    // 2. Insert tombstone
    $tomb = $pdo->prepare("INSERT OR REPLACE INTO deleted_records (id, type, deleted_at) VALUES (?, 'project', ?)");
    $tomb->execute([$id, $now]);

    jsonOutput(["success" => true, "id" => $id]);
}

jsonOutput(["error" => "Method not allowed"], 405);
