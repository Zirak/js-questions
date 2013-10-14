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
    editorElem : document.getElementById('main-editor'),
    editor : null,

    finalEditorElem : document.getElementById('ending-editor'),
    finalEditor : null,

    worker : null,

    start : function () {
        this.editor = ace.edit(this.editorElem);
        this.editor.setTheme('ace/theme/twilight');
        this.editor.getSession().setMode('ace/mode/javascript');

        this.finalEditor = ace.edit(this.finalEditorElem);
        this.finalEditor.setTheme('ace/theme/twilight');
        this.finalEditor.getSession().setMode('ace/mode/javascript');
    },

    nextLevel : function () {
        console.log('progressing level');
        this.level = this.levels.shift();

        if (!this.level) {
            this.win();
        }
        else {
            this.playLevel();
        }
    },
    playLevel : function () {
        logger.clear();

        this.calibrateEditor();
        logger.log(this.level.intro);

        timer.store();
        timer.play();
    },

    skipLevel : function () {
        console.log('skipping level');
        this.levels.skipped += 1;
        this.nextLevel();
    },

    restartLevel : function () {
        timer.restore();
        this.playLevel();
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
        logger.clear();
        logger.log(this.level.intro);

        if (!this.worker) {
            this.setupWorker();
        }

        var victory = true,
            self = this,
            timeout;

        logger.log('Testing...');
        this.worker.onmessage = function (evt) {
            var type = evt.data.type;

            if (type === 'finish') {
                clearTimeout(timeout);
                self.levelEnd(victory);
            }
            else if (type === 'fail' || type === 'error') {
                victory = false;
            }
        };

        timeout = setTimeout(function () {
            logger.logWorkerEvent({
                type : 'error',
                message : 'Timeout: Execution exceeded 1 second'
            });

            self.worker.terminate();
            self.levelEnd(false);
        }, 1000);

        this.worker.postMessage({
            code : this.editor.getValue(),
            name : this.level.name,
            tests: this.level.tests
        });
    },

    win : function () {
        document.body.classList.add('win');
        timer.pause();
        ui.winGame();
    },

    setupWorker : function () {
        this.worker = new Worker('js/evalWorker.js');

        this.worker.addEventListener('message', function (evt) {
            logger.logWorkerEvent(evt.data);
        });
    },

    calibrateEditor : function () {
        this.editor.setReadOnly(false);
        this.editor.setValue(this.level.code);
        this.editor.focus();
        this.editor.clearSelection();
        this.editor.moveCursorToPosition(this.level.cursor);
    },

    loadLevels : function () {
        var script = document.createElement('script'),
            self = this;

        script.src = 'js/levels.js';

        logger.log('Loading levels...');

        script.onload = function () {
            self.levels.skipped = 0;
            self.levels.total = self.levels.length;

            ui.prestart();
            logger.log('Finished loading levels. Proceed.');
        };

        document.body.appendChild(script);
    }
};

var timer = {
    elem : document.getElementById('timer'),

    interval : 100,
    time : 0,
    saved : null,
    running : false,

    play : function () {
        if (this.running) {
            console.log('play: already running');
            return;
        }

        console.log('play');
        this.intervalId = setInterval(this.tick.bind(this), this.interval);
        this.running = true;
    },
    pause : function () {
        console.log('pause', this.intervalId);
        clearInterval(this.intervalId);
        this.running = false;
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

    store : function () {
        this.saved = this.time;
    },
    restore : function () {
        this.time = this.saved;
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

    logWorkerEvent : function (data) {
        var line;

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
        //sue me
        this.log(this.prefix);
    }
};
logger.prefix = logger.elem.textContent;

var ui = {
    state : 'nothing',

    next : function () {
        this[this.state].apply(this, arguments);
    },

    prestart : function () {
        this.state = 'start';
    },

    start : function () {
        document.getElementById('begin-pane').classList.add('hidden');
        game.editorElem.classList.remove('hidden');
        game.start();

        this.level();
    },

    level : function () {
        game.nextLevel();

        this.state = 'run';
    },

    run : function () {
        game.runCode();

        this.state = 'nothing';
    },

    winLevel : function () {
        game.finalEditor.setValue(
            game.finalEditor.getValue() +
                game.editor.getValue() +
                "\n\n");
        game.finalEditor.clearSelection();

        this.state = 'level';
    },
    loseLevel : function () {
        this.state = 'run';
    },

    skipLevel : function () {
        if (this.state === 'level') {
            this.next();
        }
        else if (this.state === 'run') {
            game.skipLevel();
        }
        else {
            logger.log('You can\'t really skip anything at this point');
        }
    },

    restartLevel : function () {
        if (this.state === 'run' || this.state === 'level') {
            game.restartLevel();
        }
        else {
            logger.log('What exactly is it that you want to restart?');
        }
    },

    winGame : function () {
        game.editorElem.classList.add('hidden');
        logger.elem.classList.add('hidden');
        document.getElementById('end-pane').classList.remove('hidden');

        document.getElementById('ending-text').textContent = genWinText();

        this.state = 'win';

        function genWinText () {
            var done = 1 - game.levels.skipped / game.levels.total,
                suffix = 'Your answers:',
                msg;

            if (done === 0) {
                msg = 'You didn\'t even try...';
                suffix = 'Your answers (or lack thereof):';
            }
            else if (done < 0.5) {
                msg = 'Oh, you know you can do more than that!';
            }
            else if (done < 0.75) {
                msg = 'So close! Give it another go, you can do it!';
            }
            else if (done < 1) {
                msg = 'Great, you got most of the questions! But why not ' +
                    'go for gold?'
            }
            else {
                msg = 'Awesome, you win!';
            }

            return msg + ' ' + suffix;
        }
    },

    nothing : function () {},
};

document.onkeydown = function (evt) {
    var key = evt.which;
    var keys = {
        enter : 13,
        Q : 81,
        R : 82
    };

    if (evt.ctrlKey || evt.metaKey) {
        if (key === keys.enter) {
            ui.next();
        }
        else if (key === keys.Q) {
            ui.skipLevel();
        }
        else if (key === keys.R) {
            evt.preventDefault();
            ui.restartLevel();
        }
    }
};

game.loadLevels();
