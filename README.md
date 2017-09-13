# rollup-plugin-minify-es
Rollup plugin to minify generated format into new minified file, with source maps, using [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony).

[![CircleCI](https://circleci.com/gh/edgemesh/rollup-plugin-minify-es.svg?style=svg)](https://circleci.com/gh/edgemesh/rollup-plugin-minify-es)

## Install

``` bash
npm install rollup-plugin-minify-es
```

## Usage

``` javascript
import { rollup } from 'rollup'
import minify from 'rollup-plugin-minify-es'

rollup({
    entry: 'src.js',
    plugins: [
        minify({iife: 'iife.min.js', cjs: 'cjs.min.js'})
    ]
})
```

This will generate minified `"iife.min.js"` file with `iife` format, so and `cjs`.

You can pass [uglify-es options](https://github.com/mishoo/UglifyJS2/tree/harmony#api-reference), as below:

``` javascript
    plugins: [
        minify({ iife: {
          dest: 'iife.min.js',
          mangle: false,
          sourceMapUrl: 'localhost/out.js.map'
        }})
    ]
```

## License

MIT
