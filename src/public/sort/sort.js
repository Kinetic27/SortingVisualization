function* insertionSort(arr) {
    let n = arr.length;

    for (let j = 1; j < n; j++) {
        let key = arr[j];
        let i = j - 1;

        while (i >= 0 && arr[i] > key) {
            yield {
                array: [...arr],
                compareIndexes: [i],
            };
            
            arr[i+1] = arr[i];

            
            yield {
                array: [...arr],
                swappedIndexes: [i, i + 1],
            };
            
            i--;
        }

        arr[i+1] = key;
    }

    yield {
        array: [...arr]
    };
}

const mergeSort = (() => {
    function* merge(arr, left, mid, right) {
        const merged = [];
        const initialArray = [...arr];

        let i = left;
        let j = mid + 1;

        while (i <= mid && j <= right) {
            yield {
                array: [...arr],
                compareIndexes: [i, j],
            };

            merged.push(arr[i] <= arr[j] ? arr[i++] : arr[j++]);

        }

        while (i <= mid) merged.push(arr[i++]);
        while (j <= right) merged.push(arr[j++]);

        // 병합한 결과를 원래 배열에 반영
        for (let k = left; k <= right; k++) {
            arr[k] = merged[k - left];
        }

        let swappedIdexes = arr.filter((_, k) => arr[k] !== initialArray[k]).map(i => arr.indexOf(i));

        yield {
                array: [...arr],
                swappedIndexes: swappedIdexes,
        };
    }

    // 병합 정렬의 재귀 함수
    function* mergeSortRecursive(arr, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            yield* mergeSortRecursive(arr, left, mid);
            yield* mergeSortRecursive(arr, mid + 1, right);
            yield* merge(arr, left, mid, right);
        }

    }

    // 병합 정렬을 수행하는 메인 함수
    return function* mergeSort(arr) {
        yield* mergeSortRecursive(arr, 0, arr.length - 1);
        return arr;
    };
})();

function* checkSorted(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield { array: [...arr], swappedIndexes: [i] };
    }
}
