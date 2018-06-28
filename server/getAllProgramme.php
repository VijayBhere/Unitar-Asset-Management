<?php

include_once 'database.php';

$query = 'Select id, name from programme';

$records = $conn->query($query);

$result = new \stdClass();
$result->status = true;
$result->programmes = $records->fetch_all(MYSQLI_ASSOC);

echo json_encode($result);

$conn->close();

?>