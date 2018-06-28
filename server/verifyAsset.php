<?php

include_once 'database.php';

$inputData = json_decode(file_get_contents('php://input'));

$query = 'SELECT unitar_barcode, serial_num, receipt_id, description, p.name as programme, purchase_year, price, item_num, c.name as category, u.names as curent_user, status, remarks, last_inventory_date, active_date, expiry_date, cu.names as created_username, room_no FROM assets as a, programme as p, users as u, users as cu, categories as c WHERE a.unitar_barcode="' . $inputData->barcode . '" and a.programme = p.id and u.user_name = a.curent_user and c.id = a.category and a.created_username = cu.user_name';

$records = $conn->query($query);

$result = new \stdClass();
if($records->num_rows > 0){
    $ret_asset = $records->fetch_object();
    
    $query = 'select users.user_programme, users.access_all_prog, users.access_own_prog from users where users.user_name = "' . $inputData->user_name . '"';
    $records = $conn->query($query);
    
    if($records->num_rows > 0){
        $user = $records->fetch_object();
        
        if($user->access_all_prog == 'T' || ($user->access_own_prog == 'T' && $user->user_programme == $ret_asset->programme)){
            $query = 'INSERT INTO asset_verification(unitar_barcode, verification_date, verified_username) VALUES ("' . $inputData->barcode . '",Now(),"' . $inputData->user_name . '")';
            $records = $conn->query($query);
            
            if($records === TRUE){
                $result->status = true;
                $result->asset = $ret_asset;
            }
            else{
                $result->status = false;
                $result->message = $conn->error;
            }
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