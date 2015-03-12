var dom = require("xmldom").DOMParser;
var fs = require("fs");
var xpath = require("xpath");

function parseXml(fileName, cb) {
    fs.readFile(fileName,{},function(err,data) {
        if (err) {
            cb(err);
            return;
        }
        var doc = new dom().parseFromString(data.toString());
        var result = [];
        var path = [];
        var inspect = function(elem) {
            path.push(elem.nodeName);
            var xpath = path.join('/');
            if (result.indexOf(xpath)==-1) result.push(xpath);
            for (var i = 0; i < elem.childNodes.length; i++) {
                var child = elem.childNodes[i];
                if (child.nodeType==1) inspect(child);
            }
            path.pop();
        };
        inspect(doc.documentElement);
        cb(null,result);
    });
}

var xsdSelect = xpath.useNamespaces({"xsd": "http://www.w3.org/2001/XMLSchema"});

function parseXsd(fileName,cb) {
    fs.readFile(fileName,{},function(err,data) {
        if (err) {
            cb(err);
            return;
        }
        var doc = new dom().parseFromString(data.toString());

        var getXPaths = function(element,path) {
            var pushed = false;
            var result = [];
            if (element.localName=='element') {
                var name = element.getAttribute('name');
                path.push(name);
                pushed = true;
                var xpath = path.join('/');
                result.push(xpath);
                var type = element.getAttribute('type');
                if (type) {
                    var typeDef = xsdSelect("//xsd:schema/xsd:complexType[@name='" + type + "']", doc);
                    if (typeDef && typeDef.length==1) {
                        var typePaths = getXPaths(typeDef[0], path);
                        result = result.concat(typePaths);
                    }
                }
            }
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                if (child.nodeType==1) {
                    var inner = getXPaths(child,path);
                    if (inner&&inner.length>0) result = result.concat(inner);
                }
            }
            if (pushed) path.pop();
            return result;
        };
        var elements = xsdSelect("//xsd:schema/xsd:element", doc);
        var result = getXPaths(elements[0],[]);
        cb(null,result);
    });
}

module.exports.parseXsd = parseXsd;
module.exports.parseXml = parseXml;