var html2pdf = require('html2pdf'),
	express = require('express'),
	fs = require('fs');

var app = express();

app.get('/convert', function(req, res) {
	html2pdf.convert({output: 'test.pdf', html: 'templates/demo.html', css : "margin: 23px !important;"}, function(result) {

		/* Using a buffer */
		result.toBuffer(function(buffer) {
			res.contentType("application/pdf");
			res.end(buffer, "binary");
		});

		/* Using a readable stream */
		// var stream = result.toStream();

		/* Using the temp file path */
		// var tmpPath = result.getTmpPath();

		/* Using the file writer */
		// result.toFile("/path/to/file.pdf", function() {});
	});
});

app.listen(8080);
console.log('Listening on port 8080...');