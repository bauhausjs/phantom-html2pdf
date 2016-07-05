
# FAQ:

- [How to set a header and footer on each page?](FAQ.md#How to set a header and footer on each page?)
- [How to set Custom Fonts?](FAQ.md#How to set Custom Fonts?)

## How to set a header and footer on each page?

> Thanks to @faisalshabbir for this information!

Runnings file should look like this. `module.exports` will fix the problem for us. 
```
module.exports = {
    header: {
        height: '3cm', contents: function (page) {
            return '<header class="pdf-header" style=" overflow:hidden; font-size: 10px; padding: 10px; margin: 0 -15px; color: #fff; background: none repeat scroll 0 0 #00396f;"><img style="float: left;" alt="" src="../images/logo.jpg"><p> XYZ </p></header>'
        }
    },

    footer: {
        height: '3cm', contents: function (page) {
            return '<footer class="pdf-footer" style="font-size: 10px; font-weight: bold; color: #000;><p style="margin: 0">Powered by XYZ</p></footer>'
        }
    },

}
```

## How to set Custom Fonts?

> Thanks to @befreestudios for this information!

Custom fonts on PhantomJS step-by-step for Ubuntu:

- Get a Type1 version of the font you need. I needed to do a conversion from TrueType— there are lots of tools to do this with.
- Upload your Type1 font to your ‘/usr/share/fonts/type1' directory.
- Run ‘fc-cache -fv’
- Enjoy having PhantomJS with your new font.

