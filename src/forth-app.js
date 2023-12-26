'use strict';

const forth = require('forth');

let comments = true;
const inp = document.getElementById('inp');
const oup = document.getElementById('oup');

inp.value = localStorage.forthSourceCode || ': foo if 1 else 2 ;\nsee foo\n';
oup.value = '?';

const cmForth = CodeMirror.fromTextArea(
  inp,
  {
    mode: 'forth',
    theme: 'colorforth',
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    autofocus: false
  }
);

const cmJavaSCript = CodeMirror.fromTextArea(
  oup,
  {
    mode: 'javascript',
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
    matchBrackets: true,
    autoCloseBrackets: true,
    highlightSelectionMatche: true,
    autofocus: true
  }
);

let myTimeOut;
cmForth.on('change', function () {
  clearTimeout(myTimeOut);
  myTimeOut = setTimeout(refresh, 750);
});

function refresh () {
  const time = Date.now();
  const source = cmForth.getValue();
  let consolebuffer = '';
  let refreshTimeout;
  const f = forth();
  f.s.write(source);
  f.s.on('data', function (chunk) {
    consolebuffer += chunk;
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(function () {
      cmJavaSCript.setValue(consolebuffer);
    }, 100);
  });
  console.log((Date.now() - time) + 'ms');
  localStorage.forthSourceCode = source;
}

document.getElementById('button').addEventListener('click', function () {
  comments = !comments;
  refresh();
});

global.FORTH = {
  refresh
};

/* global CodeMirror */
/* eslint-env browser */
