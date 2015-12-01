(function () {
    'use strict';

    var forth = require('forth');

    var inp, oup, cmForth, cmJavaSCript, comments, f, myTimeOut;

    function refresh () {
        var time = Date.now();
        var source = cmForth.getValue();
        var consolebuffer = '';
        var refreshTimeout;
        f = forth();
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

    comments = true;
    inp = document.getElementById('inp');
    oup = document.getElementById('oup');

    inp.value = localStorage.forthSourceCode || ': foo 1 2 + ;';
    oup.value = '?';

    document.getElementById('button').addEventListener('click', function () {
        comments = !comments;
        refresh();
    });

    cmForth = CodeMirror.fromTextArea(
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

    cmJavaSCript = CodeMirror.fromTextArea(
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


    cmForth.on('change', function () {
        clearTimeout(myTimeOut);
        myTimeOut = setTimeout(refresh, 750);
    });

    refresh();
})();

/* global console, CodeMirror */
/* env browser */
