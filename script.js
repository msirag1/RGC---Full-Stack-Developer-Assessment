$(document).ready(function(){
	// Populate Employee Table
	$.get("api.php?action=read", function(data) {
		if(data.status == "success") {
			if(data.message.count){
				for (let employee of data.message.employees) {
					let agency_num = employee.agency_num ? employee.agency_num : "N/A";
					$("#employee_table tbody").append('<tr id="' + employee.person_id + '"><td><button id="update-' + employee.person_id + '"type="button">Update</button>&nbsp;<button id="delete-' + employee.person_id + '"type="button">Delete</button></td><td data-type="person_id">' + employee.person_id + '</td><td data-type="first_name">' + employee.first_name + '</td><td data-type="last_name">' + employee.last_name + '</td><td data-type="email">' + employee.email_address + '</td><td data-type="hire_date">' + employee.hire_date + '</td><td data-type="job_title">' + employee.job_title + '</td><td data-type="agency_num">' + agency_num + '</td><td data-type="registration_num">' + employee.registration_date + '</td></tr>');
					$("#update-" + employee.person_id).click(function() {
						openForm(employee.person_id);
					});
					$("#delete-" + employee.person_id).click(function() {
						deleteEmployee(employee.person_id);
					});
				}
			}
			else {
				$("#employee_table tbody").append('<tr><td colspan="9">No Employees</td></tr>');
			}			
		}
		else {
			$("#employee_table tbody").append('<tr><td colspan="9">Error Loading Employees</td></tr>');
		}
	});

	// Add Employee Button
	$("#add_employee").click(function() {
		openForm();
	});

	// Open Form Function
	function openForm(person_id = null) {
		// Update Employee Logic/Build Form
		if(person_id) {
			$("#employee_form_legend").text("Update Employee Form");
			let tableRow = $("#" + person_id);
			$("#person_id").val(person_id);
			$("#person_id").prop("readonly", true);
			$("#first_name").val(tableRow.children("td[data-type='first_name']").text());
			$("#last_name").val(tableRow.children("td[data-type='last_name']").text());
			$("#email").val(tableRow.children("td[data-type='email']").text());
			$("#hire_date").val(tableRow.children("td[data-type='hire_date']").text());
			switch(tableRow.children("td[data-type='job_title']").text()) {
				case("TA Rep A"):
					$("#job_title option[value='ta_rep_a']").prop("selected", true);
					break;
				case("TA Rep A"):
					$("#job_title option[value='ta_rep_b']").prop("selected", true);
					break;
				case("Direct Rep A"):
					$("#job_title option[value='direct_rep_a']").prop("selected", true);
					$("#agency_num").val(tableRow.children("td[data-type='agency_num']").text());
					$("#agency_num_field").removeClass("hidden");
					break;
				case("Direct Rep B"):
					$("#job_title option[value='direct_rep_b']").prop("selected", true);
					$("#agency_num").val(tableRow.children("td[data-type='agency_num']").text());
					$("#agency_num_field").removeClass("hidden");
					break;
			}
			$("#employee_form").submit(function(event) {
				event.preventDefault();
				updateEmployee(person_id);
			});
		}
		// Add New Employee Logic/Build Form
		else {
			$("#employee_form_legend").text("Add Employee Form");
			$("#employee_form").submit(function(event) {
				event.preventDefault();
				addEmployee();
			});
		}
		$("#employee_form_div").addClass("active");
		$(".overlay").addClass("active");
	}

	// Close Form Function
	function closeForm() {
		$("#employee_form_div").removeClass("active");
		$(".overlay").removeClass("active");
		$("#employee_form").unbind("submit");
		$("#employee_form").trigger("reset");
		$("#employee_form_legend").text("");
		$("#person_id").prop("readonly", false);
		$("#agency_num_field").addClass("hidden");
	}

	// Cancel Form Button
	$("#cancel_button").click(function() {
		closeForm();
	});

	// Add Employee Function
	function addEmployee() {
		if(checkInput()) {
			$.ajax({
				type: "post",
				url: "api.php?action=add",
				data: $("#employee_form").serialize(),
				async: false,
				success: function(data) {
					if(data.status == "success") {
						location.reload();					
					}
					else {
						alert(data.message);
					}
				}
			});
		}
	}

	// Update Employee Function
	function updateEmployee() {
		if(checkInput()) {
			$.ajax({
				type: "post",
				url: "api.php?action=update",
				data: $("#employee_form").serialize(),
				async: false,
				success: function(data) {
					if(data.status == "success") {
						location.reload();
					}
					else {
						alert(data.message);
					}
				}
			});
		}
		else {
			return false;
		}
	}

	// Delete Employee Function
	function deleteEmployee(person_id) {
		let confirmed = confirm("Are you sure you want to delete employee " + person_id + "?");
		if (confirmed) {
			$.ajax({
				type: "post",
				url: "api.php?action=delete",
				data: {id: person_id},
				async: false,
				success: function(data) {
					if(data.status == "success") {
						location.reload();
					}
					else {
						alert(data.message);
					}
				}
			});
		}
	}

	// Job Title onchange
	$("#job_title").change(function() { 
		let value = $("#job_title").val();
		if(value == "direct_rep_a" || value == "direct_rep_b") {
			$("#agency_num_field").removeClass("hidden");
			$("#agency_num").prop("required", true);
		}
		else{
			$("#agency_num_field").addClass("hidden");
			$("#agency_num").prop("required", false);
			$("#agency_num").val("");
		}
	});

	// Check For Valid Input
	function checkInput() {
		let valid = true;
		let message = "<ul>";
		let person_id = $("#person_id").val().trim();
		let first_name =$("#first_name").val().trim();
		let last_name =$("#last_name").val().trim();
		let email =$("#email").val().trim();
		let hire_date =$("#hire_date").val();
		let input_date = new Date(hire_date + ' 00:00:00');
		let current_date = new Date();
		let job_title =$("#job_title").val();
		let agency_num =$("#agency_num").val().trim();
		if(person_id == "") {
			valid = false;
			message += "<li>Person ID is required</li>";
		}
		else if(!$.isNumeric(person_id) || person_id.toString().length != 7) {
			valid = false;
			message += "<li>Person ID is not a valid 7-digit number</li>";
		}
		if(first_name == "") {
			valid = false;
			message += "<li>First Name is required</li>";
		}
		if(last_name == "") {
			valid = false;
			message += "<li>Last Name is required</li>";
		}
		if(email == "") {
			valid = false;
			message += "<li>Email is required</li>";
		}
		else if(email.indexOf("@") < 0 || email.indexOf(".") < 0 || email.indexOf(" ") >= 0) {
			valid = false;
			message += "<li>Email is not valid</li>";
		}
		if(hire_date == "") {
			valid = false;
			message += "<li>Hire Date is required</li>";
		}
		else if(input_date > current_date) {	
			valid = false;
			message += "<li>Hire Date cannot be in the future</li>";
		}
		if(job_title == "") {
			valid = false;
			message += "<li>Job Title is required</li>";
		}
		else {
			switch(job_title) {
				case("ta_rep_a"):
				case("ta_rep_b"):
					break;
				case("direct_rep_a"):
				case("direct_rep_b"):
					if(agency_num == ""){
						valid = false;
						message += "<li>Agency Number is required</li>";
					}
					else if(!$.isNumeric(agency_num)) {
						valid = false;
						message += "<li>Agency Number is not numeric</li>";
					}
					break;
				default:
					valid = false;
					message += "<li>Job Title is not valid</li>";
			}
		}
		message += "</ul>";
		if(!valid) $("#error_message").html(message);
		else $("#error_message").empty();
		return valid;
	}
});