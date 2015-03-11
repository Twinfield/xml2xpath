# xsd2xpath
Generate list of possible XPaths based on XSD or XML

# Usage

## XSD 

To parse XSD, you need

```javascript
var xpathParser = require('xml2xpath');

xpathParser.parseXsd('example.xsd', {skipRoot: true}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});

```
will generate:
```
header                                 
header/fiscalYear                      
header/startDate                       
header/endDate                         
...
```
## XML

To parse XML, you need

```javascript
var xpathParser = require('xml2xpath');

xpathParser.parseXml('books.xml', {skipRoot: true}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});

```
will generate:
```
catalog                    
catalog/book               
catalog/book/author        
catalog/book/title         
catalog/book/genre         
catalog/book/price         
catalog/book/publish_date  
catalog/book/description
```

## Any other XMLs

Check `parse.js` how to extend Parser to support other XML formats

