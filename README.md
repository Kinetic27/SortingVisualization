# Sorting Algorithm Visual Project

2024 2-2 Algorithm Term Project
Team I

## IDEA

Let's make it easier to understand by visualizing the sorting algorithms in the textbook.  
You will be able to directly experience the time complexity of each algorithm.  

# How to use

<p>https://algo.kinetic.moe/</p>

## 1. select the algorithm u want to use.

The "Split Length" slider lets you decide how much you want to split the picture into small pieces.
"Run 1 frame Per" slider to adjust how many seconds you want to run one frame.

<p>And choose algorithm u want!</p>
<img src = "https://github.com/user-attachments/assets/9521cf11-9a31-4433-a6e0-b45a7027e46f" width="45%" height="45%">
<img src = "https://github.com/user-attachments/assets/52ef7d12-6b18-4c31-97fe-4328b056c209" width="45%" height="45%">

## 2. Press the shuffle button to shuffle
<img src = "https://github.com/user-attachments/assets/aa4bd898-110f-49f4-bc53-5121d4145df6" width="50%" height="50%">

## 3. Click Run to see the sorting visualization


# Sort Algorithms

## Insertion Sort, Merge Sort  

<div style="display: flex">
  <img src = "https://github.com/user-attachments/assets/75513477-1c11-48b3-bfce-de1d5b31aed2" width="45%" height="45%">
  <img src = "https://github.com/user-attachments/assets/cbc434db-5c82-494b-8aad-d7b1368cfdc7" width="45%" height="45%">
</div>

## Quick Sort

```
// Sorts (a portion of) an array, divides it into partitions, then sorts those
algorithm quicksort(A, lo, hi) is 
  if lo >= 0 && hi >= 0 && lo < hi then
    p := partition(A, lo, hi) 
    quicksort(A, lo, p) // Note: the pivot is now included
    quicksort(A, p + 1, hi) 

// Divides array into two partitions
algorithm partition(A, lo, hi) is 
  // Pivot value
  pivot := A[lo] // Choose the first element as the pivot

  // Left index
  i := lo - 1 

  // Right index
  j := hi + 1

loop forever 
    // Move the left index to the right at least once and while the element at
    // the left index is less than the pivot
    do i := i + 1 while A[i] < pivot
    
    // Move the right index to the left at least once and while the element at
    // the right index is greater than the pivot
    do j := j - 1 while A[j] > pivot

    // If the indices crossed, return
    if i >= j then return j
    
    // Swap the elements at the left and right indices
    swap A[i] with A[j]
```
`Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford (2009) [1990]. "Quicksort". Introduction to Algorithms (3rd ed.). MIT Press and McGraw-Hill. pp. 170–190. ISBN 0-262-03384-4.`

## Bubble Sort

```
procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n - 1 inclusive do
            if A[i - 1] > A[i] then
                swap(A[i - 1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure
```
`https://en.wikipedia.org/wiki/Bubble_sort`
## 
