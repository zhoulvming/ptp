const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const path = require('path');
const eslint = require('gulp-eslint');

const srcPath_mp = './src/miniprogram/**';
const srcPath_pg = './src/plugin/**';
const distPath_mp = './dist/miniprogram/';
const distPath_pg = './dist/plugin/';
const distPath_utils = './dist/utils/';
const srcPath_utils = './src/utils/**';


// const wxmlFiles = [`${srcPath}/*.wxml`, `!${srcPath}/_template/*.wxml`];
const wxmlFiles_mp = [`${srcPath_mp}/*.wxml`, `!${srcPath_mp}/_template/*.wxml`];
const wxmlFiles_pg = [`${srcPath_pg}/*.wxml`, `!${srcPath_pg}/_template/*.wxml`];
// const lessFiles = [
//   `${srcPath}/*.less`,
//   `!${srcPath}/styles/**/*.less`,
//   `!${srcPath}/_template/*.less`
// ];
const lessFiles_mp = [
  `${srcPath_mp}/*.less`,
  `!${srcPath_mp}/styles/**/*.less`,
  `!${srcPath_mp}/_template/*.less`
];
const lessFiles_pg = [
  `${srcPath_pg}/*.less`,
  `!${srcPath_pg}/styles/**/*.less`,
  `!${srcPath_pg}/_template/*.less`
];

// const jsonFiles = [`${srcPath}/*.json`, `!${srcPath}/_template/*.json`];
// const jsFiles = [`${srcPath}/*.js`, `!${srcPath}/_template/*.js`, `!${srcPath}/env/*.js`];
// const imgFiles = [
//   `${srcPath}/images/*.{png,jpg,gif,ico}`,
//   `${srcPath}/images/**/*.{png,jpg,gif,ico}`
// ];
const jsonFiles_mp = [`${srcPath_mp}/*.json`, `!${srcPath_mp}/_template/*.json`];
const jsFiles_mp = [`${srcPath_mp}/*.js`, `!${srcPath_mp}/_template/*.js`, `!${srcPath_mp}/env/*.js`];
const imgFiles_mp = [
  `${srcPath_mp}/**/images/*.{png,jpg,gif,ico}`,
  `${srcPath_mp}/**/images/**/*.{png,jpg,gif,ico}`
];
const jsonFiles_pg = [`${srcPath_pg}/*.json`, `!${srcPath_pg}/_template/*.json`];
const jsFiles_pg = [`${srcPath_pg}/*.js`, `!${srcPath_pg}/_template/*.js`, `!${srcPath_pg}/env/*.js`];
const jsFiles_utils = [`${srcPath_utils}/*.js`];
const imgFiles_pg = [
  `${srcPath_pg}/images/*.{png,jpg,gif,ico}`,
  `${srcPath_pg}/images/**/*.{png,jpg,gif,ico}`
];

/* 清除dist目录 */
gulp.task('clean', done => {
  del.sync(['dist/**/*']);
  done();
});

/* 编译wxml文件 */
const wxml_mp = () => {
  return gulp
    .src(wxmlFiles_mp, { since: gulp.lastRun(wxml_mp) })
    .pipe(gulp.dest(distPath_mp));
};
gulp.task(wxml_mp);
const wxml_pg = () => {
  return gulp
    .src(wxmlFiles_pg, { since: gulp.lastRun(wxml_pg) })
    .pipe(gulp.dest(distPath_pg));
};
gulp.task(wxml_pg);

