var system = require("system"),
    page = require("webpage").create(),
    fs = require("fs");

var cmdArgs = ["htmlPath", 
            "pdfPath", 
            "cssPath", 
            "jsPath", 
            "runningsPath", 
            "paperFormat", 
            "paperOrientation", 
            "paperBorder", 
            "renderDelay"];

args = cmdArgs.reduce(function (args, name, i) {
    args[name] = system.args[i + 1];
    return args;
}, {});

page.open(page.libraryPath + "/skeleton.html", function (status) {
  
  if (status == "fail") {
    page.close();
    phantom.exit(1);
    return;
  }
  
  /* Add HTML source to the page */
  page.evaluate(function(html) {
    var body = document.querySelector("body")

    body.innerHTML = html
  }, fs.read(args.htmlPath));

  /* Add CSS source to the page */
  page.evaluate(function(cssPath) {
    var head = document.querySelector("head");
    var css = document.createElement("link");
    
    css.rel = "stylesheet";
    css.href = cssPath;
    
    head.appendChild(css);
  }, args.cssPath);

  /* Add JS source to the page */
  page.evaluate(function(jsPath) {
    var head = document.querySelector("head");
    var script = document.createElement("script");
    
    script.src = jsPath;
    
    head.appendChild(script);
  }, args.jsPath);

  /* Alter pagesize according to specified header/footer data */
  var defaultFormat = {format: args.paperFormat, orientation: args.paperOrientation, border: args.paperBorder};
  page.paperSize = defaultFormat;

  if (args.runningsPath !== "nofile") {
    var runnings = require(args.runningsPath);
    page.paperSize = paperSize(args.runningsPath, defaultFormat);
  }

  /* Render the page */
  setTimeout(function () {
    page.render(args.pdfPath);
    page.close();
    phantom.exit(0);
  }, parseInt(args.renderDelay, 10));
  
});

function paperSize(runningsPath, obj) {
  // encapsulate .contents into phantom.callback()
  //   Why does phantomjs not support Array.prototype.forEach?!
  var keys = ["header", "footer"]
  for (var i = 0; i < keys.length; i++) {
    var which = keys[i]
    if (runnings[which]
      && runnings[which].contents
      && typeof runnings[which].contents === "function") {
      obj[which] = {
        contents: phantom.callback(runnings[which].contents)
      }
      if (runnings[which].height)
        obj[which].height = runnings[which].height
    }
  }
  
  return obj
}