exports.altify = function(file){
	
	var fs = require('fs'),
			total = 0;

	function capitalize(str){	
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	fs.readFile(file, function (err, data) {
	  if (err) throw err;
	  var count=0;

	  var content = data.toString().replace(/(<img(?!.*?alt=(['"]).*?\2)[^>]*)(>)/g, function(img){
	  	total++;
	  	count++;
	  	var src = img.match(/src=(['"][^'"]+['"])+/)[1].replace(/['"]+/g, '');
	  		  filename = src.substr(src.lastIndexOf('/')+1).replace(/\..+/, ''),
	  		  alt = filename.replace(/[-_]+/g, ' ').replace(/[0-9]+/g, ''),
	  			alt = capitalize(alt);
	  
			return img.replace(/\s?\/?>/, ' alt="' + alt + '" />');
	  });
	  fs.writeFile(file, content, function (err) {
		  if (err) throw err;
		  console.log(count + ' alt tags added to ' + file);
		  console.log(total + ' total alt tags added');
		});
	});
}