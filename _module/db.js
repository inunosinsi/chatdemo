const sqlite3 = require('sqlite3').verbose();

module.exports.init = function(file) {
	var db = new sqlite3.Database(file, function(err){
		if(err){
			//console.error(err.message);
		}
	});

	db.run("SELECT * FROM message_table", function(err, res){
		if(err){
			db.run(require("fs").readFileSync("./_module/init.sql").toString(), function(err){
				if (err) {
					console.error("CREATE ERROR : " + err.message);
				}
			});
		}
	});

	return db;
}
