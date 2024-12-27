'use strict';

exports.swc = () => ({
  jsc: {
    target: 'es2022'
  },
  sourceMaps: false,
})

exports.lightningcss = () => {
  return {
    minify: true,
  };
};

exports.sass = () => {
  return {
    outputStyle: 'expanded',
    precision: 5,
  };
};

exports.terser = () => {
  return {
    compress: {
      drop_console: true,
      keep_infinity: true,
      passes: 5,
    },
    output: {
      beautify: false,
    },
    toplevel: false,
  };
};

exports.webserver = () => {
  return {
    livereload: false,
    port: 8000,
    host: '0.0.0.0'
  };
};
