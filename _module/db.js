const sqlite3 = require('sqlite3').verbose();
const SQLiteObject = {
	init : function(file){
		return new sqlite3.Database(file, function(err){
			if(err){
				console.error(err.message);
			}
		});
	}
}

module.exports.init = function(file) {
	var db = SQLiteObject.init(file);

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
