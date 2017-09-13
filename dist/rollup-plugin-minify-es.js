'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mkdirp = _interopDefault(require('mkdirp'));
var path = _interopDefault(require('path'));
var fs = require('fs');
var uglifyEs = require('uglify-es');

function rollup_plugin_minify (minifyMap) {
  return {
    name: 'minify',
    transformBundle: function transformBundle(code, option) {
      Object.keys(minifyMap).forEach(function (format) {
        if (option.format == format) {
          // init opt for minify
          var opt = minifyMap[format];
          opt = typeof opt == 'string' ? {dest: opt} : opt;

          var dest = opt.dest;
          if (!dest) { return console.error('no dest, the minify plugin will abort for', format) }
          var destObj = path.parse(dest);

          // prepare opt
          delete opt.dest;

          if(opt.sourceMaps) {
            delete opt.sourceMaps;
            var filename$1 = destObj.base + '.map';
            var url = opt.sourceMapUrl || filename$1;
            delete opt.sourceMapUrl;
            opt.sourceMap = { filename: filename$1, url: url };
          }

          var result = uglifyEs.minify(code, opt);
          // ensure the target folder exists
          mkdirp.sync(destObj.dir);
          fs.writeFileSync(dest, result.code, 'utf8');

          if (opt.sourceMaps) {
            fs.writeFileSync(path.join(destObj.dir, filename), result.map, 'utf8');
          }

        }
      });
    }
  }
}

module.exports = rollup_plugin_minify;
