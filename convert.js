
// Read all the day files and create one big summary of all the data

var utils = require("./utils.js");
var fs = require("fs");
var readline = require("readline");

console.log("Coverter started...");

let filename = utils.get_filename_summary();

let UTC_date_prev = 0;

let datemap = {
	"Jan": 0,
	"Feb": 1,
	"Mar": 2,
	"Apr": 3, 
	"May": 4,
	"Jun": 5,
	"Jul": 6,
	"Aug": 7,
	"Sep": 8,
	"Oct": 9,
	"Nov": 10,
	"Dec": 11
}



function create_data_summary() {

	console.log("Creating data summary...");

	utils.create_file(filename, (err) => {

		if(err) throw err;

		console.log("Logging data");

		fs.readdir(utils.get_data_path(), (err, files) => {

			for (let file of files) {

				
				let file_split = file.split(".");
				let fname = file_split[0];
				let extension = file_split[1];

				if(extension !== "csv" || fname.includes("summary")) {
					continue;
				}

				let date_parts = fname.split("-");
				
				let month = date_parts[0];
				let day = parseInt(date_parts[1]);
				let year = parseInt(date_parts[2]);

				console.log("Exporting file %s", file);
				let data = fs.readFileSync(utils.get_data_path() + file, "utf-8");

				let lines = data.split("\n").filter(Boolean);

				for (let line of lines) {

					let line_split = line.split(",");

					if(line_split[0] === "TIME") continue;
					
					let time = line_split[0];
					let time_split = time.split(":");
					let hours = parseInt(time_split[0]);
					let minutes = parseInt(time_split[1]);

					let UTC_date = Date.UTC(year, datemap[month], day, hours, minutes);

					if(UTC_date < UTC_date_prev) console.log("UTC ERROR!");
					line_split[0] = UTC_date;
					line = line_split.join(",") + "\n";

					fs.appendFileSync(filename, line);

				}
			}
		});
	});	
}


if(fs.existsSync(filename)) {

	fs.unlink(filename, (err) => {
		
		if(err) throw err;
		console.log("File already existing, deleting and creating new");

		create_data_summary();
	});
}
else {

	create_data_summary(); 
}





