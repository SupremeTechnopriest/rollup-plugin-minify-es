const assert = require('assert');
const rollup = require('rollup').rollup;
const readFile = require('fs').readFileSync;
const minify = require('../');

test('minify', () => {
    return rollup({
        entry: 'test/fixtures/unminified.js',
        plugins: [
            minify()
        ]
    }).then(bundle => {
        const result = bundle.generate({ format: 'cjs' });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.code).toEqual('"use strict";var a=5;a<3&&console.log(4);\n');
        expect(result.map).toBeFalsy();
    });
});

test('minify via minify options', () => {
    return rollup({
        entry: 'test/fixtures/empty.js',
        plugins: [
            minify({ output: { comments: 'all' } })
        ]
    }).then(bundle => {
        const result = bundle.generate({ banner: '/* package name */', format: 'cjs' });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.code).toEqual('/* package name */\n"use strict";\n');
        expect(result.map).toBeFalsy();
    });
});

test('minify with sourcemaps', () => {
    return rollup({
        entry: 'test/fixtures/sourcemap.js',
        plugins: [
            minify()
        ]
    }).then(bundle => {
        const result = bundle.generate({ format: 'cjs', sourceMap: true });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.map).toBeTruthy();
    });
});
