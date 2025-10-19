"use strict";
/*
Copyright (c) 2025 Ronni Kahalani

X: https://x.com/RonniKahalani
Website: https://learningisliving.dk
LinkedIn: https://www.linkedin.com/in/kahalani/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Handles the main navigator tabs.
 */
export class TabHandler {

    /**
     * Constructor.
     */
    constructor() {
        this.tabs = ["home", "matrix", "quiz", "palace"];
    }

    /**
     * Shows a given navigator tab after hiding all the tabs.
     * @param id
     */
    showTab(id) {
        this.hideAllTabs();
        document.getElementById(id).style.display = 'block';
    }

    /**
     * Hides all navigator tabs.
     */
    hideAllTabs() {
        this.tabs.forEach(tab => document.getElementById(`tab-${tab}`).style.display = 'none');
    }

    /**
    * Sets up the tab events.
    */
    setupTabEvents() {
        this.tabs.forEach(name => document.getElementById(`btn-${name}`).onclick = () => this.showTab(`tab-${name}`));        
    }
}