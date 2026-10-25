<?php
require_once __DIR__ . '/db.php';

$upload_dir = dirname(__DIR__) . '/uploads';
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    jsonOutput(["error" => "Method not allowed"], 405);
}

// 1. Multipart Form-Data
if (!empty($_FILES['file'])) {
    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonOutput(["error" => "File upload error code: " . $file['error']], 400);
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
    $safe_name = 'prop_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $target = $upload_dir . '/' . $safe_name;

    if (move_uploaded_file($file['tmp_name'], $target)) {
        jsonOutput([
            "success" => true,
            "url" => "/uploads/" . $safe_name,
            "filename" => $safe_name
        ]);
    } else {
        jsonOutput(["error" => "Failed to save uploaded file"], 500);
    }
}

// 2. Base64 JSON
$data = jsonInput();
if (!empty($data['image'])) {
    $raw_image = $data['image'];
    if (preg_match('/^data:image\/(\w+);base64,/', $raw_image, $type)) {
        $raw_image = substr($raw_image, strpos($raw_image, ',') + 1);
        $ext = strtolower($type[1]);
        if ($ext === 'jpeg') $ext = 'jpg';
    } else {
        $ext = 'jpg';
    }

    $decoded = base64_decode($raw_image);
    if (!$decoded) {
        jsonOutput(["error" => "Invalid base64 image data"], 400);
    }

    $safe_name = 'prop_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $target = $upload_dir . '/' . $safe_name;

    if (file_put_contents($target, $decoded)) {
        jsonOutput([
            "success" => true,
            "url" => "/uploads/" . $safe_name,
            "filename" => $safe_name
        ]);
    } else {
        jsonOutput(["error" => "Failed to write image file"], 500);
    }
}

jsonOutput(["error" => "No file or base64 image provided"], 400);
