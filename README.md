# Advent of Code 2022

Here is my first go at Advent of Code, attempted daily challenges during December 2022 using test driven development.

## what I learned

 - enjoyed problems involving geometry and path-finding in graph data structures
 - found a way to reverse Djikstra's Algorithm to find shortest path across multiple points to improve performance
 - algorithm for lowest common multiple across divisors
 - large numbers too cumbersome to handle accurately that also need divisibility tests can be reduced by taking the remainder division of the lowest common multiple of the divisors in the divisibility checks. The remainder is a critical value as the integer only holds knowledge of whether the value is divisible by any of the divisors without being divisible by all. The remainder division of 0 would indicate it was a multiple of all divisors, so when performing a remainder division for a division test, it will behave as through it was divisible.
 - object oriented programming in TypeScript, particularly when managing state.
 - taking a more procedural approach can sometimes simplify the solution for the problem at hand.

