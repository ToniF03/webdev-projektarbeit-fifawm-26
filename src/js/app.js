/*
* Created on: 2026-06-15
* Author(s): Toni Fey, Finn Konrad, Tim Zingler
* License: MIT
* Description: Description
*/

import { TIME_CALCULATIONS } from './lib/utility/constants.js';

const finaleTimestamp = 1784487600;
const newsAPI = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/news";
const teamsAPI = "https://worldcup26.ir/get/teams";
const gamesAPI = "https://worldcup26.ir/get/games";
const newsBaseURL = "https://www.espn.com/soccer/story/_/id/";

const [daysEl, hoursEl, minutesEl, secondsEl] = [
    'countdownCardDays',
    'countdownCardHours',
    'countdownCardMinutes',
    'countdownCardSeconds'
].map(id => document.getElementById(id));

/// A function to automatically calculate the time difference between now and the finale
/// of the 2026 World Cup and displaying it. Also hides the whole card when we are past this
/// timestamp.
/// returns: a bool depending on if the finale has already started/passed
function updateCountdown() {
    const now = Math.floor(Date.now() / TIME_CALCULATIONS.MILLISECONDS_TO_SECONDS);
    // Return false and end the function if the finale has already passed.
    if (now > finaleTimestamp) return false;
    let remaining = Math.max(0, finaleTimestamp - now);

    daysEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.DAY_TO_SECONDS));
    remaining %= TIME_CALCULATIONS.DAY_TO_SECONDS;

    hoursEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.HOUR_TO_SECONDS));
    remaining %= TIME_CALCULATIONS.HOUR_TO_SECONDS;

    minutesEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.MINUTE_TO_SECONDS));
    secondsEl.textContent = String(Math.floor(remaining % TIME_CALCULATIONS.MINUTE_TO_SECONDS));
    return true;
}

if (updateCountdown())
    setInterval(updateCountdown, 1000);
else
    document.getElementById('countdownCard').classList.add('hide');


/// Fetch a document from an URL
/// returns: a bool depending if the fetching process worked
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
    let gameData = await fetchFromURL(gamesAPI);
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

    teamsData = await fetchFromURL(teamsAPI);
    console.log(teamsData);
}

/// Fetches the current news to the World Cup 2026 from www.espn.com. And adds them to the newsContainer.
async function getNews() {
    let newsData = await fetchFromURL(newsAPI);
    if (newsData == null) {
        console.error("Could not fetch news data")
        return;
    }
    console.log(newsData);

    let newsContainer = document.getElementById("newsContainer");

    for (let i = 0; i < 2; i++) {
        let article = newsData['articles'][i];

        let newsCard = document.createElement('article');
        newsCard.classList.add("card");
        newsCard.classList.add("card--news");
        newsCard.classList.add("card--interactive");

        let newsImage = document.createElement('img');
        newsImage.alt = article['images'][0]['alt'];
        newsImage.src = article['images'][0]['url'];

        let newsHeader = document.createElement('h4');
        newsHeader.textContent = article['headline'];

        let newsDescription = document.createElement('p');
        newsDescription.textContent = article['description'];

        let newsAnchor = document.createElement('a');
        newsAnchor.href = article['links']['web']['href'];
        newsAnchor.textContent = "Read more ";

        let newsAnchorChevron = document.createElement('i');
        newsAnchorChevron.classList.add("fa");
        newsAnchorChevron.classList.add("fa-chevron-right");

        newsAnchor.append(newsAnchorChevron);
        newsCard.append(newsImage, newsHeader, newsDescription, newsAnchor);
        newsContainer.append(newsCard);

        newsCard.addEventListener("click", function () {
            window.location.href = article['links']['web']['href'];
        });
    }
}

getGameData();
getNews();
