"use strict";
import { createCircularBuffer } from "./circular-bufer.js";

/**
 * @typedef {Object} RateLiminerConfig
 * @property {number} rate
 * @property {number} [burst]
 * @property {number} period - in Ms
 * @property {number} tick_time - in Ms
 * @property {number} [exponent=8] 
 * @property {boolean} [overwrite=false]
 */

/**
 * @template T
 * @callback scheduleFunction
 * @param {Function} task
 * @param {Array<T>} [args=[]]
 * @returns {Promise<T>}
 */

/**
 * @template T
 * @typedef {Object} TokenBucketRateLimiter
 * @property {scheduleFunction<T>} schedule
 */

/**
 * @template T
 * @param {RateLiminerConfig} options 
 * @returns {TokenBucketRateLimiter<T>}
 */
export var createTokenBucketRateLimiter = (options) => {
    var rate = options.rate;
    var period = options.period;

    var burst = options.burst || 1;

    var buff_exponent = options.exponent || 8;
    var buff_overwrite = options.overwrite || false;

    var buffer = createCircularBuffer(
        () => null,
        buff_exponent,
        buff_overwrite
    );

    var tick_time = options.tick_time || 10;

    var tokens = burst;

    /** @type {ReturnType<typeof setInterval> | null} */
    var interval = null;

    var periodTicks = ((period / tick_time) | 0) + 1;
    var periodCounter = 0;
    var executedCounter = 0;

    var refillIntervalTicks = ((period / (rate * tick_time)) | 0) + 1;
    var counter = 0;


    return {
        schedule: (task, args = []) => {
            return new Promise((resolve, reject) => {
                try {
                    //@ts-ignore
                    buffer.push({
                        task,
                        args,
                        resolve,
                        reject
                    });
                } catch (error) {
                    reject(error);
                }

                if (!interval) {
                    interval = setInterval(() => {
                        if (buffer.isEmpty()) {
                            if (tokens >= burst) {
                                //@ts-ignore
                                clearInterval(interval);
                                interval = null;
                            }
                        }
                        else if (tokens) {
                            tokens--;
                            executedCounter++;
                            /** @type {any} */
                            var item = buffer.shift();

                            try {
                                Promise.resolve(item.task(...item.args))
                                    .then(item.resolve, item.reject);
                            } catch (error) { item.reject(error) }
                        }

                        periodCounter++;
                        counter++;

                        if (periodCounter >= periodTicks) {
                            executedCounter = 0;
                            tokens = burst;
                            periodCounter = 0;
                        }

                        if (counter >= refillIntervalTicks) {
                            tokens = (tokens < burst && executedCounter < rate) ? tokens + 1 : tokens;
                            counter = 0;
                        }
                    }, tick_time);
                }
            });
        }
    }
}