/* 编译JS文件 */
const js_mp = () => {
  return gulp
    .src(jsFiles_mp, { since: gulp.lastRun(js_mp) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(distPath_mp));
};
gulp.task(js_mp);
const js_pg = () => {
  return gulp
    .src(jsFiles_pg, { since: gulp.lastRun(js_pg) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(distPath_pg));
};
gulp.task(js_pg);
const js_utils = () => {
  return gulp
    .src(jsFiles_utils, { since: gulp.lastRun(js_utils) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(distPath_utils));
};
gulp.task(js_utils);

/* 配置请求地址相关 */
const envJs = (env) => {
  return () => {
    return gulp
      .src(`./src/env/${env}.js`)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(rename('env.js'))
      .pipe(gulp.dest(distPath_mp));
  };
};
gulp.task('devEnv', envJs('development'));
gulp.task('testEnv', envJs('testing'));
gulp.task('prodEnv', envJs('production'));

/* 编译json文件 */
const json_mp = () => {
  return gulp
    .src(jsonFiles_mp, { since: gulp.lastRun(json_mp) })
    .pipe(gulp.dest(distPath_mp));
};
gulp.task(json_mp);
const json_pg = () => {
  return gulp
    .src(jsonFiles_pg, { since: gulp.lastRun(json_pg) })
    .pipe(gulp.dest(distPath_pg));
};
gulp.task(json_pg);

/* 编译less文件 */
const wxss_mp = () => {
  return gulp
    .src(lessFiles_mp)
    .pipe(less())
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(distPath_mp));
};
gulp.task(wxss_mp);
const wxss_pg = () => {
  return gulp
    .src(lessFiles_pg)
    .pipe(less())
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(distPath_pg));
};
gulp.task(wxss_pg);

/* 编译压缩图片 */
const img_pg = () => {
  return gulp
    .src(imgFiles_pg, { since: gulp.lastRun(img_pg)})
    .pipe(imagemin())
    .pipe(gulp.dest(distPath_pg));
};
gulp.task(img_pg);

/* 编译压缩图片（小程序侧） */
const img_mp = () => {
  return gulp
    .src(imgFiles_mp, { since: gulp.lastRun(img_mp)})
    .pipe(imagemin())
    .pipe(gulp.dest(distPath_mp));
};
gulp.task(img_mp);

/* watch */
gulp.task('watch', () => {
  let watchLessFiles_mp = [...lessFiles_mp];
  let watchLessFiles_pg = [...lessFiles_pg];
  watchLessFiles_mp.pop();
  watchLessFiles_pg.pop();
  gulp.watch(watchLessFiles_mp, wxss_mp);
  gulp.watch(watchLessFiles_pg, wxss_pg);
  gulp.watch(jsFiles_mp, js_mp);
  gulp.watch(jsFiles_pg, js_pg);
  gulp.watch(jsFiles_utils, js_utils);
  gulp.watch(imgFiles_pg, img_pg);
  gulp.watch(imgFiles_mp, img_mp);
  gulp.watch(jsonFiles_mp, json_mp);
  gulp.watch(jsonFiles_pg, json_pg);
  gulp.watch(wxmlFiles_mp, wxml_mp);
  gulp.watch(wxmlFiles_pg, wxml_pg);
});


/* build */
gulp.task('build',
  gulp.series('clean', 
    gulp.parallel( 'wxml_mp', 'wxml_pg', 'js_mp', 'js_pg', 'json_mp', 'js_utils', 'json_pg', 'wxss_mp', 'wxss_pg', 'img_pg', 'img_mp', 'prodEnv')
  )
);

/* dev */
gulp.task('dev', 
  gulp.series('clean', 
    gulp.parallel( 'wxml_mp', 'wxml_pg', 'js_mp', 'js_pg', 'json_mp', 'js_utils', 'json_pg', 'wxss_mp', 'wxss_pg', 'img_pg', 'img_mp', 'devEnv'), 
    'watch')
);

/* test */
gulp.task('test', 
  gulp.series('clean', 
    gulp.parallel( 'wxml_mp', 'wxml_pg', 'js_mp', 'js_pg', 'json_mp', 'json_pg', 'js_utils', 'wxss_mp', 'wxss_pg', 'img_pg', 'img_mp', 'testEnv')
  )
);

/**
 * auto 自动创建page or template or component
 *  -s 源目录（默认为_template)
 * @example
 *   gulp auto -p mypage           创建名称为mypage的page文件
 *   gulp auto -t mytpl            创建名称为mytpl的template文件
 *   gulp auto -c mycomponent      创建名称为mycomponent的component文件
 *   gulp auto -s index -p mypage  创建名称为mypage的page文件
 */
const auto = done => {
  const yargs = require('yargs')
    .example('gulp auto -p mypage', '创建名为mypage的page文件')
    .example('gulp auto -t mytpl', '创建名为mytpl的template文件')
    .example('gulp auto -c mycomponent', '创建名为mycomponent的component文件')
    .example(
      'gulp auto -s index -p mypage',
      '复制pages/index中的文件创建名称为mypage的页面'
    )
    .option({
      s: {
        alias: 'src',
        default: '_template',
        describe: 'copy的模板',
        type: 'string'
      },
      p: {
        alias: 'page',
        describe: '生成的page名称',
        conflicts: ['t', 'c'],
        type: 'string'
      },
      t: {
        alias: 'template',
        describe: '生成的template名称',
        type: 'string',
        conflicts: ['c']
      },
      c: {
        alias: 'component',
        describe: '生成的component名称',
        type: 'string'
      },
      version: { hidden: true },
      help: { hidden: true }
    })
    .fail(msg => {
      done();
      console.error('创建失败!!!');
      console.error(msg);
      console.error('请按照如下命令执行...');
      yargs.parse(['--msg']);
      return;
    })
    .help('msg');

  const argv = yargs.argv;
  const source = argv.s;
  const typeEnum = {
    p: 'pages',
    t: 'templates',
    c: 'components'
  };
  let hasParams = false;
  let name, type;
  for (let key in typeEnum) {
    hasParams = hasParams || !!argv[key];
    if (argv[key]) {
      name = argv[key];
      type = typeEnum[key];
    }
  }

  if (!hasParams) {
    done();
    yargs.parse(['--msg']);
  }

  const root = path.join(__dirname, 'src', type);
  return gulp
    .src(path.join(root, source, '*.*'))
    .pipe(
      rename({
        dirname: name,
        basename: name
      })
    )
    .pipe(gulp.dest(path.join(root)));
};
gulp.task(auto);
