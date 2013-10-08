//hahaha. this is so horrible. state everywhere.
var game = {
    level  : null,
    editor : null,
    worker : null,

    reset : function () {
        this.editor = ace.edit('editor');
        this.editor.setTheme('ace/theme/twilight');
        this.editor.getSession().setMode('ace/mode/javascript');

        timer.stop();
    },

    runCode : function (evt) {
        console.log('running code');
        timer.pause();

        if (evt && evt.preventDefault) {
            evt.preventDefault();
        }

        if (!this.worker) {
            this.setupWorker();
        }

        this.worker.postMessage({
            code : this.editor.getValue(),
            name : this.level.name,
            tests: this.level.tests
        });
    },

    nextLevel : function () {
        console.log('progressing level');
        this.level = this.levels.shift();
        this.calibrateEditor();
        timer.play();
    },

    setupWorker : function () {
        this.worker = new Worker('js/evalWorker.js');

        this.worker.onmessage = function (evt) {
            console.log('worker.onmessage');
            logger.logWorkerEvent(evt);
        };
    },

    calibrateEditor : function () {
        this.editor.setReadOnly(false);
        this.editor.setValue(this.level.code);
        this.editor.focus();
        this.editor.clearSelection();
        this.editor.moveCursorToPosition(this.level.cursor);
    }
};

game.levels = [
    {
        text : 'Hit the button to the left, or Ctrl+Enter/Mac+Enter to submit',
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

var timer = {
    elem : document.getElementById('timer'),

    interval : 100,
    time : 0,

    play : function () {
        console.log('play');
        this.intervalId = setInterval(this.tick.bind(this), this.interval);
        console.log('interval id:', this.intervalId);
    },
    pause : function () {
        console.log('pause', this.intervalId);
        clearInterval(this.intervalId);
    },
    reset : function () {
        console.log('reset');
        this.time = 0;
    },
    stop : function () {
        console.log('stop');
        this.pause();
        this.reset();
    },

    tick : function () {
        this.time += this.interval;
        this.write();
    },

    write : function (elem) {
        var ms = this.time,
            secs, mins;

        secs = Math.floor(ms / 1000);
        ms %= 1000;
        mins = Math.floor(secs / 60);
        secs %= 60;

        var format = [mins, secs].map(function (t) {
            return (t < 10 ? '0' : '') + t;
        }).join(':');

        this.elem.textContent = format;
    }
};

var logger = {
    elem : document.getElementById('log-wrapper'),

    log : function (text) {
        this.addLine(this.createLine(text));
    },

    logWorkerEvent : function (evt) {
        var data = evt.data,
            line = this.createLine(data.message);

        line.classList.add('log-' + data.type);
        this.addLine(line);
    },

    addLine : function (line) {
        this.elem.appendChild(line);
        this.elem.scrollTop = this.elem.scrollHeight
    },

    createLine : function (text) {
        var line = document.createElement('div');
        line.classList.add('log-line');

        if (text) {
            line.textContent = text;
        }

        return line;
    },

    clear : function () {
        var child;
        while (child = this.elem.firstElementChild) {
            this.elem.removeChild(child);
        }
    }
};

document.getElementById('run-button').onclick = function (evt) {
    game.runCode(evt);
};

document.onkeydown = function (evt) {
    var enterKeyCode = 13;
    if (evt.which === enterKeyCode && (evt.ctrlKey || evt.metaKey)) {
        game.runCode(evt);
    }
};

game.reset();

game.nextLevel();
timer.reset();
