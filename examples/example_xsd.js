var xpathParser = require('../parse');

xpathParser.parseXsd('example.xsd',  function(err,xpaths) {
	if (err)
		console.error(err);
	else
		console.log(xpaths.join('\n'));
});