<?php
header("Content-Type: application/json; charset=UTF-8");
$db = "rcg";
$hostname = "localhost";
$username = "root";
$password = "";
$mysqli = new mysqli($hostname, $username, $password, $db);
$json = ["status" => "success", "message" => ""];
$endpoint = isset($_GET["action"]) ? $_GET["action"] : null;
switch($endpoint){
	// Read Employees
	case("read"):	
		$read_query = "SELECT * FROM employee";
		$read_result = $mysqli->query($read_query);
		if($num_results = $read_result->num_rows) {
			$json["message"] = ["count" => $num_results, "employees" => $read_result->fetch_all(MYSQLI_ASSOC)];
			echo json_encode($json);
		}
		else {
			$json["message"] = ["count" => $num_results];
			echo json_encode($json);
		}
		break;
	
	// Add Employee
	case("add"):
		$result = checkData($mysqli);
		if(is_array($result)) {
			extract($result);
			$find_query = "SELECT person_id FROM employee WHERE person_id = $person_id";
			$find_result = $mysqli->query($find_query);
			if($find_result->num_rows) {
				$json["status"] = "error";
				$json["message"] = "Employee $person_id already exists";
				echo json_encode($json);
			}
			else {
				$add_query = "INSERT INTO employee VALUES ($person_id, '$first_name', '$last_name', '$email', '$hire_date', '$job_title', $agency_num, CURRENT_TIMESTAMP())";
				$add_result = $mysqli->query($add_query);
				if($add_result) {
					$json["message"] = "Employee $person_id has been created";
					echo json_encode($json);
				}
				else {
					$json["status"] = "error";
					$json["message"] = "Error creating Employee $person_id";
					echo json_encode($json);
				}
			}
		}
		else {
			$json["status"] = "error";
			$json["message"] = $result;
			echo json_encode($json);
		}
		break;
	
	// Update Employee
	case("update"):
		$result = checkData($mysqli);
		if(is_array($result)) {
			extract($result);
			$update_query = "UPDATE employee SET first_name = '$first_name', last_name = '$last_name', email_address = '$email', hire_date = '$hire_date', job_title = '$job_title', agency_num = $agency_num WHERE person_id = $person_id";
			$update_result = $mysqli->query($update_query);
			if($update_result) {
				$json["message"] = "Employee $person_id has been updated";
				echo json_encode($json);
			}
			else {
				$json["status"] = "error";
				$json["message"] = "Error updating Employee $person_id";
				echo json_encode($json);
			}
		}
		else {
			$json["status"] = "error";
			$json["message"] = $result;
			echo json_encode($json);
		}
		break;
	
	// Delete Employee
	case("delete"):
		$person_id = isset($_POST["id"]) ? $_POST["id"] : null;
		if($person_id) {
			$find_query = "SELECT person_id FROM employee WHERE person_id = $person_id";
			$find_result = $mysqli->query($find_query);
			if($find_result->num_rows) {
				$delete_query = "DELETE FROM employee WHERE person_id = $person_id";
				$delete_result = $mysqli->query($delete_query);
				if($delete_result) {
					$json["message"] = "Employee $person_id has been deleted";
					echo json_encode($json);
				}
				else {
					$json["status"] = "error";
					$json["message"] = "Error deleting Employee $person_id";
					echo json_encode($json);
				}
			}
		}
		else {
			$json["status"] = "error";
			$json["message"] = "Person ID not provided";
			echo json_encode($json);
		}
		break;
	
	// Invalid Endpoint
	default:
		$json["status"] = "error";
		$json["message"] = "Not a valid endpoint.";
		echo json_encode($json);
}

// Check For Valid Input
function checkData($mysqli) {
	$valid = true;
	$message = "";
	$person_id = isset($_POST["person_id"]) && !empty($_POST["person_id"]) ? $mysqli->real_escape_string(trim($_POST["person_id"])) : null;
	$first_name = isset($_POST["first_name"]) && !empty($_POST["first_name"]) ? $mysqli->real_escape_string(trim($_POST["first_name"])) : null;
	$last_name = isset($_POST["last_name"]) && !empty($_POST["last_name"]) ? $mysqli->real_escape_string(trim($_POST["last_name"])) : null;
	$email = isset($_POST["email"]) && !empty($_POST["email"]) ? $mysqli->real_escape_string(trim($_POST["email"])) : null;
	$hire_date = isset($_POST["hire_date"]) && !empty($_POST["hire_date"]) ? $mysqli->real_escape_string(trim($_POST["hire_date"])) : null;
	$job_title = isset($_POST["job_title"]) && !empty($_POST["job_title"]) ? $mysqli->real_escape_string(trim($_POST["job_title"])) : null;
	$agency_num = isset($_POST["agency_num"]) && !empty($_POST["agency_num"]) ? $mysqli->real_escape_string(trim($_POST["agency_num"])) : null;
	$input_date = date_format(date_create($hire_date), "Y-m-d");
	$current_date = date("Y-m-d");
	if($person_id == null) {
		$valid = false;
	}
	else if(!intval($person_id) || strlen($person_id) != 7) {
		$valid = false;
	}
	if($first_name == null) {
		$valid = false;
		$message .= "First Name is required\n";
	}
	if($last_name == null) {
		$valid = false;
		$message .= "Last Name is required\n";
	}
	if($email == null) {
		$valid = false;
		$message .= "Email is required\n";
	}
	else if(substr_count($email, "@") != 1 || strstr($email, ".") == false || strstr($email, " ") != false) {
		$valid = false;
		$message .= "Email is not valid\n";
	}
	if($hire_date == null) {
		$valid = false;
		$message .= "Hire Date is required\n";
	}
	else if($input_date > $current_date) {	
		$valid = false;
		$message .= "Hire Date cannot be in the future\n";
	}
	if($job_title == null) {
		$valid = false;
		$message .= "Job Title is required\n";
	}
	else {
		switch($job_title) {
			case("ta_rep_a"):
				$job_title = "TA Rep A";
				$agency_num = "NULL";
				break;
			case("ta_rep_b"):
				$job_title = "TA Rep B";
				$agency_num = "NULL";
				break;
			case("direct_rep_a"):
				$job_title = "Direct Rep A";
				if($agency_num == null) {
					$valid = false;
					$message .= "Agency Number is required\n";
				}
				else if(!intval($agency_num)) {
					$valid = false;
					$message .= "Agency Number is not numeric\n";
				}
				break;
			case("direct_rep_b"):
				$job_title = "Direct Rep B";
				if($agency_num == null) {
					$valid = false;
					$message .= "Agency Number is required\n";
				}
				else if(!intval($agency_num)) {
					$valid = false;
					$message .= "Agency Number is not numeric\n";
				}
				break;
			default:
				$valid = false;
				$message .= "Job Title is not valid\n";
		}
	}
	if(!$valid) return $message;
	else return compact("person_id", "first_name", "last_name", "email", "hire_date", "job_title", "agency_num");
}
$mysqli->close();
?>