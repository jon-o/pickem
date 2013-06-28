<?php
    //host, username, password, database, port
    $database = new mysqli('mysql10.000webhost.com', 'api', 'lGmvdk29943', 'a9885975_pickem', '3306');

    if($database->connect_errno > 0) {
        die ('Database Error' . $database->connect_error); 
    } else {
        die ('Connected!');
    }
?> 