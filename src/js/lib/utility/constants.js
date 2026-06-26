/*
* Created on: 2026-06-11
* Author(s): Toni Fey
* License: MIT
* Description: Javascript file that contains all the constants.
*/

export const TIME_CALCULATIONS = Object.freeze({
    // Conversion factor for Date.now() (milliseconds) to Unix seconds.
    MILLISECONDS_TO_SECONDS: 1000,
    // Common time unit constants in seconds.
    DAY_TO_SECONDS: 86400,
    HOUR_TO_SECONDS: 3600,
    MINUTE_TO_SECONDS: 60
})

export const FINALE_TIMESTAMP = Object.freeze({
    // FIFA World Cup 2026 final kickoff as Unix timestamp (UTC seconds).
    FINALE_TIMESTAMP: 1784487600
})

// Centralized API endpoints used across the app.
export const API_LINKS = Object.freeze({
    NEWS_API: "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/news",
    TEAMS_API: "https://worldcup26.ir/get/teams",
    GAMES_API: "https://worldcup26.ir/get/games",
    STADIUMS_API: "https://worldcup26.ir/get/stadiums"
})