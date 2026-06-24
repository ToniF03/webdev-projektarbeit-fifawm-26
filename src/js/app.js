/*
* Created on: 2026-06-15
* Author(s): Toni Fey, Finn Konrad, Tim Zingler
* License: MIT
* Description: Description
*/

import { TIME_CALCULATIONS, API_LINKS, FINALE_TIMESTAMP } from './lib/utility/constants.js';

const displayedMatches = 3;
const displayedGroups = 5;
const isSchedulePage = document.body.classList.contains('schedule-page');

const [daysEl, hoursEl, minutesEl, secondsEl] = [
    'countdownCardDays',
    'countdownCardHours',
    'countdownCardMinutes',
    'countdownCardSeconds'
].map(id => document.getElementById(id));

const countdownCard = document.getElementById('countdownCard');

let finishedGames = [];
let ongoingGames = [];
let futureGames = [];

let teamsData = [];
let stadiumsData = [];

/// A function to automatically calculate the time difference between now and the finale
/// of the 2026 World Cup and displaying it. Also hides the whole card when we are past this
/// timestamp.
/// returns: a bool depending on if the finale has already started/passed
function updateCountdown() {
    const now = Math.floor(Date.now() / TIME_CALCULATIONS.MILLISECONDS_TO_SECONDS);
    // Return false and end the function if the finale has already passed.
    if (now > FINALE_TIMESTAMP.FINALE_TIMESTAMP) return false;
    let remaining = Math.max(0, FINALE_TIMESTAMP.FINALE_TIMESTAMP - now);

    daysEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.DAY_TO_SECONDS));
    remaining %= TIME_CALCULATIONS.DAY_TO_SECONDS;

    hoursEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.HOUR_TO_SECONDS));
    remaining %= TIME_CALCULATIONS.HOUR_TO_SECONDS;

    minutesEl.textContent = String(Math.floor(remaining / TIME_CALCULATIONS.MINUTE_TO_SECONDS));
    secondsEl.textContent = String(Math.floor(remaining % TIME_CALCULATIONS.MINUTE_TO_SECONDS));
    return true;
}

if (daysEl && hoursEl && minutesEl && secondsEl && countdownCard) {
    if (updateCountdown())
        setInterval(updateCountdown, 1000);
    else
        countdownCard.classList.add('hide');
}


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

async function getGameData() {
    let gameData = await fetchFromURL(API_LINKS.GAMES_API);
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
        if (element["time_elapsed"].toLowerCase() == "notstarted") {
            futureGames[futureGamesCount] = element;
            futureGamesCount++;
        }
        else if (element["time_elapsed"].toLowerCase() == "finished") {
            finishedGames[finishedGamesCount] = element;
            finishedGamesCount++;
        }
        else {
            ongoingGames[ongoingGamesCount] = element;
            ongoingGamesCount++;
        }
    });

    teamsData = await fetchFromURL(API_LINKS.TEAMS_API);
    teamsData.teams.sort((a, b) => a.id - b.id);

    stadiumsData = await fetchFromURL(API_LINKS.STADIUMS_API);
    stadiumsData.stadiums.sort((a, b) => a.id - b.id);

    if (isSchedulePage)
        buildScheduleCards();
    else {
        buildFollowingGamesCards();
        buildGroupCards();
    }
}

function buildGroupCards() {
    let groupContainer = document.getElementById("groupContainer");

    if (!groupContainer)
        return;

    let sortedGroups = [];

    sortedGroups = teamsData.teams.reduce((groups, team) => {
        const group = team.groups;

        if (!groups[group]) {
            groups[group] = [];
        }

        groups[group].push(team);

        return groups;
    }, {});

    console.log(sortedGroups);

    for (let i = 0; i < displayedGroups; i++) {
        let groupCard = document.createElement('div');
        const group = sortedGroups[String.fromCharCode(65 + i)];
        groupCard.classList.add("card", "card--interactive", "no-shadow", "flex", "py-0");

        if (i < displayedGroups - 1)
            groupCard.classList.add("mb-0");

        let groupName = document.createElement("span");
        groupName.textContent = "GRUPPE " + group[0]["groups"];

        let groupFlagContainer = document.createElement("div");
        groupFlagContainer.classList.add("grid", "grid-cols-4", "mr-auto", "ml-auto");

        for (let flagIndex = 0; flagIndex < 4; flagIndex++) {
            let flag = document.createElement("img");
            flag.alt = group[flagIndex].name_en;
            flag.title = group[flagIndex].name_en;
            flag.src = group[flagIndex].flag;
            flag.classList.add("flag");
            
            groupFlagContainer.append(flag);
        }

        let chevron = document.createElement("i");
        chevron.classList.add("fa", "fa-chevron-right");

        groupCard.append(groupName, groupFlagContainer, chevron);
        groupContainer.append(groupCard);
    }
}

