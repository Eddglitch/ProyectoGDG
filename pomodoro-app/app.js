// Pomodoro Flow — Timer Logic (Editorial Edition)

(function () {
    'use strict';

    const MODES = {
        'focus':       { minutes: 25, label: 'Stay focused',    breakAfter: 'short-break' },
        'short-break': { minutes: 5,  label: 'Take a break',    breakAfter: 'focus' },
        'long-break':  { minutes: 15, label: 'Relax & recharge', breakAfter: 'focus' }
    };

    const CIRCUMFERENCE = 2 * Math.PI * 140; // r=140 from SVG

    let currentMode = 'focus';
    let totalSeconds = MODES[currentMode].minutes * 60;
    let remainingSeconds = totalSeconds;
    let timerInterval = null;
    let isRunning = false;
    let sessionsCompleted = 0;

    // DOM refs
    const timeDisplay = document.getElementById('timer-time');
    const statusDisplay = document.getElementById('timer-status');
    const ringProgress = document.getElementById('ring-progress');
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const btnSkip = document.getElementById('btn-skip');
    const iconPlay = btnStart.querySelector('.icon-play');
    const iconPause = btnStart.querySelector('.icon-pause');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const sessionCount = document.getElementById('session-count');
    const progressDots = document.querySelectorAll('.progress-dot');

    // Audio chime
    function playChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1);
            // Second tone
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(783.99, ctx.currentTime);
                gain2.gain.setValueAtTime(0.3, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 1.2);
            }, 200);
        } catch (e) { /* Audio not available */ }
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(remainingSeconds);
        const progress = 1 - (remainingSeconds / totalSeconds);
        ringProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    }

    function setMode(mode) {
        if (isRunning) stopTimer();
        currentMode = mode;
        totalSeconds = MODES[mode].minutes * 60;
        remainingSeconds = totalSeconds;
        statusDisplay.textContent = 'Ready';

        modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
        document.body.classList.toggle('on-break', mode !== 'focus');

        ringProgress.style.strokeDasharray = CIRCUMFERENCE;
        ringProgress.style.strokeDashoffset = 0;
        updateDisplay();
    }

    function startTimer() {
        isRunning = true;
        document.body.classList.add('running');
        statusDisplay.textContent = MODES[currentMode].label;
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';

        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateDisplay();
            if (remainingSeconds <= 0) {
                stopTimer();
                playChime();
                onTimerComplete();
            }
        }, 1000);
    }

    function stopTimer() {
        isRunning = false;
        document.body.classList.remove('running');
        clearInterval(timerInterval);
        timerInterval = null;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        if (remainingSeconds > 0) statusDisplay.textContent = 'Paused';
    }

    function resetTimer() {
        stopTimer();
        remainingSeconds = totalSeconds;
        statusDisplay.textContent = 'Ready';
        updateDisplay();
    }

    function onTimerComplete() {
        if (currentMode === 'focus') {
            sessionsCompleted++;
            sessionCount.textContent = sessionsCompleted;
            if (sessionsCompleted <= 8) {
                progressDots[sessionsCompleted - 1].classList.add('filled');
            }
            // Long break every 4
            const nextMode = sessionsCompleted % 4 === 0 ? 'long-break' : 'short-break';
            statusDisplay.textContent = 'Session complete!';
            setTimeout(() => setMode(nextMode), 1500);
        } else {
            statusDisplay.textContent = 'Break over!';
            setTimeout(() => setMode('focus'), 1500);
        }
    }

    // Event listeners
    btnStart.addEventListener('click', () => isRunning ? stopTimer() : startTimer());
    btnReset.addEventListener('click', resetTimer);
    btnSkip.addEventListener('click', () => {
        if (currentMode === 'focus') {
            const nextMode = sessionsCompleted % 4 === 0 && sessionsCompleted > 0 ? 'long-break' : 'short-break';
            setMode(nextMode);
        } else {
            setMode('focus');
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') { e.preventDefault(); isRunning ? stopTimer() : startTimer(); }
        if (e.key === 'r' || e.key === 'R') resetTimer();
        if (e.key === 's' || e.key === 'S') btnSkip.click();
    });

    // Initialize
    ringProgress.style.strokeDasharray = CIRCUMFERENCE;
    ringProgress.style.strokeDashoffset = 0;
    updateDisplay();
})();
