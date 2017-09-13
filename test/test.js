const assert  = require('assert')
const { format:f } = require('util')
const { exec } = require('child_process')
const path = require('path')
const { readFileSync, unlinkSync } = require('fs')
const { rollup } = require('rollup')
const { minify } = require('uglify-es')
const lib = require('../')

const base = path.join(__dirname, './fixtures/')
process.chdir(base)

function compareFile(file, str) {
  assert.equal(readFileSync(file, 'utf8'), str)
}

function testResult(source, opt, target, done) {

  const result = minify(
    readFileSync(source, 'utf8'),
    opt
  )

  if(target) {
    compareFile(target, result.code)
    let dir = path.parse(target).dir
    if(opt.sourceMaps) compareFile(target+'.map', result.map)
  }

  // clean up
  unlinkSync(source)
  if(target) {
    unlinkSync(target)
    if(opt.sourceMaps) unlinkSync(target+'.map')
  }
  done()
}

/**
 * run rollup with plugin option, and the real uglifyOption
 * @param {object} option plugin option
 * @param {object} uglifyOption the transformed uglify option
 * @param {function} done
 */
function run(option, uglifyOption, done) {
  const iife = option.iife
  const minifyDest = typeof iife=='string' ? iife : iife.dest
  const iifeDest = 'dist/iife.js'
  rollup({
    entry: entry,
    plugins: [lib(option)],
  }).then(bundle => {
    bundle.write({
      format: 'iife',
      dest: iifeDest
    }).then(() => {
      testResult(iifeDest, uglifyOption, minifyDest, done)
    }).catch(e=>done(e))
  }).catch(e=>done(e))
}

const entry = 'unminified.js'

describe('test', function () {
  this.timeout(15000)

  it('should be minified with sourcemaps', function (done) {
    run({iife: { dest: 'dist/min.js', sourceMaps: true }}, { sourceMap: { filename: 'min.js.map', url: 'min.js.map'}}, done)
  })

  it('should be minified with custom sourceMapUrl', function (done) {
    run({iife: { dest: 'dist/min.js', sourceMaps: true, sourceMapUrl: 'source.js.map'}}, {sourceMap: { filename: 'source.js.map', url: 'source.js.map'}}, done)
  })

  it('should not be minified with empty options', function (done) {
    run({iife: {}}, {}, done)
  })

  it('should not be minified with empty string', function (done) {
    run({iife: ''}, {}, done)
  })
})
