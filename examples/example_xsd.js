var xpathParser = require('../parse');

xpathParser.parseXsd('example.xsd', {skipRoot: false}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});