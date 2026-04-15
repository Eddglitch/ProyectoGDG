// app.js — Pomodoro Flow Timer Logic

(function () {
    'use strict';

    // --- Configuration ---
    const MODES = {
        'focus':       { minutes: 25, label: 'Focus Time',    status: 'Stay focused!' },
        'short-break': { minutes: 5,  label: 'Short Break',   status: 'Take a breather' },
        'long-break':  { minutes: 15, label: 'Long Break',    status: 'Relax and recharge' },
    };

    const CIRCUMFERENCE = 2 * Math.PI * 120; // r=120 from SVG

    // --- State ---
    let currentMode = 'focus';
    let totalSeconds = MODES[currentMode].minutes * 60;
    let remainingSeconds = totalSeconds;
    let timerInterval = null;
    let isRunning = false;
    let sessionsCompleted = 0;

    // --- DOM Elements ---
    const timerTimeEl = document.getElementById('timer-time');
    const timerStatusEl = document.getElementById('timer-status');
    const ringProgress = document.getElementById('ring-progress');
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const btnSkip = document.getElementById('btn-skip');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const tabButtons = document.querySelectorAll('.tab');
    const sessionCountEl = document.getElementById('session-count');
    const progressFill = document.getElementById('progress-fill');
    const progressDetail = document.getElementById('progress-detail');
    const progressDots = document.querySelectorAll('.dot');

    // --- Formatting ---
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // --- Ring Progress ---
    function updateRing() {
        const fraction = remainingSeconds / totalSeconds;
        const offset = CIRCUMFERENCE * fraction;
        ringProgress.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE - offset));
    }

    // --- Display Update ---
    function updateDisplay() {
        timerTimeEl.textContent = formatTime(remainingSeconds);
        updateRing();
    }

    // --- Mode Switch ---
    function setMode(mode) {
        currentMode = mode;
        const config = MODES[mode];
        totalSeconds = config.minutes * 60;
        remainingSeconds = totalSeconds;
        isRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;

        // Update UI
        timerStatusEl.textContent = `Ready to ${mode === 'focus' ? 'focus' : 'rest'}`;
        document.body.className = `mode-${mode}`;
        iconPlay.style.display = '';
        iconPause.style.display = 'none';
        document.body.classList.remove('timer-running');

        tabButtons.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        updateDisplay();
    }

    // --- Timer Tick ---
    function tick() {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
            document.body.classList.remove('timer-running');

            onTimerComplete();
            return;
        }
        remainingSeconds--;
        updateDisplay();
    }

    // --- Timer Complete ---
    function onTimerComplete() {
        // Play a gentle notification sound
        playNotification();

        if (currentMode === 'focus') {
            sessionsCompleted++;
            sessionCountEl.textContent = sessionsCompleted;
            updateProgress();

            timerStatusEl.textContent = 'Session complete! 🎉';

            // Auto-switch to break
            setTimeout(() => {
                if (sessionsCompleted % 4 === 0) {
                    setMode('long-break');
                } else {
                    setMode('short-break');
                }
            }, 2000);
        } else {
            timerStatusEl.textContent = 'Break over! Ready?';
            setTimeout(() => setMode('focus'), 2000);
        }
    }

    // --- Play notification ---
    function playNotification() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1);
                osc.connect(gain).connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 1);
            });
        } catch (e) {
            // Audio not supported, skip
        }
    }

    // --- Progress Update ---
    function updateProgress() {
        const goal = 8;
        const pct = Math.min((sessionsCompleted / goal) * 100, 100);
        progressFill.style.width = pct + '%';
        progressDetail.textContent = `${sessionsCompleted} / ${goal} sessions`;

        progressDots.forEach((dot, idx) => {
            dot.classList.toggle('filled', idx < sessionsCompleted);
        });
    }

    // --- Event Listeners ---

    // Start / Pause
    btnStart.addEventListener('click', () => {
        if (isRunning) {
            // Pause
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
            timerStatusEl.textContent = 'Paused';
            document.body.classList.remove('timer-running');
        } else {
            // Start
            isRunning = true;
            iconPlay.style.display = 'none';
            iconPause.style.display = '';
            timerStatusEl.textContent = MODES[currentMode].status;
            document.body.classList.add('timer-running');
            timerInterval = setInterval(tick, 1000);
        }
    });

    // Reset
    btnReset.addEventListener('click', () => {
        setMode(currentMode);
    });

    // Skip
    btnSkip.addEventListener('click', () => {
        if (currentMode === 'focus') {
            setMode('short-break');
        } else {
            setMode('focus');
        }
    });

    // Mode tabs
    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            setMode(tab.dataset.mode);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            btnStart.click();
        }
        if (e.key === 'r' || e.key === 'R') btnReset.click();
        if (e.key === 's' || e.key === 'S') btnSkip.click();
    });

    // --- Initialize ---
    setMode('focus');

})();