function buildFollowingGamesCards() {
    const upcomingMatchesContainer = document.getElementById('upcomingMatchesContainer');

    if (!upcomingMatchesContainer)
        return;

    if (futureGames.length == 0) {
        upcomingMatchesContainer.classList.add('hide');
        return;
    }

    for (let i = 0; i < displayedMatches; i++) {
        let match = futureGames[i];
        if (!match)
            break;
        let homeTeam = teamsData["teams"][match["home_team_id"] - 1];
        let awayTeam = teamsData["teams"][match["away_team_id"] - 1];
        let stadium = stadiumsData["stadiums"][match["stadium_id"] - 1];

        let matchCard = document.createElement('article');
        matchCard.classList.add('card');
        matchCard.classList.add('grid');
        matchCard.classList.add('grid-cols-2');

        let homeTeamFlag = document.createElement('img');
        homeTeamFlag.alt = match["home_team_name_en"];
        homeTeamFlag.src = homeTeam.flag;
        homeTeamFlag.title = match["home_team_name_en"];
        homeTeamFlag.loading = "lazy";
        homeTeamFlag.classList.add("flag");

        let awayTeamFlag = document.createElement('img');
        awayTeamFlag.alt = match["away_team_name_en"];
        awayTeamFlag.src = awayTeam.flag;
        awayTeamFlag.title = match["away_team_name_en"];
        awayTeamFlag.loading = "lazy";
        awayTeamFlag.classList.add("flag");
        awayTeamFlag.classList.add("justify-self-right");

        let homeTeamName = document.createElement('h4');
        homeTeamName.textContent = match["home_team_name_en"];

        let awayTeamName = document.createElement('h4');
        awayTeamName.textContent = match["away_team_name_en"];
        awayTeamName.classList.add('tr');

        let gameTime = document.createElement('a');
        let gameTimeIcon = document.createElement('i');
        gameTimeIcon.classList.add('fa');
        gameTimeIcon.classList.add('fa-calendar');
        gameTime.append(gameTimeIcon);

        let timeDifference = 0;

        if (match['stadium_id'] < 4)
            timeDifference = 6
        else if (match['stadium_id'] < 7)
            timeDifference = 5
        else if (match['stadium_id'] < 13)
            timeDifference = 4
        else
            timeDifference = 7

        const d = new Date(match["local_date"] + " GMT-0" + String(timeDifference) + "00");
        gameTime.append(" " + d.toLocaleString("en-US"));

        let gameLocation = document.createElement('a');
        let gameLocationIcon = document.createElement('i');
        gameLocationIcon.classList.add('fa');
        gameLocationIcon.classList.add('fa-location-dot');
        gameLocation.append(gameLocationIcon);
        gameLocation.append(" " + stadium.fifa_name + ", " + stadium.city_en + ", " + stadium.country_en);
        gameLocation.classList.add("tr");

        matchCard.append(homeTeamFlag, awayTeamFlag, homeTeamName, awayTeamName, gameTime, gameLocation);
        upcomingMatchesContainer.append(matchCard);
    }
}

function getMatchDate(match) {
    let timeDifference = 0;

    if (match['stadium_id'] < 4)
        timeDifference = 6;
    else if (match['stadium_id'] < 7)
        timeDifference = 5;
    else if (match['stadium_id'] < 13)
        timeDifference = 4;
    else
        timeDifference = 7;

    return new Date(match["local_date"] + " GMT-0" + String(timeDifference) + "00");
}

function getMatchStatusLabel(match) {
    const status = String(match["time_elapsed"] ?? "").toLowerCase();

    if (status == "finished")
        return "Beendet";
    if (status == "notstarted")
        return "Bevorstehend";
    return "Live";
}

function getMatchScoreText(match) {
    const status = String(match["time_elapsed"] ?? "").toLowerCase();

    if (status == "notstarted")
        return "VS";

    const homeScore = match["home_team_score"];
    const awayScore = match["away_team_score"];

    if (homeScore == null || awayScore == null)
        return "-";

    return `${homeScore} : ${awayScore}`;
}

