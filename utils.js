
var fs = require("fs");

var DATA_PATH = __dirname + "/data/";

function get_data_path() {

	return DATA_PATH;
}

function create_file(fname, callback) {

	let csv_header = "TIME,HOST,CLIENT,PING,DOWNLOAD,UPLOAD\n";

	fs.appendFile(fname, csv_header, (err) => {

		if(err) {
			console.error(err);
			callback(err);
			return;
		}

		console.log("File created: %s", fname);
		callback(null);
	});
}

function get_todays_date() {

	let dateString = new Date().toDateString();
	let date = dateString.split(" ").splice(1).join("-");

	return date;
}

function get_todays_filename() {

	let filename = get_todays_date() + ".csv";
	let filepath = DATA_PATH + filename; 

	return filepath;
}

function get_todays_filename_summary() {

	let filename = get_todays_date() + "-summary" + ".csv";
	let filepath = DATA_PATH + filename; 

	return filepath;
}



module.exports = {

	create_file: create_file,
	get_filename: get_todays_filename,
	get_filename_summary: get_todays_filename_summary,
	get_data_path: get_data_path
}