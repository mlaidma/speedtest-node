require('console-stamp')(console, '[HH:MM:ss.l]');
var fs = require("fs");
var speedtest = require("speedtest-net");


var DATA_PATH = __dirname + "/data/";
var MAX_TIME = 5000;
var MAX_SERVES = 1;
var TEST_INTERVAL = 15000;


function create_file(callback) {

	let filename = get_todays_filename();
	let csv_header = "TIME,HOST,PING,DOWNLOAD,UPLOAD\n";

	fs.appendFile(filename, csv_header, (err) => {

		if(err) {
			console.error(err);
			callback(err);
			return;
		}

		console.log("File created: %s", filename);
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

function write_data_to_file(data) {

	let date = new Date();
	let time = date.getUTCHours() + ":" + date.getUTCMinutes();
	let host = data.server.host;
	let ping = data.server.ping;
	let download = data.speeds.download;
	let upload = data.speeds.upload;
	let client = data.client.ip;

	let file = get_todays_filename();
	let dataString = [time, host, client, ping, download, upload].join(",") + "\n";
	
	fs.appendFile(file, dataString, (err) => {

		if(err) {
			console.error(err);
		}
	});
}

function log_data(data) {

	let filepath = get_todays_filename();

	if(!fs.existsSync(filepath)) {
		
		console.log("File doesn´t exist, creating %s", filepath);
		create_file((err) => {

			if(err) {
				console.err(err);
				return;
			}

			write_data_to_file(data);
		});

		return;
	}		

	write_data_to_file(data);
}


function run_tests() {

	let options = {
		maxTime: MAX_TIME,
		maxServers: MAX_SERVES
	};

	console.log("Running the speedtest.")
	let test = speedtest(options);


	test.on('data', data => {
		
		console.log("Speedtest complete, writing data");
		log_data(data);

		setTimeout(() => {
			//Schedule the next
			run_tests();
		}, TEST_INTERVAL);
	});

	test.on('error', err => {
	  	console.error(err);
	  	
	  	setTimeout(() => {
			//Schedule the next
			run_tests();
		}, TEST_INTERVAL);
	});
}


run_tests();