var parse = require('../parse');

parse('example.xsd', {skipRoot: true}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});