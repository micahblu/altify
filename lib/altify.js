exports.altify = function(file, async){
	async = (async === undefined ? true : false);

	var fs = require('fs'),
			total = 0
			count = 0;

	function capitalize(str){	
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function addalts(content){
		count = 0;
		return content.replace(/(<img(?!.*?alt=(['"]).*?\2)[^>]*)(>)/g, function(img){
	  	total++; count++;
	  	var src = img.match(/src=(['"][^'"]+['"])+/);
	  	if(src && src[1]){
				src = src[1].replace(/['"]+/g, '');
			  filename = src.substr(src.lastIndexOf('/')+1).replace(/\..+/, ''),
			  alt = filename.replace(/[-_]+/g, ' ').replace(/[0-9]+/g, ''),
				alt = capitalize(alt);
				
				return img.replace(/\s?\/?>/, ' alt="' + alt + '" />');
	  	}
	  });
	}

	function totals(file){
		console.log(count + ' alt tags added to ' + file);
	}

	if(async){
		fs.readFile(file, function (err, data) {
		  if (err) throw err;
		  var content = addalts(data.toString());
		  
		  fs.writeFile(file, content, function (err) {
			  if (err) throw err;
			  totals(file);
			});
		});
	}else{
		var data = fs.readFileSync(file);
		var content = addalts(data.toString());
		fs.writeFileSync(file, content);
		totals(file);
	}
}