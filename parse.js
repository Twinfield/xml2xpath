var util = require('util');
var xml = require("node-xml");
var path = [];

var visited = {};

var parser = new xml.SaxParser(function(cb) {
  cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
      if (elem != 'element') return;
      if (attrs[0][0]!='name') return;

      var name = attrs[0][1];
      if (name=='auditfile') return;
      path.push(name);
      var p = path.join('/');
      if (!visited[p]) {
	  console.log(path.join('/'));
          visited[p] = true;
      }
  });
  cb.onEndElementNS(function(elem, prefix, uri) {
      if (elem!='element') return;
      path.pop();
  });
  cb.onError(function(msg) {
      util.log('<ERROR>'+JSON.stringify(msg)+"</ERROR>");
  });
});
//parser.parseFile("example.xml");
parser.parseFile("AuditfileFinancieelVersie3.1.xsd");