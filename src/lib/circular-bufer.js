"use strict";

/**
 * @template T
 * @typedef {{
 *     push: (value: T) => void;
 *     shift: () => T;
 *     peek: () => T;
 *     capacity: () => number;
 *     size: () => number;
 *     clear: () => void;
 *     clone: () => CircularBuffer<T>;
 *     isEmpty: () => boolean;
 *     isFull: () => boolean;
 *     toArray: () => T[];
 *     forEach: <R>(callbackFn: (item: T, idx?: number, array?: T[]) => R, thisArg?: object) => void;
 *     values: () => ArrayIterator<T>;
 *     entries: () => ArrayIterator<[number, T]>;
 *     keys: () => ArrayIterator<number>;
 *     [Symbol.iterator]: () => Iterator<T>;
 * }} CircularBuffer<T>
 */

/**
 * @template T
 * @param {() => T} default_constructor
 * @param {number} [exponent=8] Default is `8`
 * @param {boolean} [overwrite=false] Default is `false`
 * @returns {CircularBuffer<T>}
 */
export var createCircularBuffer = (default_constructor, exponent = 8, overwrite = false) => {
    var capacity = 1 << exponent;
    var mask = capacity - 1;
    var buffer = Array.from({ length: capacity }, default_constructor);
    var head = 0;
    var tail = 0;
    var size = 0;

    return {
        push: (value) => {
            var cur = tail;
            if (size === capacity) {
                if (overwrite) head = (head + 1) & mask;
                else throw new Error();
            }

            size = size < capacity ? size + 1 : size;
            tail = (tail + 1) & mask;
            buffer[cur] = value;
        },
        shift: () => {
            if (!size) throw new Error();
            var cur = head;
            size--;
            head = (head + 1) & mask;
            return buffer[cur];
        },
        peek: () => buffer[head],
        capacity: () => capacity,
        size: () => size,
        clear: () => {
            size = head = tail = 0;
        },
        clone: () => {
            var clone = createCircularBuffer(default_constructor, exponent, overwrite);
            var snapshot = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            snapshot.forEach(clone.push);
            return clone;
        },
        isEmpty: () => size === 0,
        isFull: () => size === capacity,
        toArray: () => Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]),
        [Symbol.iterator]: () => {
            var array = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            var i = 0;

            return {
                next: () => ({ value: array[i++], done: i >= array.length }),
            };
        },
        forEach: (lambda, thisArg) => {
            var array = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            array.forEach(lambda, thisArg);
        },
        keys: () => {
            var array = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            return array.keys();
        },
        values: () => {
            var array = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            return array.values();
        },
        entries: () => {
            var array = Array.from({ length: size }, (_, i) => buffer[(head + i) & mask]);
            return array.entries();
        },
    };
};
