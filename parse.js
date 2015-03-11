var util = require('util');
var xml = require("node-xml");


function Parser() {}
Parser.prototype.parse = function(filename, caller_cb, options) {
    var self = this;
    if (options) {
        var temp_cb = caller_cb;
        caller_cb = options;
        options = temp_cb;
    }
    var path = [];
    var xpaths = [];
    var rootVisited = false;
    
    var parser = new xml.SaxParser(function(cb) {
        cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
	
	    var shouldCheck = self.shoudInclude(elem, attrs, prefix, uri, namespaces);

	    if (!shouldCheck) return;

            if (!rootVisited && options && options.skipRoot) { 
                rootVisited = true;
                return;
            }

            rootVisited = true;            

            var name = self.getName(elem, attrs, prefix, uri, namespaces);
            path.push(name);

            var p = path.join('/');
            if (xpaths.indexOf(p)==-1) {
                xpaths.push(p);
            }
        });
        cb.onEndElementNS(function(elem, prefix, uri) {            
            if (!self.shouldGoBack(elem, prefix, uri,options)) return;
            path.pop();
        });
        cb.onError(function(msg) {
            util.log('<ERROR>' + JSON.stringify(msg) + "</ERROR>");
        });
        cb.onEndDocument(function() {
          caller_cb(xpaths);
        });
    });

    return parser.parseFile(filename);

}

xsdParser = new Parser();

xsdParser.shoudInclude = function(elem, attrs) {
            return elem == 'element'&& attrs[0][0] == 'name';
}
xsdParser.shouldGoBack = function(elem, attrs) {
            return elem == 'element';
}

xsdParser.getName = function(elem, attrs) {
	    return attrs[0][1];
}

xmlParser = new Parser();

xmlParser.shoudInclude = function(elem, attrs) {
	return true;
}
xmlParser.shouldGoBack = function(elem, attrs) {
	return true;
}

xmlParser.getName = function(elem, attrs) {
	return elem;
}


module.exports.parseXsd = xsdParser.parse.bind(xsdParser);
module.exports.parseXml = xmlParser.parse.bind(xmlParser);