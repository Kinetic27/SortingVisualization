const params = new URL(location.href).searchParams;
const n = params.get('n') * 1 || 100;
const interval = params.get('s') * 1 || 20;

let arr = [...Array(n).keys()]

// Load Image
const img = 'https://www.gachon.ac.kr/sites/pr/atchmnfl/bbs/464/thumbnail/thumb_temp_1729488066932100.jpg';
const image = new Image();
image.src = img;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let runCount = 0;
const runCountTextview = document.getElementById('run_cnt');
const runCountText = "Running Count - ";

const runTimeTextview = document.getElementById('run_time');
const runTimeText = "Running Time - ";

// init image draw when loaded
image.onload = async () => {
    canvas.width = image.width;
    canvas.height = image.height;
    drawImage(arr, image, ctx)
}

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
        // Durstenfeld shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    arr = shuffle(arr);
    drawImage(arr, image, ctx)
}

function start() {
    const currentPath = new URL(location.href).pathname;
    const sortType = currentPath.split('/').pop();

    sortNames = {
        'merge': ["병합 정렬(Merge Sort)", mergeSort],
        'insert': ["삽입 정렬(Insertion Sort)", insertionSort],
    }

    runCount = 0;
    runCountTextview.innerHTML = runCountText + runCount;

    execute(sortNames[sortType][1]);
}

function execute(sortFunction) {
    const image = new Image();

    image.src = img;
    image.onload = async () => {
        const startTime = new Date();
        changeBtnStatus(true);
        arr = await sortWithAnimation(image, ctx, arr, interval, sortFunction, startTime);
        await sortWithAnimation(image, ctx, arr, interval, checkSorted);
        changeBtnStatus(false);
    }
}

function drawImage(arr, image, ctx, colored = []) {
    const canvas = ctx.canvas;
    canvas.width = ctx.canvas.width;
    canvas.height = ctx.canvas.height;

    const pieceWidth = image.width / arr.length;

    arr.forEach((v, i) => {
        const pieceHeight = (v + 1) * image.height / (arr.length + 1);

        ctx.drawImage(image,
            v * pieceWidth, image.height - pieceHeight,
            pieceWidth, pieceHeight,

            i * pieceWidth, image.height - pieceHeight,
            pieceWidth, pieceHeight
        );
    });

    for (const { indexes, color } of colored) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        indexes.forEach(i => ctx.fillRect(i * pieceWidth, 0, pieceWidth, canvas.height));
        ctx.globalCompositeOperation = 'source-over';
    }
}

async function sortWithAnimation(image, ctx, arr, interval, generator, startTime) {
    let finalArray = [...arr];
    let colorAndSoundQueue = [];
    const frameDuration = 60;

    for (let result of generator(finalArray)) {
        const { array, swappedIndexes = [], compareIndexes = [], runCount } = result;

        colorAndSoundQueue.push({
            array,
            colored: [
                { indexes: compareIndexes, color: 'rgba(255, 0, 0, 0.5)' },
                { indexes: swappedIndexes, color: 'rgba(0, 255, 0, 0.5)' },
            ],
            soundIndexes: compareIndexes.length !== 0 ? compareIndexes : swappedIndexes
        });

        finalArray = array;
    }

    const numStepsPerFrame = Math.ceil(frameDuration / interval);
    let stepProgress = 0;
    let stepLength = colorAndSoundQueue.length;

    while (colorAndSoundQueue.length > 0) {
        let combinedArray;
        let combinedColored = [];
        let combinedSoundIndexes = new Set();

        for (let i = 0; i < numStepsPerFrame && colorAndSoundQueue.length > 0; i++) {
            let { array, colored, soundIndexes } = colorAndSoundQueue.shift();

            combinedArray = array;
            combinedColored.push(...colored);

            if (i === 0)
                soundIndexes.forEach(index => combinedSoundIndexes.add(index));

            stepProgress++;
        }

        let duration = Math.max(frameDuration, interval);


        drawImage(combinedArray, image, ctx, combinedColored);
        playBeepSound(duration, arr.length, Array.from(combinedSoundIndexes));




        if (startTime) {
            let sortPercent = (stepProgress * 100 / stepLength).toFixed(2);

            
            runCount++;
            runCountTextview.innerHTML = `${runCountText}${runCount}, ${sortPercent}%`;

            const runningTime = new Date() - startTime;

            let min = Math.floor(runningTime / (1000 * 60));
            min = min.toString().padStart(2, '0');

            let sec = Math.floor(runningTime / 1000 % 60);
            sec = sec.toString().padStart(2, '0');

            let ms = Math.floor(runningTime % 1000 / 10);
            ms = ms.toString().padStart(2, '0');


            runTimeTextview.innerHTML = runTimeText + `${min} : ${sec} : ${ms}`;
        }

        await asleep(Math.max(frameDuration, interval));
    }

    drawImage(finalArray, image, ctx);

    return finalArray;
}

function asleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let currentOscillators = [];
let audioCtx;

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
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);

        oscillator.connect(gainNode);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);

        currentOscillators.push(oscillator);
    });
}