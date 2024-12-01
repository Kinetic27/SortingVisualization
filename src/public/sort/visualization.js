const params = new URL(location.href).searchParams;
const n = params.get('n') * 1 || 100;
const interval = params.get('s') * 1 || 20;

let arr = [...Array(n).keys()]

// Set Image List
const img_gachon = 'https://www.gachon.ac.kr/sites/pr/atchmnfl/bbs/464/thumbnail/thumb_temp_1729488066932100.jpg';
const img_leegilya = 'https://img.khan.co.kr/news/2013/05/22/l_2013052301002975800258871.jpg';
const img_gachon2 = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Gachon.jpg';
const img_moodang = 'https://cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/Q5NLDY5VX5HVNOLMIWJZIMVP6Y.jpg';
const img_metagachon = 'https://www.gachon.ac.kr/sites/kor/images/sub/blockstopimage.jpg';

// Load Image
const imgs = [img_gachon, img_leegilya, img_gachon2, img_moodang, img_metagachon];
const random = Math.floor(Math.random() * imgs.length);
const img = imgs[random];

const image = new Image();
image.src = img;

// get Elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let runCount = 0;
const runCountTextview = document.getElementById('run_cnt');
const runCountText = "Running Count - ";

const runTimeTextview = document.getElementById('run_time');
const runTimeText = "Running Time - ";

const currentPath = new URL(location.href).pathname;
const sortType = currentPath.split('/').pop();

const sortNames = {
    'merge': ["병합 정렬(Merge Sort)", mergeSort],
    'insert': ["삽입 정렬(Insertion Sort)", insertionSort],
    'quick': ["퀵 정렬(Quick Sort)", quickSort],
    'bubble': ["버블 정렬(Bubble Sort)", bubbleSort],
}

const sortInfo = {
    'merge': [["● Insert", "#ff0000"], ["● Compare", "#00ff00"]],
    'insert': [["● Copy", "#ff0000"], ["● Insert", "#ff7f00"], ["● Compare", "#00ff00"], ["● Select key", "#0000ff"]],
    'quick': [["● Insert", "#ff0000"], ["● Compare", "#00ff00"], ["● Pivot", "#0000ff"]],
    'bubble': [["● Insert", "#ff0000"], ["● Compare", "#00ff00"]],
}

const sortName = sortNames[sortType][0];

const sortTypeTextview = document.getElementById('sort_type');
sortTypeTextview.innerText = /.*\((.*)\)/.exec(sortName)[1];

// init image draw when loaded
image.onload = async () => {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.letterSpacing = Math.round(image.width / 300) + "px";

    drawImage(arr, image, ctx)
}

// Set button diable when sorting
let onSorting = false;
function changeBtnStatus(disable) {
    const shuffleBtn = document.getElementById('shuffle');
    const runBtn = document.getElementById('run');

    onSorting = !onSorting;
    shuffleBtn.disabled = disable;
    runBtn.disabled = disable;
}

function shuffleArray() {
    if (onSorting) return;

    const shuffle = (arr) => {
        // Durstenfeld shuffle (Fisher-Yates)
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    arr = shuffle(arr);

    // draw init image
    drawImage(arr, image, ctx);
}

function start() {
    // init setting for check run count
    runCount = 0;
    runCountTextview.innerHTML = runCountText + runCount;

    // select sort method in url
    execute(sortNames[sortType][1]);
}

function execute(sortFunction) {
    const image = new Image();

    image.src = img;
    // start when image loaded
    image.onload = async () => {
        const startTime = new Date();
        changeBtnStatus(true);

        // do sort
        arr = await sortWithAnimation(image, ctx, arr, interval, sortFunction, startTime);

        // check sorted
        await sortWithAnimation(image, ctx, arr, 30, checkSorted);

        changeBtnStatus(false);
    }
}

function drawImage(arr, image, ctx, colored = []) {
    const canvas = ctx.canvas;
    canvas.width = ctx.canvas.width;
    canvas.height = ctx.canvas.height;

    const pieceWidth = image.width / arr.length;

    // draw image by block
    arr.forEach((v, i) => {
        const pieceHeight = (v + 1) * image.height / (arr.length + 1);

        ctx.drawImage(image,
            v * pieceWidth, image.height - pieceHeight,
            pieceWidth, pieceHeight,

            i * pieceWidth, image.height - pieceHeight,
            pieceWidth, pieceHeight
        );
    });

    // special colored block
    for (const { indexes, color } of colored) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        indexes.forEach(i => ctx.fillRect(i * pieceWidth, 0, pieceWidth, canvas.height));
        ctx.globalCompositeOperation = 'source-over';
    }

    const fontSize = Math.round((canvas.height / 25));
    ctx.font = fontSize + "px Arial";

    const margin = 10;

    sortInfo[sortType].forEach((v, i) => {
        const [text, color] = v;

        ctx.fillStyle = color;
        ctx.fillText(text, 0, fontSize * (i + 1) + margin * i);
    });
}

