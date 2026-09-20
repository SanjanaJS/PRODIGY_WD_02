// ============================================
// CHRONOPULSE STOPWATCH
// ============================================


// --------------------------------------------
// ELEMENTS
// --------------------------------------------

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const millisecondsDisplay = document.getElementById("milliseconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const lapList = document.getElementById("lapList");
const emptyState = document.getElementById("emptyState");

const lapCountDisplay = document.getElementById("lapCount");
const bestLapDisplay = document.getElementById("bestLap");
const averageLapDisplay = document.getElementById("averageLap");
const lapBadge = document.getElementById("lapBadge");

const statusText = document.getElementById("statusText");


// --------------------------------------------
// STOPWATCH VARIABLES
// --------------------------------------------

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

let laps = [];


// --------------------------------------------
// FORMAT TIME
// --------------------------------------------

function formatNumber(number) {
    return number < 10 ? "0" + number : number;
}


function formatTime(time) {

    const minutes = Math.floor(time / 60000);

    const seconds = Math.floor((time % 60000) / 1000);

    const milliseconds = Math.floor((time % 1000) / 10);

    return (
        formatNumber(minutes) +
        ":" +
        formatNumber(seconds) +
        "." +
        formatNumber(milliseconds)
    );
}


// --------------------------------------------
// UPDATE STOPWATCH DISPLAY
// --------------------------------------------

function updateDisplay() {

    const minutes = Math.floor(elapsedTime / 60000);

    const seconds =
        Math.floor((elapsedTime % 60000) / 1000);

    const milliseconds =
        Math.floor((elapsedTime % 1000) / 10);


    minutesDisplay.textContent =
        formatNumber(minutes);

    secondsDisplay.textContent =
        formatNumber(seconds);

    millisecondsDisplay.textContent =
        formatNumber(milliseconds);
}


// --------------------------------------------
// START STOPWATCH
// --------------------------------------------

function startStopwatch() {

    if (timerInterval !== null) {
        return;
    }


    startTime =
        Date.now() - elapsedTime;


    timerInterval = setInterval(() => {

        elapsedTime =
            Date.now() - startTime;

        updateDisplay();

    }, 10);


    statusText.textContent = "Running";
}


// --------------------------------------------
// PAUSE STOPWATCH
// --------------------------------------------

function pauseStopwatch() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;

        statusText.textContent = "Paused";
    }
}


// --------------------------------------------
// RESET STOPWATCH
// --------------------------------------------

function resetStopwatch() {

    clearInterval(timerInterval);

    timerInterval = null;

    startTime = 0;

    elapsedTime = 0;

    laps = [];


    updateDisplay();

    renderLaps();

    updateStatistics();


    statusText.textContent = "Ready";
}


// --------------------------------------------
// RECORD LAP
// --------------------------------------------

function recordLap() {

    if (elapsedTime === 0) {
        return;
    }


    const previousLapTime =
        laps.length > 0
            ? laps[laps.length - 1].totalTime
            : 0;


    const currentLapTime =
        elapsedTime - previousLapTime;


    laps.push({

        number: laps.length + 1,

        time: currentLapTime,

        totalTime: elapsedTime

    });


    renderLaps();

    updateStatistics();

    statusText.textContent = "Lap Recorded";
}


// --------------------------------------------
// RENDER LAPS
// --------------------------------------------

function renderLaps() {

    lapList.innerHTML = "";


    if (laps.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";
    }


    laps.forEach((lap, index) => {

        const li =
            document.createElement("li");


        li.className = "lap-item";


        const number =
            document.createElement("span");

        number.className = "lap-number";

        number.textContent =
            "LAP " + lap.number;


        const indicator =
            document.createElement("div");

        indicator.className =
            "lap-indicator";


        const time =
            document.createElement("span");

        time.className = "lap-time";

        time.textContent =
            formatTime(lap.time);


        li.appendChild(number);

        li.appendChild(indicator);

        li.appendChild(time);


        lapList.prepend(li);
    });


    lapCountDisplay.textContent =
        laps.length;


    lapBadge.textContent =
        laps.length +
        (laps.length === 1 ? " LAP" : " LAPS");
}


// --------------------------------------------
// UPDATE STATISTICS
// --------------------------------------------

function updateStatistics() {

    if (laps.length === 0) {

        bestLapDisplay.textContent =
            "--:--.--";

        averageLapDisplay.textContent =
            "--:--.--";

        lapCountDisplay.textContent = "0";

        lapBadge.textContent = "0 LAPS";

        return;
    }


    // Best lap
    const bestLap =
        Math.min(...laps.map(lap => lap.time));


    bestLapDisplay.textContent =
        formatTime(bestLap);


    // Average lap
    const totalLapTime =
        laps.reduce(
            (sum, lap) => sum + lap.time,
            0
        );


    const averageLap =
        totalLapTime / laps.length;


    averageLapDisplay.textContent =
        formatTime(averageLap);


    lapCountDisplay.textContent =
        laps.length;


    lapBadge.textContent =
        laps.length +
        (laps.length === 1 ? " LAP" : " LAPS");
}


// --------------------------------------------
// KEYBOARD SHORTCUTS
// --------------------------------------------

document.addEventListener("keydown", (event) => {

    // Space = Start / Pause
    if (event.code === "Space") {

        event.preventDefault();


        if (timerInterval === null) {

            startStopwatch();

        } else {

            pauseStopwatch();
        }
    }


    // L = Lap
    if (
        event.key.toLowerCase() === "l"
    ) {

        recordLap();
    }


    // R = Reset
    if (
        event.key.toLowerCase() === "r"
    ) {

        resetStopwatch();
    }
});


// --------------------------------------------
// BUTTON EVENTS
// --------------------------------------------

startBtn.addEventListener(
    "click",
    startStopwatch
);


pauseBtn.addEventListener(
    "click",
    pauseStopwatch
);


lapBtn.addEventListener(
    "click",
    recordLap
);


resetBtn.addEventListener(
    "click",
    resetStopwatch
);


// --------------------------------------------
// INITIAL STATE
// --------------------------------------------

updateDisplay();

renderLaps();

updateStatistics();