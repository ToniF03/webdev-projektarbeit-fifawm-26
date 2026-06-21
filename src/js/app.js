/*
* Created on: 2026-06-15
* Author(s): Toni Fey, Finn Konrad, Tim Zingler
* License: MIT
* Description: Description
*/

const finaleTimestamp = 1784487600;

/// A function to automatically calculate the time difference between now and the finale
/// of the 2026 World Cup and displaying it. Also hides the whole card when we are past this
/// timestamp.
function updateCountdown() {
    const now = Math.floor(Date.now() / 1000);
    // Return false and end the function if the finale has already passed.
    if (now > finaleTimestamp) return false;
    let remaining = Math.max(0, finaleTimestamp - now);

    document.getElementById('countdownCardDays').textContent = String(Math.floor(remaining / 86400));
    remaining %= 86400;

    document.getElementById('countdownCardHours').textContent = String(Math.floor(remaining / 3600));
    remaining %= 3600;

    document.getElementById('countdownCardMinutes').textContent = String(Math.floor(remaining / 60));
    document.getElementById('countdownCardSeconds').textContent = String(Math.floor(remaining % 60));
    return true;
}

if (updateCountdown())
    setInterval(updateCountdown, 1000);
else
    document.getElementById('countdownCard').classList.add('hide');



async function fetchFromURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Server Error. [CODE:${response.status}]`);
        }
        const data = await response.json();
        return data;
    }
    catch (msg) {
        console.error(msg);
    }
}

let finishedGames = [];
let ongoingGames = [];
let futureGames = [];

let teamsData = [];

async function getGameData() {
    let gameData = await fetchFromURL("https://worldcup26.ir/get/games");
    if (gameData == null) {
        console.error("Could not fetch games data")
        return;
    }

    let finishedGamesCount = 0;
    let ongoingGamesCount = 0;
    let futureGamesCount = 0;

    gameData["games"].forEach(element => {
        if (!element["home_team_name_en"] || !element["away_team_name_en"])
            return;
        if (element["time_elapsed"] == "notstarted") {
            futureGames[futureGamesCount] = element;
            futureGamesCount++;
        }
        else if (element["time_elapsed"] == "finished") {
            finishedGames[finishedGamesCount] = element;
            finishedGamesCount++;
        }
        else {
            ongoingGames[ongoingGamesCount]
        }
    });

    console.log("Amount of finished games: " + String(finishedGamesCount));
    console.log("Amount of ongoing games: " + String(ongoingGamesCount));
    console.log("Amount of future games: " + String(futureGamesCount));
    console.log(finishedGames);
    console.log(futureGames);

    teamsData = await fetchFromURL("https://worldcup26.ir/get/teams");
    console.log(teamsData);
}

getGameData();
