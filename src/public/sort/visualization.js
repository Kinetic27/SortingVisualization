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

    console.log(sortType);

    sortNames = {
        'merge': ["병합 정렬(Merge Sort)", mergeSort],
        'insert': ["삽입 정렬(Insertion Sort)", insertionSort],
    }

    execute(sortNames[sortType][1]);
}

function execute(sortFunction) {
    const image = new Image();

    image.src = img;
    image.onload = async () => {
        changeBtnStatus(true);
        arr = await sortWithAnimation(image, ctx, arr, interval, sortFunction);
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

async function sortWithAnimation(image, ctx, arr, interval, generator) {
    let finalArray = [...arr];
    let colorAndSoundQueue = [];
    const frameDuration = 60;

    for (let result of generator(finalArray)) {
        const { array, swappedIndexes = [], compareIndexes = [] } = result;

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
        }

        let duration = Math.max(frameDuration, interval);

        drawImage(combinedArray, image, ctx, combinedColored);
        playBeepSound(duration, arr.length, Array.from(combinedSoundIndexes));

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