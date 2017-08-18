# phantom-html2pdf for NodeJS

<a href="https://travis-ci.org/bauhausjs/phantom-html2pdf"><img src="https://travis-ci.org/bauhausjs/phantom-html2pdf.svg"/></a>

Simple and lightweight HTML to text conversion using Node and PhantomJS.

## Installation

````
npm install phantom-html2pdf
````

## Dependencies

1. PhantomJS
2. Async
3. Temp
4. Debug

## Conversion API

The API exposes a single function 'convert'. Using this function, you can input a multitude of settings, which are further specified below:

```` javascript
var pdf = require('phantom-html2pdf');

pdf.convert(options, function(err, result) {

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
	"paperSize" : "Two ways to do this, see below",
	"deleteOnAction" : true/false (Deletes the created temp file once you access it via toBuffer() or toFile()),
  "runningsArgs": Object (You can pass an object to the runnings file when you have wrapped it with a function)
}
````

Instead of paths, one can also provide properly escaped source code.

## Paper Size

Either supply a paper format, orientation and border (this is the default)
```` javascript
{format: 'A4', orientation: 'portrait', border: '1cm'}
````
Or supply a page width, height and border.
```` javascript
{width: '3in', height: '2in', border: '0.5in'}
````

See link below for accepted units and formats:

http://phantomjs.org/api/webpage/property/paper-size.html

## Runnings File

You can also wrap your runnings configuration with a function and pass runningsArgs.

## Known issues

On Macs the generated PDF is going to be a bitmap, however it works perfectly fine on Linux and Windows Servers.
So be careful when developing and testing on Macs; it's going to work in production :-)

## [FAQ](FAQ.md)

## License

[MIT](LICENSE)
