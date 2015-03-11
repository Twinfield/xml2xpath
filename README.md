# xsd2xpath
Generate list of possible XPaths based on XSD

# Usage


```javascript
var parse = require('xsd2xpath');

parse('example.xsd', {skipRoot: true}, function(xpaths) {
	console.log(xpaths.join('\n'));		
});

```
will generate:
```
header                                 
header/fiscalYear                      
header/startDate                       
header/endDate                         
header/curCode                         
header/dateCreated                     
header/softwareDesc                    
header/softwareVersion                 
company                                
company/companyIdent                   
company/companyName                    
...
```
