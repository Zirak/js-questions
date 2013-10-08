/*
 __________________
< This is horrible >
 ------------------
  \                 __
   \               (oo)
    \              (  )  <--- @OctavianDamiean
     \             /--\
       __         / \  \
      UooU\.'@@@@@@`.\  )
      \__/(@@@@@@@@@@) /
           (@@@@@@@@)((
           `YY~~~~YY' \\
            ||    ||   >>
*/

var game = {
    level  : null,
    editorElem : document.getElementById('editor'),
    editor : null,
    worker : null,

    start : function () {
        this.editor = ace.edit(this.editorElem);
        this.editor.setTheme('ace/theme/twilight');
        this.editor.getSession().setMode('ace/mode/javascript');
    },

    nextLevel : function () {
        console.log('progressing level');
        logger.clear();
        this.level = this.levels.shift();

        if (!this.level) {
            this.win();
            return;
        }

        this.calibrateEditor();
        logger.log(this.level.intro);
        timer.play();
    },

    levelEnd : function (victory) {
        if (victory) {
            logger.log(this.level.outro);
            ui.winLevel();

            if (!this.levels.length) {
                this.win();
            }
        }
        else {
            ui.loseLevel()
            timer.play();
        }
    },

    runCode : function () {
        timer.pause();

        if (!this.worker) {
            this.setupWorker();
        }

        var victory;

        this.worker.onmessage = function (evt) {
            var type = evt.data.type;

            if (type === 'finish') {
                game.levelEnd(victory);
            }
            else {
                victory = (type === 'pass');
            }
        };

        this.worker.postMessage({
            code : this.editor.getValue(),
            name : this.level.name,
            tests: this.level.tests
        });
    },

    win : function () {
        document.body.classList.add('win');
        ui.winGame();
    },

    setupWorker : function () {
        this.worker = new Worker('js/evalWorker.js');

        this.worker.addEventListener('message', function (evt) {
            logger.logWorkerEvent(evt);
        });
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
        intro : 'Hit the button to the left, or Ctrl+Enter/Mac+Enter to submit',
        outro : 'That was too easy, wasn\'t it?',
        name : 'square',

        code : [
            'box.square = function square (x) {',
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
    },

    {
        intro : 'A bit trickier now...',
        outro : 'Great! Prepare yourself for the real challenge!',
        name : 'sumDigits',

        code : [
            'box.sumDigits = function sumDigits (x) {',
            '    //sum the digits of the number x',
            '    ',
            '    ',
            '};'
        ].join('\n'),

        cursor : { row : 3, column : 4 },

        tests : [
            { param :  2,    result : 2  },
            { param :  412,  result : 7  },
            { param :  8.19, result : 18 },
            { param :  4.12, result : 7  },
            { param : -0,    result : 0  },
            { param : -14,   result : 5  },
            { param : -1.4,  result : 5  },
        ]
    },

    {
        intro : 'This is harder than the original, yes.',
        outro : 'Good work, but we\'re not done yet!',
        name : 'flatten',

        code : [
            'box.flatten = function flatten (x) {',
            '    // x is an arbitrarily nested, multidimensional array.',
            '    // return x flattened (all items in 1 dimension)',
            '    ',
            '    ',
            '};'
        ].join('\n'),

        cursor : { row : 4, column : 4 },

        tests : [
            { param : [], result : [] },
            { param : [0, 1, 2], result : [0, 1, 2] },
            { param : [[], 0, [1]], result : [0, 1] },
            {
                param : [0, [[[[[1, [2]]]]], 3], [4, [5]]],
                result : [0, 1, 2, 3, 4, 5]
            }
        ],
    },

    {
        intro : 'One before last, you can do it!',
        outro : 'Good job! But are you ready for the last challenge...?',
        name : 'mode',

        code : [
            'box.mode = function mode (x) {',
            '    // x is an array of at least 1 item.',
            '    // return the most frequent item (there will be no collisions)',
            '    ',
            '    ',
            '};'
        ].join('\n'),

        cursor : { row : 4, column : 4 },

        tests : [
            { param : [0], result : 0 },
            { param : [0, 1, 1, 2], result : 1 },
            {
                param : [{}, 0, [1], 'foo', true, false, null, true],
                result : true
            }
            //needs more
        ]
    },

    {
        intro : 'Final one! Good luck!',
        outro : 'Congrats, you win!',
        name : 'sortingType',

        code : [
            'box.sortingType = function sortingType (x) {',
            '    // x is an array of at least 2 unique members',
            '    // return 0 if it\'s not sorted, 1 if it\'s ascending, ' +
                ' -1 if it\'s descending',
            '    ',
            '    ',
            '};'
        ].join('\n'),

        cursor : { row : 4, column : 4 },

        tests : [
            { param : [0, 1], result : 1 },
            { param : [-1, 4, 2], result : 0 },
            { param : [10, 1, 100], result : 0 },
            { param : [0, -1, -100], result : -1 },
            { param : [-2, 4, 10, 19], result : 1 },
            { param : [1, 11, 101], result : 1 },
            { param : [101, 11, 1], result : -1 },
            { param : [14, -2, 1.5], result : 0 },
            { param : [18, 18.1, 19], result : 1 },
            { param : [0.9, 0.4, -0.1, -0.12, -1], result : -1 }
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
            line;

        if (data.type === 'finish') {
            return;
        }

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

var ui = {
    button : document.getElementById('run-button'),
    state : 'prestart',

    next : function () {
        this[this.state].apply(this, arguments);
    },

    prestart : function () {
        this.button.onclick = this.next.bind(this);;
        this.button.textContent = 'Start';
        this.state = 'start';
    },

    start : function () {
        document.getElementById('beginPane').classList.add('hidden');
        game.editorElem.classList.remove('hidden');
        game.start();

        this.level();
    },

    level : function () {
        game.nextLevel();

        this.button.textContent = 'Run';
        this.state = 'run';
    },

    run : function () {
        game.runCode();

        this.state = 'nothing';
    },

    winLevel : function () {
        this.button.textContent = 'Next';
        this.state = 'level';
    },
    loseLevel : function () {
        this.state = 'run';
    },

    winGame : function () {
        game.editorElem.classList.add('hidden');
        document.getElementById('endPane').classList.remove('hidden');
    },

    nothing : function () {},
};

document.onkeydown = function (evt) {
    var enterKeyCode = 13;
    if (evt.which === enterKeyCode && (evt.ctrlKey || evt.metaKey)) {
        ui.next();
    }
};

ui.next();
