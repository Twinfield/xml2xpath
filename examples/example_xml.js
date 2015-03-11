var xpathParser = require('../parse');

xpathParser.parseXml('books.xml', {skipRoot: false}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});