function createScheduleMatchCard(match) {
    let homeTeam = teamsData["teams"][match["home_team_id"] - 1];
    let awayTeam = teamsData["teams"][match["away_team_id"] - 1];
    let stadium = stadiumsData["stadiums"][match["stadium_id"] - 1];
    let status = String(match["time_elapsed"] ?? "").toLowerCase();

    let matchCard = document.createElement('article');
    matchCard.classList.add('card', 'schedule-match-card');

    let header = document.createElement('div');
    header.classList.add('schedule-match-card__header');

    let statusBadge = document.createElement('span');
    statusBadge.classList.add('schedule-match-card__status');
    if (status == "finished")
        statusBadge.classList.add('schedule-match-card__status--finished');
    else if (status != "notstarted")
        statusBadge.classList.add('schedule-match-card__status--live');
    statusBadge.textContent = getMatchStatusLabel(match);

    let timeLabel = document.createElement('span');
    timeLabel.classList.add('schedule-match-card__time');

    let timeIcon = document.createElement('i');
    timeIcon.classList.add('fa', 'fa-calendar');
    timeLabel.append(timeIcon, ` ${getMatchDate(match).toLocaleString("de-DE", { dateStyle: 'medium', timeStyle: 'short' })}`);

    header.append(statusBadge, timeLabel);

    let body = document.createElement('div');
    body.classList.add('schedule-match-card__body');

    let homeBlock = document.createElement('div');
    homeBlock.classList.add('schedule-match-card__team');

    let homeFlag = document.createElement('img');
    homeFlag.alt = match["home_team_name_en"];
    homeFlag.src = homeTeam.flag;
    homeFlag.loading = 'lazy';
    homeFlag.classList.add('flag');

    let homeName = document.createElement('div');
    let homeTitle = document.createElement('h4');
    homeTitle.textContent = match["home_team_name_en"];
    let homeSubtitle = document.createElement('p');
    homeSubtitle.textContent = 'Heimteam';
    homeName.append(homeTitle, homeSubtitle);

    homeBlock.append(homeFlag, homeName);

    let score = document.createElement('div');
    score.classList.add('schedule-match-card__score');
    score.textContent = getMatchScoreText(match);

    let awayBlock = document.createElement('div');
    awayBlock.classList.add('schedule-match-card__team', 'schedule-match-card__team--away');

    let awayName = document.createElement('div');
    let awayTitle = document.createElement('h4');
    awayTitle.textContent = match["away_team_name_en"];
    let awaySubtitle = document.createElement('p');
    awaySubtitle.textContent = 'Gastteam';
    awayName.append(awayTitle, awaySubtitle);

    let awayFlag = document.createElement('img');
    awayFlag.alt = match["away_team_name_en"];
    awayFlag.src = awayTeam.flag;
    awayFlag.loading = 'lazy';
    awayFlag.classList.add('flag', 'justify-self-right');

    awayBlock.append(awayName, awayFlag);

    body.append(homeBlock, score, awayBlock);

    let footer = document.createElement('div');
    footer.classList.add('schedule-match-card__footer');

    let location = document.createElement('span');
    location.classList.add('schedule-match-card__location');

    let locationIcon = document.createElement('i');
    locationIcon.classList.add('fa', 'fa-location-dot');
    location.append(locationIcon, ` ${stadium.fifa_name}, ${stadium.city_en}, ${stadium.country_en}`);

    footer.append(location);

    matchCard.append(header, body, footer);

    return matchCard;
}

function buildScheduleCards() {
    const scheduleContainer = document.querySelector('.schedule-layout');
    const finishedContainer = document.getElementById('scheduleFinishedMatchesContainer');
    const ongoingContainer = document.getElementById('scheduleOngoingMatchesContainer');
    const upcomingContainer = document.getElementById('scheduleUpcomingMatchesContainer');
    const statsContainer = document.getElementById('spielplanStats');

    if (statsContainer) {
        statsContainer.innerHTML = '';

        const stats = [
            { value: finishedGames.length, label: 'Beendet' },
            { value: ongoingGames.length, label: 'Live' },
            { value: futureGames.length, label: 'Bevorstehend' }
        ];

        stats.forEach(stat => {
            const statCard = document.createElement('article');
            statCard.classList.add('card', 'schedule-stat');

            const value = document.createElement('strong');
            value.textContent = String(stat.value);

            const label = document.createElement('span');
            label.textContent = stat.label;

            statCard.append(value, label);
            statsContainer.append(statCard);
        });
    }

    const sections = [
        [finishedContainer, finishedGames],
        [ongoingContainer, ongoingGames],
        [upcomingContainer, futureGames]
    ];
    
    sections.forEach(([container, matches]) => {
        if (!container)
            return;

        container.innerHTML = '';

        if (matches.length == 0) {
            const emptyState = document.createElement('p');
            emptyState.classList.add('schedule-empty-state');
            emptyState.textContent = 'Keine Spiele in dieser Kategorie verfügbar.';
            container.append(emptyState);
            return;
        }

        matches.forEach(match => {
            container.append(createScheduleMatchCard(match));
        });
    });
}

/// Fetches the current news to the World Cup 2026 from www.espn.com. And adds them to the newsContainer.
async function getNews() {
    let newsContainer = document.getElementById("newsContainer");
    if (!newsContainer)
        return;

    let newsData = await fetchFromURL(API_LINKS.NEWS_API);
    if (newsData == null) {
        console.error("Could not fetch news data")
        return;
    }

    for (let i = 0; i < 2; i++) {
        let article = newsData['articles'][i];
        if (!article)
            break;

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
