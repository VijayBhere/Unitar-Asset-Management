<?php

include_once 'database.php';

$programme = $_GET['programme'];

$query = 'Select * from room where programme = "'. $programme . '"';

$records = $conn->query($query);

$result = new \stdClass();
$result->status = true;
$result->rooms = $records->fetch_all(MYSQLI_ASSOC);

$query = 'Select user_name, names from users where user_programme = "'. $programme . '"';

$records = $conn->query($query);

$result->users = $records->fetch_all(MYSQLI_ASSOC);

echo json_encode($result);

$conn->close();

?>