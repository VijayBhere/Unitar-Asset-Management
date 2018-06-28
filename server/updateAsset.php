<?PHP

$inputData = json_decode(file_get_contents('php://input'));

include_once 'database.php';

$query = "UPDATE assets SET status='" . $inputData->status . "', remarks='" . $inputData->remarks . "' WHERE unitar_barcode = '" . $inputData->unitar_barcode . "'";

$conn->begin_transaction();

$result = new \stdClass();
if($conn->query($query) === TRUE){
    $query = "INSERT INTO asset_history(unitar_barcode, user, action_category, action, activity_date) VALUES ('" . $inputData->unitar_barcode . "','" . $inputData->user . "','Edit','Update status to " . $inputData->status . ", remarks to " . $inputData->remarks . "',Now())";
    
    if($conn->query($query) === TRUE){
        $result->status = true;
    }
    else{
        $conn->rollback();
        $result->status = false;
        $result->message = $conn->error;
    }
}
else{
    $result->status = false;
    $result->message = $conn->error;
}

echo json_encode($result);

$conn->commit();
$conn->close();

?>