var html2pdf = require('html2pdf'),
	express = require('express'),
	fs = require('fs');

var app = express();

app.get('/convert', function(req, res) {
	html2pdf.convert({output: 'test.pdf', html: 'templates/demo.html', css : "margin: 23px !important;"}, function() {
		fs.readFile('test.pdf', function (err, data) {
			console.log ("writing response...");
		    res.contentType("application/pdf");
		    res.end(data, "binary");
		});
	});
});

app.listen(8080);
console.log('Listening on port 8080...');