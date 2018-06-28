<?php

$servername = "localhost";
$username = "root";
$password = "unitar";

$conn = new mysqli($servername, $username, $password, 'asset_mgt_unitar');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

?>