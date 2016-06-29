'use strict';

var assert = require('assert');

var pdf = require('../lib/phantom-html2pdf');

describe('phantom-html2pdf.js', function() {
  describe('Simple end to end test', function() {

    it('Should generate a PDF file without crashing', function(done) {
      this.timeout(10000)
      var pdfOptions = {
        'html': '<!DOCTYPE html><html lang="en"><body><h1>Hello</h1><p>World</p></body></html>',
        'papersize': {format: 'A4', orientation: 'portrait', border: '1cm'}
      };

      pdf.convert(pdfOptions, function (err, result) {
        assert(!err, "Error is empty");
        result.toBuffer(function (buffer) {
          assert(buffer, 'A buffer is returned');
          assert(buffer.length > 0, 'The generated buffer is not empty');
          done();
        });
      });
    });
  })
});
