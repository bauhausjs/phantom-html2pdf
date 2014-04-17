# phantomjs-pdf for NodeJS

Simple and lightweight HTML to text conversion using Node and PhantomJS.

## Installation

````
npm install phantomjs-pdf
````

## Dependencies

1. PhantomJS
2. Async
3. Temp
4. Debug

## Conversion API

The API exposes a single function 'convert'. Using this function, you can input a multitude of settings, which are further specified below:

```` javascript
var pdf = require('phantomjs-pdf');

pdf.convert(options, function(result) {
	
	/* Using a buffer and callback */
	result.toBuffer(function(returnedBuffer) {});

	/* Using a readable stream */
	var stream = result.toStream();

	/* Using the temp file path */
	var tmpPath = result.getTmpPath();

	/* Using the file writer and callback */
	result.toFile("/path/to/file.pdf", function() {});
});
````

## Options

Calling convert() requires an options object, which includes the following definitions:

```` json
{
	"html" : "Path to HTML file",
	"css" : "Path to additional CSS file",
	"js" : "Path to additional JavaScript file",
	"runnings" : "Path to runnings file. Check further below for explanation.",
	"deleteOnAction" : true/false (Deletes the created temp file once you access it via toBuffer() or toFile())
}
````

Instead of paths, one can also provide properly escaped source code.

## Runnings File

https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#wiki-webpage-paperSize