import mkdirp from 'mkdirp';
import path from 'path';
import { writeFileSync } from 'fs';
import { minify } from 'uglify-es';

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

          var result = minify(code, opt);
          // ensure the target folder exists
          mkdirp.sync(destObj.dir);
          writeFileSync(dest, result.code, 'utf8');

          if (opt.sourceMaps) {
            writeFileSync(path.join(destObj.dir, filename), result.map, 'utf8');
          }

        }
      });
    }
  }
}

export default rollup_plugin_minify;
