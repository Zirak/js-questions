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
        logger.clear();
        logger.log(this.level.intro);

        if (!this.worker) {
            this.setupWorker();
        }

        var victory = true;

        logger.log('Testing...');
        this.worker.onmessage = function (evt) {
            var type = evt.data.type;

            if (type === 'finish') {
                game.levelEnd(victory);
            }
            else if (type === 'fail' || type === 'error') {
                victory = false;
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
        //timer.pause();
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
    },

    loadLevels : function () {
        var xhr = new XMLHttpRequest(),
            self = this;
        xhr.open('GET', 'js/levels.json');

        logger.log('Loading levels...');

        xhr.onload = function () {
            self.levels = JSON.parse(xhr.responseText);

            ui.prestart();
            logger.log('Finished loading levels. Proceed.');
        };

        xhr.send();
    }
};

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
        console.log(text);
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
    state : 'nothing',

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

game.loadLevels();
