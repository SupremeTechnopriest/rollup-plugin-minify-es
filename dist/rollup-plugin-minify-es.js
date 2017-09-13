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
                    // Minify option
                    var opt = minifyMap[format];
                    opt = typeof opt == 'string' ? {dest: opt} : opt;

                    // Destination
                    var dest = opt.dest;
                    if (!dest) { return console.error('no dest, the minify plugin will abort for', format) }
                    var destObj = path.parse(dest);
                    delete opt.dest;

                    // Source Maps
                    var hasMaps = false;
                    var filename = destObj.base + '.map';
                    if(opt.sourceMaps) {
                        hasMaps = true;
                        delete opt.sourceMaps;
                        var url = opt.sourceMapUrl || filename;
                        delete opt.sourceMapUrl;
                        opt.sourceMap = { filename: filename, url: url };
                    }

                    // Minify
                    var result = uglifyEs.minify(code, opt);

                    // Write files
                    mkdirp.sync(destObj.dir);
                    fs.writeFileSync(dest, result.code, 'utf8');

                    if (hasMaps) {
                        fs.writeFileSync(path.join(destObj.dir, filename), result.map, 'utf8');
                    }

                }
            });
        }
    }
}

module.exports = rollup_plugin_minify;
