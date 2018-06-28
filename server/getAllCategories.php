<?php

include_once 'database.php';

$query = 'Select id, name from categories';

$records = $conn->query($query);

$result = new \stdClass();
$result->status = true;
$result->categories = $records->fetch_all(MYSQLI_ASSOC);

echo json_encode($result);

$conn->close();

?>