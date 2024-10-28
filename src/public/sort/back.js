const params = new URL(location.href).searchParams;
const n = params.get('n') * 1 || 100;
let arr = [...Array(n).keys()]

// Load Image
// const img = 'https://www.gachon.ac.kr/sites/pr/atchmnfl/bbs/464/thumbnail/thumb_temp_1729488066932100.jpg';
const img = "https://i.redd.it/9q0nef5v8z531.jpg"
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
        const interval = 22;

        changeBtnStatus(true)
        await animateSort(image, ctx, arr, interval, sortFunction, true);
        changeBtnStatus(false)
    }
}

function drawImage(arr, image, ctx, colored = []) {
    const canvas = ctx.canvas;
    canvas.width = ctx.canvas.width;
    canvas.height = ctx.canvas.height;

    const pieces = [];
    const pieceWidth = image.width / arr.length;
    

    for (let i = 0; i < arr.length; i++) {
        const pieceCanvas = document.createElement('canvas');
        const pieceCtx = pieceCanvas.getContext('2d');

        pieceCanvas.width = pieceWidth;
        pieceCanvas.height = image.height;

        pieceCtx.drawImage(image,
            i * pieceWidth, 0, pieceWidth, image.height,
            0, 0, pieceWidth, image.height
        );

        pieces.push(pieceCanvas);
    }

    pieces.forEach((piece, index) => ctx.drawImage(piece, arr[index] * pieceWidth, 0, piece.width, piece.height));

    for (const { indexes, color } of colored) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        indexes.forEach(i => ctx.fillRect(i * pieceWidth, 0, pieceWidth, canvas.height));
        ctx.globalCompositeOperation = 'source-over';
    }
}

async function animateSort(image, ctx, arr, interval, generator, yieldCompare) {
    let finalArray = [...arr];
    let colorAndSoundQueue = [];
    const frameDuration = 60;

    for (let result of generator(finalArray, yieldCompare)) {
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
            if (i === 0) {
                soundIndexes.forEach(index => combinedSoundIndexes.add(index));
            }
        }
        let duration = Math.max(frameDuration, interval);

        drawImage(combinedArray, image, ctx, combinedColored);
        playBeep(duration, arr.length, Array.from(combinedSoundIndexes));
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

function playBeep(duration, n, indexes) {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();

    // 이전에 실행 중인 모든 oscillator를 정지
    currentOscillators.forEach((oscillator) => oscillator.stop());
    currentOscillators = []; // 배열 초기화
    // indexes 배열을 순회하며 각 음을 재생
    indexes.forEach((i) => {
        const frequency = calculateFrequency(n, i);

        // OscillatorNode 생성
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

function calculateFrequency(n, i) {
    // 듣기좋은 주파수 범위: 20Hz ~ 20kHz
    const minFrequency = 100;
    const maxFrequency = 1000;

    const frequency = minFrequency + (maxFrequency - minFrequency) * (i / n);
    return frequency;
}