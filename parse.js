var util = require('util');
var xml = require("node-xml");


module.exports = function(filename, caller_cb, options) {
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

            if (elem != 'element') return;
            if (attrs[0][0] != 'name') return;        

            if (!rootVisited && options && options.skipRoot) { 
                rootVisited = true;
                return;
            }

            rootVisited = true;            

            var name = attrs[0][1];            
            path.push(name);

            var p = path.join('/');
            if (xpaths.indexOf(p)==-1) {
                xpaths.push(p);
            }
        });
        cb.onEndElementNS(function(elem, prefix, uri) {            
            if (elem != 'element') return;
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
