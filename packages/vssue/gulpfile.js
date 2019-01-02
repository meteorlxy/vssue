const gulp = require('gulp')
const rollup = require('rollup')
const rimraf = require('rimraf')
const path = require('path')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const rollupConfig = require('./rollup.config')

gulp.task('clean', () => {
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(__dirname, 'dist'), err => {
      if (err) reject(err)
      resolve()
    })
  })
})

function makeRollupTask (config) {
  async function buildTask () {
    const bundle = await rollup.rollup(config)
    await bundle.write(config.output)
  }

  buildTask.displayName = `rollup:${config.output.file}`

  return buildTask
}

gulp.task('rollup', gulp.series(
  gulp.parallel(
    ...rollupConfig.map(config => makeRollupTask(config)),
  ),
))

gulp.task('style', () => {
  return gulp.src([
    './src/styles/index.styl',
    require.resolve('github-markdown-css'),
  ]).pipe(stylus())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(concat('vssue.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([
      cssnano(),
    ]))
    .pipe(rename('vssue.min.css'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel(
    'rollup',
    'style',
  )
))
