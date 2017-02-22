'use strict';

var pdf = require('./lib/phantom-html2pdf');

var pdfOptions = {
  html: '<!DOCTYPE html><html lang="en"><body><h1>Hello</h1><p>World</p></body></html>',
  paperSize: {
    format: 'A4',
    orientation: 'landscape', // portrait
    border: '1cm'
  }
};

pdf.convert(pdfOptions, function(err, result) {
  result.toFile("./file.pdf", function() {
    console.log('Done');
  });
});
