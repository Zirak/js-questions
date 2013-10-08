//hahaha. this is so horrible. state everywhere.
var level;
var levels = [
    {
        title : 'I like moose',
        name : 'square',

        code : ['box.square = function (x) {',
            '    //return x squared',
            '    ',
            '    ',
            '};'
        ].join('\n'),

        cursor : {
            row : 3,
            column : 4
        },

        tests : [
            { param  :  2,   result : 4 },
            { param  :  4,   result : 16 },
            { param  :  1.5, result : 2.25 },
            { param  : -12,  result : 144 },
            { param  : -1.5, result : 2.25 }
        ]
    }
];


var editor = ace.edit('editor');
editor.setTheme('ace/theme/twilight');
editor.getSession().setMode('ace/mode/javascript');

var worker = setupWorker();
function setupWorker () {
    var ret = new Worker('js/evalWorker.js');
    ret.onmessage = function (evt) {
        logger.logWorkerEvent(evt);
    };
    return ret;
}

var logger = {
    elem : document.getElementById('log-wrapper'),

    logWorkerEvent : function (evt) {
        var line = document.createElement('div'),
        data = evt.data;

        line.classList.add('log-line');
        line.classList.add('log-' + data.type);

        line.textContent = data.message;

        this.elem.appendChild(line);
        this.elem.scrollTop = this.elem.scrollHeight
    }
};

function nextLevel () {
    level = levels.shift();
    calibrateEditorTo(level);
}

function calibrateEditorTo (level) {
    editor.setReadOnly(false);
    editor.setValue(level.code);
    editor.focus();
    editor.clearSelection();
    editor.moveCursorToPosition(level.cursor);
}

nextLevel();

function runCode (evt) {
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    }

    worker.postMessage({
        code : editor.getValue(),
        name : level.name,
        tests: level.tests
    });
}

document.getElementById('run-button').onclick = runCode;
document.onkeydown = function (evt) {
    //13 is the keycode for Enter
    if (evt.which === 13 && (evt.ctrlKey || evt.metaKey)) {
        runCode(evt);
    }
};