// do sort with animation
async function sortWithAnimation(image, ctx, arr, interval, generator, startTime) {
    let finalArray = [...arr];
    let colorAndSoundQueue = [];

    // get generator and make color&sound queue
    for (let result of generator(finalArray)) {
        const { array, swappedIndexes = [], compareIndexes = [], pivot = [], insert = [], gray = [] } = result;

        colorAndSoundQueue.push({
            array,
            colored: [
                { indexes: swappedIndexes, color: 'rgba(255, 0, 0, 0.7)' },
                { indexes: compareIndexes, color: 'rgba(0, 255, 0, 0.7)' },
                { indexes: pivot, color: 'rgba(0, 0, 255, 0.7)' },
                { indexes: insert, color: 'rgba(255, 125, 0, 0.7)' },
                { indexes: gray, color: 'rgba(0, 0, 0, 0.5)' },
            ],
            soundIndexes: compareIndexes.length !== 0 ? compareIndexes : swappedIndexes
        });

        finalArray = array;
    }

    // variable for check step
    let stepProgress = 0;
    let stepLength = colorAndSoundQueue.length;

    while (colorAndSoundQueue.length > 0) {
        let combinedArray;
        let combinedColored = [];

        let { array, colored, soundIndexes } = colorAndSoundQueue.shift();

        stepProgress++;

        combinedArray = array;
        combinedColored.push(...colored);

        // draw image with one animation step
        drawImage(combinedArray, image, ctx, combinedColored);
        // play beep using ocilicator
        playBeepSound(Math.max(interval, 60), arr.length, soundIndexes);

        // check time when sorting (not in checking sorted)
        if (startTime) {
            let sortPercent = (stepProgress * 100 / stepLength).toFixed(2);

            runCount++;
            runCountTextview.innerHTML = `${runCountText}${runCount} (${sortPercent}%)`;

            const runningTime = new Date() - startTime;

            let min = Math.floor(runningTime / (1000 * 60));
            min = min.toString().padStart(2, '0');

            let sec = Math.floor(runningTime / 1000 % 60);
            sec = sec.toString().padStart(2, '0');

            let ms = Math.floor(runningTime % 1000 / 10);
            ms = ms.toString().padStart(2, '0');

            runTimeTextview.innerHTML = runTimeText + `${min} : ${sec} : ${ms}`;
        }

        // for visualization with speed control
        await asleep(interval);
    }

    // draw final array
    drawImage(finalArray, image, ctx);

    return finalArray;
}

// sleep using set time out
function asleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let currentOscillators = [];
let audioCtx;

// Play Beep Using Ocilliators
function playBeepSound(duration, n, indexes) {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();

    // Stop All Oscillators
    currentOscillators.forEach((oscillator) => oscillator.stop());
    currentOscillators = [];

    indexes.forEach((i) => {
        // 100 ~ 1000
        const frequency = 100 + 900 * (i / n);

        // Create OscillatorNode
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);

        oscillator.connect(gainNode);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);

        currentOscillators.push(oscillator);
    });
}