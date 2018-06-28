<?PHP

$asset = json_decode(file_get_contents('php://input'));

include_once 'database.php';

$query = "INSERT INTO assets(unitar_barcode, serial_num, receipt_id, description, programme, purchase_year, price, item_num, category, curent_user, status, remarks, active_date, created_username, room_no) VALUES ('" . $asset->unitar_barcode . "', '" . $asset->serial_num . "', '" . $asset->receipt_id . "', '" . $asset->description . "', " . $asset->programme . ", " . $asset->purchase_year . ", " . $asset->price . ", '" . $asset->item_num . "', '" . $asset->category . "', '" . $asset->curent_user . "', '" . $asset->status . "', '" . $asset->remarks . "', NOW(), '" . $asset->created_username . "', '" . $asset->room_no ."')";

$result = new \stdClass();
if($conn->query($query) === TRUE){
    $result->status = true;
}
else{
    $result->status = false;
    $result->message = $conn->error;
}

echo json_encode($result);

$conn->close();

?>