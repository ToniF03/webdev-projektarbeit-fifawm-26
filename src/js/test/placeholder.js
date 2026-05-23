/*
* Created on: 2026-05-23
* Author(s): Author
* License: MIT
* Description: Description
*/

import { describe, beforeEach, afterEach, test, expect } from 'vitest';

describe('Test group', () => {

    let value = 42;

    beforeEach(() => {
        console.log('Runs before each test().');
    })
    afterEach(() => {
        console.log('Runs after each test().');
    })

    test('Test case', () => {
        expect(value).toBe(42);
    })
})

