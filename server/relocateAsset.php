<?PHP

$inputData = json_decode(file_get_contents('php://input'));
$asset = $inputData->asset;

include_once 'database.php';

$action = 'Relocated asset to program: ' . $asset->programme . ', user: ' . $asset->curent_user . ', room: ' . $asset->room_no;

$query = "UPDATE assets SET programme=" . $asset->programme . ",curent_user='" . $asset->curent_user . "',room_no='" . $asset->room_no ."' WHERE unitar_barcode = '" . $asset->unitar_barcode . "'";

$conn->begin_transaction();

$result = new \stdClass();
if($conn->query($query) === TRUE){
    $query = "INSERT INTO asset_history(unitar_barcode, user, action_category, action, activity_date) VALUES ('" . $asset->unitar_barcode . "','" . $inputData->user . "','Edit','" . $action . "',Now())";
    
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