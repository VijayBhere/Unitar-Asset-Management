<?php

include_once 'database.php';

$roomNo = $_GET['roomNo'];
$user_name = $_GET['userName'];
$result = new \stdClass();

$query = 'Select * from room where room.room_no="' . $roomNo . '"';

$records = $conn->query($query);

if($records->num_rows > 0){
    $result->status = true;
    $ret_room = $records->fetch_object();

    $query = 'select users.user_programme, users.access_all_prog, users.access_own_prog from users where users.user_name = "' . $user_name . '"';
    $records = $conn->query($query);

    if($records->num_rows > 0){
        $user = $records->fetch_object();
        
        if($user->access_all_prog == 'T' || ($user->access_own_prog == 'T' && $user->user_programme == $ret_room->programme)){
            $result->room = $ret_room;
            $query = 'Select a.unitar_barcode, a.serial_num, a.description, a.last_inventory_date from assets as a, room where room.room_no="' . $roomNo . '" and a.room_no = room.room_no';
            $records = $conn->query($query);
            $result->assets = $records->fetch_all(MYSQLI_ASSOC);
        }
        else{
            $result->status = false;
            $result->message = "Unauthorized access to room.";
        }
    }
    else{
        $result->status = false;
        $result->message = "Unauthorized access to room.";
    }
}
else{
    $result->status = false;
    $result->message = "No room found.";
}

echo json_encode($result);

$conn->close();

?>