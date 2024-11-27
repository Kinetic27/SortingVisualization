function range(s, e) {
    return Array.from(new Array(e - s), (_, i) => i + s);
}

function* insertionSort(arr) {
    let n = arr.length;

    for (let j = 1; j < n; j++) {
        let key = arr[j];
        let i = j - 1;


        yield {
            array: [...arr],
            pivot: [j],
            blue: range(j + 1, n)
        };

        while (i >= 0 && arr[i] > key) {
            yield {
                array: [...arr],
                compareIndexes: [i],
                blue: range(i == j - 1 ? j : j + 1, n)
            };

            arr[i + 1] = arr[i];


            yield {
                array: [...arr],
                swappedIndexes: [i + 1],
                blue: range(j + 1, n)
            };

            i--;
        }

        arr[i + 1] = key;
        
        yield {
            array: [...arr],
            swappedIndexes: [i + 1],
            blue: range(j + 1, n)
        };
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

        let swappedIndexes = arr.filter((_, k) => arr[k] !== initialArray[k]).map(i => arr.indexOf(i));

        yield {
            array: [...arr],
            swappedIndexes: swappedIndexes,
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

const quickSort = (() => {
    function* divide(arr, left, right) {
        const mid = Math.floor((left + right) / 2);
        const pivot = arr[mid];

        while (left <= right) {
            while (arr[left] < pivot) {
                left++;
            }

            while (arr[right] > pivot) {
                right--;
            }

            yield {
                array: [...arr],
                compareIndexes: [left, right],
                pivot: [pivot],
            };

            if (left <= right) {
                [arr[left], arr[right]] = [arr[right], arr[left]];

                yield {
                    array: [...arr],
                    swappedIndexes: [left, right],
                    pivot: [pivot],
                };

                left++;
                right--;
            }
        }

        return left;

    }

    function* quickSortRecursive(arr, left, right) {
        if (left < right) {
            const partition = yield* divide(arr, left, right);
            yield* quickSortRecursive(arr, left, partition - 1);
            yield* quickSortRecursive(arr, partition, right);
        }
    }

    return function* quickSort(arr) {
        yield* quickSortRecursive(arr, 0, arr.length - 1);
        return arr;
    };
})();

function* bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            yield {
                array: [...arr],
                compareIndexes: [j, j + 1],
                blue: [...range(n - i, n)]
            };
            swapped = true;

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];


                yield {
                    array: [...arr],
                    swappedIndexes: [j, j + 1],
                    blue: [...range(n - i, n)]
                };
            }
        }

        if (!swapped) break;
    }

    return arr;
}

function* checkSorted(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield { array: [...arr], compareIndexes: [i] };
    }
}
