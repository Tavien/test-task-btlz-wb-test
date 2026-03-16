"use strict;";

/**
 * @template [T=string] Default is `string`
 * @typedef {Object} BaseErr
 * @property {T} code
 * @property {string} message
 * @property {unknown} original
 */

/**
 * @template T
 * @template {Error | BaseErr<string>} [E=BaseErr<string>] Default is `BaseErr<string>`
 * @typedef {{ __SUCCESS__: true; __DATA__: T } | { __SUCCESS__: false; __ERROR__: E }} ResultType
 */

/**
 * @template T
 * @template {Error | BaseErr<string>} E
 * @param {ResultType<T, E>} result
 * @returns {<R>(patterns: { onOk: (data: T) => R; onErr: (error: E) => R }) => R}
 */
export var match = (result) => (patterns) => (result.__SUCCESS__ ? patterns.onOk(result.__DATA__) : patterns.onErr(result.__ERROR__));

/**
 * @template T
 * @template {Error | BaseErr<string>} E
 * @param {ResultType<T, E>} result
 * @returns {T}
 * @throws {E}
 */
export var unwrap = (result) =>
    result.__SUCCESS__
        ? result.__DATA__
        : (() => {
              throw result.__ERROR__;
          })();

export var Result = {
    /**
     * @template T
     * @template [E=never] Default is `never`
     * @param {T} __DATA__
     * @returns {ResultType<T, E>}
     */
    Ok: (__DATA__) => ({
        __SUCCESS__: true,
        __DATA__,
    }),
    /**
     * @template E
     * @template [T=never] Default is `never`
     * @param {E} __ERROR__
     * @returns {ResultType<T, E>}
     */
    Err: (__ERROR__) => ({
        __SUCCESS__: false,
        __ERROR__,
    }),
};
