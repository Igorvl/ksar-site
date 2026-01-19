<?php
/**
 * KSAR Contact Form API
 * Receives form data via POST and sends email via exim4
 * 
 * Place this file on your Hestia server: /home/user/web/ksar.me/public_html/api/contact.php
 * URL: https://ksar.me/api/contact.php
 */

// CORS headers for frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'projectType', 'message'];
$errors = [];

foreach ($required as $field) {
    if (empty($input[$field])) {
        $errors[$field] = 'Field required';
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit();
}

// Sanitize input
$name = htmlspecialchars(strip_tags(trim($input['name'])));
$projectType = htmlspecialchars(strip_tags(trim($input['projectType'])));
$timeline = htmlspecialchars(strip_tags(trim($input['timeline'] ?? 'Not specified')));
$budget = htmlspecialchars(strip_tags(trim($input['budget'] ?? 'Not specified')));
$message = htmlspecialchars(strip_tags(trim($input['message'])));

// Email configuration
$to = 'init@ksar.me';
$subject = "New Project Request from {$name}";

// Email body
$body = "
===========================================
NEW PROJECT REQUEST
===========================================

CODENAME (NAME): {$name}
PROJECT TYPE: {$projectType}
TIMELINE: {$timeline}
BUDGET: {$budget}

-------------------------------------------
MESSAGE:
-------------------------------------------
{$message}

===========================================
Sent from ksar.me contact form
";

// Email headers
$headers = [
    'From' => "noreply@ksar.me",
    'Reply-To' => $name,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

$headerString = '';
foreach ($headers as $key => $value) {
    $headerString .= "{$key}: {$value}\r\n";
}

// Send email
$sent = mail($to, $subject, $body, $headerString);

if ($sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email'
    ]);
}
