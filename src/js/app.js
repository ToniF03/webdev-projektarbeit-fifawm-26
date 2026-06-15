/*
* Created on: 2026-06-15
* Author(s): Toni Fey, Finn Konrad, Tim Zingler
* License: MIT
* Description: Description
*/

async function fetchCurrentGamesData (url){
    try {
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Server Error. [CODE:${response.status}]`);
        }
        const data = await response.json();
        return data;
    }
    catch (msg){
        console.error(msg);
    }
}
fetchData('URL_PLACEHOLDER');

function dispatchCustomEvent(name){
    window.dispatchEvent(new CustomEvent(name));
}
dispatchCustomEvent('EVENT_PLACEHOLDER');

