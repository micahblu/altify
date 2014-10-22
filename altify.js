(function(){

	var fs = require('fs');
	var path = process.argv[2];
	var flags = {};
	var total = 0;

	function rename(existing, newname){
		fs.rename(existing, newname, function(err) {
	    if ( err ) console.log('ERROR: ' + err);
		});
	}

	function altify(file){

		fs.readFile(file, function (err, data) {
		  if (err) throw err;
		  var count=0;
		  //console.log(data.toString().match(/<img.+>/g));
		  var content = data.toString().replace(/(<img(?!.*?alt=(['"]).*?\2)[^>]*)(>)/g, function(img){
		  	total++;
		  	count++;
		  	var src = img.match(/src=['"](.+)['"]/)[1],
		  			filename = src.substr(src.lastIndexOf('/')+1).replace(/\..+/, ''),
		  			alt = filename.replace(/[-_]+/g, ' ').replace(/[0-9]+/g, '');
		  			alt = capitalize(alt);
		  	console.log('converting ' + img + ' => ' + img.replace(/\s?\/?>/, ' alt="' +  alt + '" />'));
		  	return img.replace(/\s?\/?>/, ' alt="' +  alt + '" />');
		  });

		  fs.writeFile(file, content, function (err) {
			  if (err) throw err;
			  console.log(count + ' alt tags added to ' + file);
			  console.log(total + ' total alt tags added');
			});
		});
	}

	function capitalize(str){	
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

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

		    altify(path+files[i]);
		  }
		}else{
			altify(path);
		}

	});
}).call(this);