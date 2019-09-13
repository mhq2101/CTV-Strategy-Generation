<?php
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Cookie: ' . $_SERVER['HTTP_COOKIE'] . "\r\n"
    ]
]);

$userDataNew = @file_get_contents('https://studio.innovid.com/v/cmt/cmt-nav/login-info', false, $context);
$userData = ['firstName' => '', 'lastName' => '', 'email' => ''];

if ($userDataNew !== false) {
    $json = @json_decode($userDataNew);

    if ($json !== false && isset($json->user)) {
        $userData = $json->user;
    }
}

setcookie('tempUserData', json_encode([
    'firstName' => $userData->{'firstName'},
    'lastName' => $userData->{'lastName'},
    'email' => $userData->{'email'}
]));
?>

<!--Add index.html content here (from build folder!!!)-->