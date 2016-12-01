"use strict";

var fs = require("fs"),
  path = require("path"),
  phantom = require("phantomjs-prebuilt"),
  childProcess = require("child_process"),
  Promise = require('bluebird'),
  tmp = require("tmp"),
  debug = require('debug')('phantom-html2pdf'),
  PDFResult = require("./pdfResult.js");

/* Evaluates and converts input HTML, CSS and JS to PDF
 *
 * Returns Promise
 *
 */

function convert(options) {
  options = options || {};

  var html = options.html || '<p>No HTML source specified!</p>',
    css = options.css || '',
    js = options.js || '',
    runnings = options.runnings || '',
    keepTmpFiles = options.keepTmpFiles === true,
    paperSize = options.paperSize || {},
    runningsArgs = options.runningsArgs ? JSON.stringify(options.runningsArgs) : '';

  /* Create temporary files for PDF, HTML, CSS and JS storage
   * We need to wait for all of them to finish creating the files before proceeding.
   */

  var p1 = createTempFile('.html', html),
    p2 = createTempFile('.pdf', ''),
    p3 = css ? createTempFile('.css', css) : undefined,
    p4 = js ? createTempFile('.js', js) : undefined,
    p5 = runnings ? createTempFile('.runnings.js', runnings) : 'nofile';

  return Promise.all([p1, p2, p3, p4, p5]).then(function (results) {

    var paperFormat = paperSize.format || "A4",
      paperOrientation = paperSize.orientation || "portrait",
      paperBorder = paperSize.border || "1cm",
      paperWidth = paperSize.width || 'false',
      paperHeight = paperSize.height || 'false',
      renderDelay = paperSize.delay || 500;

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
      renderDelay,
      runningsArgs
    ];

    return new Promise(function (resolve, reject) {
      childProcess.execFile(phantom.path, childArgs, function (err) {
        var opPointer = new PDFResult(err, results[1]);
        return err ? reject(err) : resolve(opPointer);
      });
    });
  });

  function createTempFile(extension, contents) {
    return new Promise(function (resolve, reject) {
      var needsTempFile = false;

      try {
        if (fs.lstatSync(path.resolve(contents)).isFile()) {
          debug('Found file "%s"', contents);
          resolve(path.resolve(contents));
        } else {
          needsTempFile = true;
        }
      } catch (err) {
        needsTempFile = true;
      }

      if (needsTempFile) {
        debug('Creating temp %s...', extension);

        tmp.file({postfix: extension, keep: keepTmpFiles}, function (err, tmpPath, tmpFd) {
          if (err) {
            reject(err);
          }

          var buffer = new Buffer(contents);

          fs.write(tmpFd, buffer, 0, buffer.length, null, function (err) {
            if (err) {
              debug('Could not create temp file! %s', err);
            }

            fs.close(tmpFd);
            resolve(tmpPath);
          });
        });
      }
    });
  }
}

exports.convert = convert;