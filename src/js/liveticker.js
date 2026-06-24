import { API_LINKS } from './lib/utility/constants.js';

const ticker = document.getElementById('liveTicker');

function renderItems(items) {
    if (!ticker) return;
    ticker.innerHTML = '';
    if (!items.length) {
        const p = document.createElement('p');
        p.className = 'muted';
        p.textContent = 'Keine Live‑Meldungen verfügbar.';
        ticker.append(p);
        return;
    }

    const list = document.createElement('ul');
    list.className = 'live-ticker-list';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'live-ticker-item';
        li.innerHTML = `<strong>${item.time}</strong> — ${item.text}`;
        list.append(li);
    });

    ticker.append(list);
}

function summarizeGame(g) {
    const status = String(g.time_elapsed ?? '').toLowerCase();
    const home = g.home_team_name_en || g.home_team_name || 'Heim';
    const away = g.away_team_name_en || g.away_team_name || 'Auswärts';
    const homeScore = g.home_score ?? g.home_team_score;
    const awayScore = g.away_score ?? g.away_team_score;
    const scoreText = (homeScore == null || awayScore == null) ? 'VS' : `${homeScore} : ${awayScore}`;
    const when = new Date(g.local_date || Date.now()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    let label = 'Live';
    if (status === 'finished') label = 'Beendet';
    else if (status === 'notstarted') label = 'Anstoß';
    return { time: when, text: `${home} ${scoreText} ${away} — ${label}` };
}

async function fetchLive() {
    try {
        const res = await fetch(API_LINKS.GAMES_API);
        if (!res.ok) throw new Error('Fehler beim Laden');
        const data = await res.json();
        const games = data.games || [];

        // Prioritize live and recently finished matches
        const live = games.filter(g => String(g.time_elapsed ?? '').toLowerCase() !== 'notstarted');
        const upcoming = games.filter(g => String(g.time_elapsed ?? '').toLowerCase() === 'notstarted');

        const items = live.slice(0, 10).map(summarizeGame);
        if (items.length === 0) {
            // show next upcoming matches
            const next = upcoming.slice(0, 5).map(summarizeGame);
            renderItems(next);
        } else {
            renderItems(items);
        }
    }
    catch (e) {
        console.error('[liveticker] fetch error', e);
        if (ticker) ticker.innerHTML = '<p class="muted">Live‑Daten konnten nicht geladen werden.</p>';
    }
}

// initial load + poll
fetchLive();
setInterval(fetchLive, 15000);
