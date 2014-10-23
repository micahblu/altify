(function(){

	var fs = require('fs'),
			altify = require('./altify'),
			path = process.argv[2],
			flags = {};

	process.argv.forEach(function(arg){
		if(arg.charAt(0) == '-'){
			flags[arg.substr(1, arg.indexOf("=")-1)] = arg.substr(arg.indexOf("=")+1);
		}
	});

	if(path === "" || path == null){
		console.log('Please enter a path');
		return false;
	}

	fs.exists(path, function(exists){

		if(!exists) {
			console.log("Invalid path");
			return false;
		}

		var dir = flags.dir ? flags.dir : path;

		fs.exists(dir, function(exists){
			if(!exists){
				fs.mkdir(dir, function(e){
					console.log(e);
				});
			}
		});

		if(fs.lstatSync(path).isDirectory()){
			var files = fs.readdirSync(path);
			var isHTML = /(\.html|\.htm|\.php)/;
		  for(var i in files){

		    if(!files.hasOwnProperty(i) || !isHTML.test(files[i])) continue;
		    if(flags.exclude && flags.exclude.split(",").indexOf(files[i]) > -1) continue;

		    altify.altify(path+files[i]);
		  }
		}else{
			altify.altify(path);
		}

	});
}).call(this);