var xpathParser = require('../parse');

xpathParser.parseXml('books.xml', function(err,xpaths) {
	if (err)
		console.error(err);
	else
		console.log(xpaths.join('\n'));
});