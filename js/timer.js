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
 * Handles a timer.
 */
export class Timer {

    /**
     * Constructor.
     */
    constructor() {
        this.clearTime = null;
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.secs = 0;
        this.mins = 0;
        this.gethours = 0;

        this.fulltime = document.getElementById("fulltime");

        this.btnContinue = document.getElementById("btn-continue");
        this.btnContinue.onclick = () => this.continueTime();

        this.btnPause = document.getElementById("btn-pause");
        this.btnPause.onclick = () => this.pauseTime();

        this. timerElem = document.getElementById("timer")
    }

    /**
     * Starts the timer watch interface.
     */
    startWatch() {
        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
        }

        this.mins = (this.minutes < 10) ? `0${this.minutes} :` : `${this.minutes} : `;
        /* check if minutes is equal to 60 and add a +1
          to hours set minutes to 0 */
        if (this.minutes === 60) {
            this.minutes = 0;
            this.hours++;
        }

        this.gethours = (this.hours < 10) ? `0${this.hours} : ` : `${this.hours} : `;
        this.secs = (this.seconds < 10) ? "0" + this.seconds : this.seconds;

        this.btnContinue.style.display = "none";
        this.btnPause.style.display = "inline-block";
        this.writeTime();
        this.seconds++;

        /* call the setTimeout( ) to keep the Count-Up alive ! */
        this.clearTime = setTimeout(() => this.startWatch(), 1000);
    }

    /**
     * Starts the timer.
     */
    startTime() {
        if (this.seconds === 0 && this.minutes === 0 && this.hours === 0) {
            this.fulltime.style.display = "none";
            this.startWatch();
        }
    }

    /**
     * Stops the timer.
     */
    stopTime() {

        if (this.seconds !== 0 || this.minutes !== 0 || this.hours !== 0) {

            this.btnContinue.style.display = "inline-block";
            this.fulltime.style.display = "inline-block";
            this.fulltime.style.color = "#ff4500";
            this.fulltime.innerHTML = "Time Recorded is " + this.gethours + this.mins + this.secs;

            this.seconds = 0;
            this.minutes = 0;
            this.hours = 0;
            this.secs = `0${this.seconds}`;
            this.mins = `0${this.minutes} : `;
            this.gethours = `0${this.hours} : `;

            this.writeTime();
            this.btnPause.style.display = "none";
            clearTimeout(this.clearTime);
        }
    }

    /**
     * Pauses the timer.
     */
    pauseTime() {
        if (this.seconds !== 0 || this.minutes !== 0 || this.hours !== 0) {
            this.writeTime();
            clearTimeout(this.clearTime);
            this.btnContinue.style.display = 'inline-block';
            this.btnPause.style.display = "none";
        }
    }

    /**
     * Continues the timer.
     */
    continueTime() {
        if (this.seconds !== 0 || this.minutes !== 0 || this.hours !== 0) {
            this.writeTime();
            clearTimeout(this.clearTime);
            this.clearTime = setTimeout(() => this.startWatch(), 1000);
            this.btnContinue.style.display = "none";
            this.btnPause.style.display = "inline-block";
        }
    }

    /**
     * Writes the timer info to the interface.
     */
    writeTime() {
        this.timerElem.innerHTML = `${this.gethours.toString()}${this.mins.toString()}${this.secs.toString()}`;
    }
}