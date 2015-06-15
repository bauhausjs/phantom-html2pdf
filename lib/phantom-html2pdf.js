"use strict"

var fs = require("fs"),
	path = require("path"),
	phantom = require("phantomjs"),
	childProcess = require("child_process"),
	tmp = require("tmp"),
	async = require("async"),
	debug = require('debug')('phantom-html2pdf'),
	PDFResult = require("./pdfResult.js");

/* TODO: Add config for HTML2PDF class.
 * Including path to skeleton html file
 */

/* Evaluates and converts input HTML, CSS and JS to PDF
 *
 * Callback format: callback(err, result)
 * If err === null, function succeeded.
 */

function convert(options, callback) {
	var options = options || {},
    html = options.html || '<p>No HTML source specified!</p>',
    css = options.css || '',
    js = options.js || '',
    runnings = options.runnings || '',
    deleteOnAction = options.deleteOnAction || false,
    paperSize = options.paperSize || {};

    /* Create temporary files for PDF, HTML, CSS and JS storage
     * We need to wait for all of them to finish creating the files before proceeding.
     */
    async.series([
	    function(callback) {
	    	createTempFile(".html", html, callback);
	    },
	    /* PDF file is necessary for further access within Node */
	    function(callback) {
	    	createTempFile(".pdf", "", callback);
	    },
	    /* Create optional CSS injection file */
	    function(callback) {
	    	(css) ? createTempFile(".css", css, callback) : callback(null, null);
	    },
	    /* Create optional JS injection file */
	    function(callback) {
	    	(js) ? createTempFile(".js", js, callback) : callback(null, null);
	    },
	    /* Create runnings (JSON header, footer) file */
	    function(callback) {
	    	(runnings) ? createTempFile(".runnings", runnings, callback) : callback(null, "nofile");
	    },
	],
	/* err/results-Structure
	 * [0] = HTML temp file
	 * [1] = PDF temp file
	 * [2] = CSS temp file
	 * [3] = JS temp file
	 * [4] = Runnings temp file
	 */
	function(err, results) {
	    var paperFormat = paperSize.format || "A4";
		var paperOrientation = paperSize.orientation || "portrait";
		var paperBorder = paperSize.border || "1cm";
		var paperWidth  = paperSize.width || 'false';
		var paperHeight = paperSize.height || 'false';
		var renderDelay = paperSize.delay || 500;

		/* All necessary files have been created.
	     * Construct arguments and create a new phantom process.
	     */
	    var childArgs = [
			path.join(__dirname, "phantom-script.js"),
			results[0],
			results[1],
			results[2],
			results[3],
			results[4],
			paperFormat,
			paperOrientation,
			paperBorder,
			paperWidth,
			paperHeight,
			renderDelay
		];

		childProcess.execFile(phantom.path, childArgs, function(err, stdout, stderr) {
			var opPointer = new PDFResult(err, results[1]);

			if (typeof callback === "function") {
				callback(opPointer);
			}
		});
	});
}

function createTempFile(extension, contents, callback)
{
	var needsTempFile = false;

	try {
		if (fs.lstatSync(path.resolve(contents)).isFile()) {
			debug('Found file "%s"', contents);
			callback(null, path.resolve(contents));
		} else {
			needsTempFile = true;
		}
	} catch (err) {
		needsTempFile = true;
	}

	if (needsTempFile) {
		debug('Creating temp %s...', extension);
		tmp.file({postfix: extension}, function (err, tmpPath, tmpFd) {
		    if (err) { callback(err, null); }

		    var buffer = new Buffer(contents);

		    fs.write(tmpFd, buffer, 0, buffer.length, null, function(err, written, buffer) {
		    	if (err) { debug('Could not create temp file! %s', err); }

		    	fs.close(tmpFd);
		    	callback(null, tmpPath);
		    });
		});
	}
}

exports.convert = convert;
