<?php
include 'conn.php';

$user=$_GET['user'];
$message=$_GET['message'];
$req_date=$_GET['date'];
$req_time=$_GET['time'];

$sent_date=$_GET['sent_date'];
$sent_time=$_GET['sent_time'];
 

$sql="INSERT INTO messages(user,message,req_date,req_time,sent_date,sent_time) VALUES('".$user."','".$message."','".$req_date."','".$req_time."','".$sent_date."','".$sent_time."');";
$conn->query($sql);

$conn->close();
echo "success";
?>