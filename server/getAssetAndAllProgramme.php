<?php

include_once 'database.php';

$barcode = $_GET['barcode'];
$user_name = $_GET['userName'];

$query = 'SELECT unitar_barcode, serial_num, receipt_id, description, programme, p.name as programme_name, purchase_year, price, item_num, category, c.name as category_name, curent_user, u.names as curent_user_name, status, remarks, last_inventory_date, active_date, expiry_date, cu.names as created_username, room_no FROM assets as a, programme as p, users as u, users as cu, categories as c WHERE a.unitar_barcode="' . $barcode . '" and a.programme = p.id and u.user_name = a.curent_user and c.id = a.category and a.created_username = cu.user_name';
$records = $conn->query($query);

$result = new \stdClass();
if($records->num_rows > 0){
    $ret_asset = $records->fetch_object();
    
    $query = 'select users.user_programme, users.access_all_prog, users.access_own_prog from users where users.user_name = "' . $user_name . '"';
    $records = $conn->query($query);
    
    if($records->num_rows > 0){
        $user = $records->fetch_object();
        
        if($user->access_all_prog == 'T' || ($user->access_own_prog == 'T' && $user->user_programme == $ret_asset->programme_name)){
            $result->asset = $ret_asset;
            $result->status = true;
            
            $query = 'Select id, name from programme';
            $records = $conn->query($query);
            $result->programmes = $records->fetch_all(MYSQLI_ASSOC);
        }
        else{
            $result->status = false;
            $result->message = "Unauthorized access to asset.";
        }
    }
    else{
        $result->status = false;
        $result->message = "Unauthorized access to asset.";
    }
}
else{
    $result->status = false;
    $result->message = "No records found";
}

echo json_encode($result);

$conn->close();

?>