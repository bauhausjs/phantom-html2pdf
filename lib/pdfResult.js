"use strict"

var fs = require("fs"),
	tmp = require("tmp"),
	debug = require('debug')('phantomjs-pdf');

var method = PDFResult.prototype;

function PDFResult(err, tmpPath, deleteOnAction) {
    this._err = err;
    this._tmpPath = tmpPath;
    this._deleteOnAction = deleteOnAction;
    this._invalid = false;
}

method.toStream = function() {
	if (this._invalid) throw new Error('PDFResult became invalid after deletion!');

	return fs.createReadStream(this._tmpPath);
};

method.toBuffer = function(callback) {
	if (this._invalid) throw new Error('PDFResult became invalid after deletion!');

	var buffers = [];
	var buffer;
	var stream = fs.createReadStream(this._tmpPath);
	var resultObject = this;

	stream.on('data', function(data) { 
		buffers.push(data); 
	});

	stream.on('end', function() {
		buffer = Buffer.concat(buffers);

		if (resultObject._deleteOnAction) { resultObject.deleteTmpFile(); }
		if (typeof callback === "function") { callback(buffer); }
	});
};

method.getTmpPath = function() {
    return this._tmpPath;
};

method.toFile = function(path, callback) {
	if (this._invalid) throw new Error('PDFResult became invalid after deletion!');

	var outputStream = fs.createWriteStream(path);
    var operation = fs.createReadStream(this._tmpPath).pipe(outputStream);
    var resultObject = this;

	operation.on('close', function() {
		if (resultObject._deleteOnAction) { resultObject.deleteTmpFile(); }
		if (typeof callback === "function") { callback(); }
	});
};

method.deleteTmpFile = function() {
	var resultObject = this;

	fs.unlink(this._tmpPath, function (err) {
	  if (err) throw err;

	  debug('Successfully deleted "%s"', resultObject._tmpPath);
	  resultObject._tmpPath = '';
	  resultObject._invalid = true;
	});
}

module.exports = PDFResult;