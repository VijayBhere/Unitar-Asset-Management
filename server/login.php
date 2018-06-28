<?php

include_once 'database.php';

$userData = json_decode(file_get_contents('php://input'));

$query = 'Select user_name from users where user_name="' . $userData->user_name . '" and pwd="' . $userData->pwd . '"';

$records = $conn->query($query);

$result = new \stdClass();
$result->status = false;

if($records->num_rows > 0){
    $result->status = true;
    $result->username = $records->fetch_object()->user_name;
}

echo json_encode($result);

$conn->close();

?>