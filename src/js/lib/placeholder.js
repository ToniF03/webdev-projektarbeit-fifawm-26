/*
* Created on: 2026-05-23
* Author(s): Author
* License: MIT
* Description: Description
*/

export class Template {

    #privateMember;

    constructor(parameter = 42) {
        this.#privateMember = parameter;
    }

    static staticMethod (){
        console.log('42');
    }
    #privateMethod (){
        console.log(this.#privateMember);
    }
    publicMethod (){
        this.#privateMethod();
    }
}

document.addEventListener('click', () => {
    console.log('Event triggered.');
})

async function fetchData (url){
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

