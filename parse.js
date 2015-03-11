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
    
    var xpaths = [];
    
    var state = {rootVisited: false, path:[]};
    
    var parser = new xml.SaxParser(function(cb) {
        cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
	
	    var shouldCheck = self.shoudInclude(elem, attrs, prefix, uri, namespaces, state);

	    if (!shouldCheck) return;

            if (!state.rootVisited && options && options.skipRoot) { 
                state.rootVisited = true;
                return;
            }

            state.rootVisited = true;            

            var name = self.getName(elem, attrs, prefix, uri, namespaces, state);
            state.path.push(name);

            var p = state.path.join('/');
            if (xpaths.indexOf(p)==-1) {
                xpaths.push(p);
            }
        });
        cb.onEndElementNS(function(elem, prefix, uri) {            
            if (!self.shouldGoBack(elem, prefix, uri, state)) return;
            state.path.pop();
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

xsdParser.shoudInclude = function(elem, attrs, prefix, uri, namespaces, state) {
            return elem == 'element'&& attrs[0][0] == 'name' && !state.afterRoot;
}
xsdParser.shouldGoBack = function(elem, attrs,uri, state) {
            if (state.path.length==1) {
                state.afterRoot = true;
            }
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