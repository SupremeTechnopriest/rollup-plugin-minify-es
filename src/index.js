import mkdirp from 'mkdirp'
import path from 'path'
import { writeFileSync } from 'fs'
import { minify } from 'uglify-es'

export default function rollup_plugin_minify (minifyMap) {
    return {
        name: 'minify',
        transformBundle(code, option) {
            Object.keys(minifyMap).forEach(format => {
                if (option.format == format) {
                    // Minify option
                    let opt = minifyMap[format]
                    opt = typeof opt == 'string' ? {dest: opt} : opt

                    // Destination
                    let dest = opt.dest
                    if (!dest) return console.error('no dest, the minify plugin will abort for', format)
                    const destObj = path.parse(dest)
                    delete opt.dest

                    // Source Maps
                    let hasMaps = false
                    const filename = destObj.base + '.map'
                    if(opt.sourceMaps) {
                        hasMaps = true
                        delete opt.sourceMaps;
                        const url = opt.sourceMapUrl || filename
                        delete opt.sourceMapUrl;
                        opt.sourceMap = { filename, url }
                    }

                    // Minify
                    const result = minify(code, opt)

                    // Write files
                    mkdirp.sync(destObj.dir)
                    writeFileSync(dest, result.code, 'utf8')

                    if (hasMaps) {
                        writeFileSync(path.join(destObj.dir, filename), result.map, 'utf8')
                    }

                }
            })
        }
    }
}
