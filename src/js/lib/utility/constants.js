/*
* Created on: 2026-06-11
* Author(s): Toni Fey, Finn Konrad, Tim Zingler
* License: MIT
* Description: Javascript file that contains all the constants.
*/

export const SINGLETON = Object.freeze({
    SINGLETON_KEY: 'UseTheGetterFunctionToInitializeTheSingletonClass'
})

export const API_EVENTS = Object.freeze({
    SUCCESS_EVENT_PREFIX: 'api-loaded',
    FAILURE_EVENT_PREFIX: 'api-failed'
})

export const TIME_CALCULATIONS = Object.freeze({
    MILLISECONDS_TO_SECONDS: 1000,
    DAY_TO_SECONDS: 86400,
    HOUR_TO_SECONDS: 3600,
    MINUTE_TO_SECONDS: 60
})