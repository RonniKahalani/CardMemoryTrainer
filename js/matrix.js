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
 * Handles the matrix feature.
 */
import { Quiz } from "./quiz.js";
import {CardUtil} from "./card-util.js";

/**
 * The matrix feature.
 */
export class Matrix {

    /**
     * Constructor.
     */
    constructor() {
        this.MATRIX_DATA_PATH = "../data/matrix/default.json";
        this.SUITS = ["hearts", "spades", "diamonds", "clubs"];

        this.cardUtil = new CardUtil();
        this.load()
    }

    /**
     * Loads and renders the matrix.
     */
    load() {
        const ref = this;
        $.getJSON(this.MATRIX_DATA_PATH, function (json) {
            this.quiz = new Quiz(ref);
            ref.currentMatrix = json;
            ref.renderMatrix();
        }).fail(function (jqxhr, textStatus, error) {
            const err = `An error occured while reading matrix data:\n${ref.MATRIX_DATA_PATH} (${error})`;
            console.error(err);
            alert(err);
        });
    }

    /**
     * Opens the card info display.
     * @param card
     */
    openCardInfo(card) {
        const elem = document.getElementById('card-info');
        elem.onclick = () => elem.style.display = 'none';
        elem.getElementsByClassName("pao-info-person")[0].innerHTML = card.person;
        elem.getElementsByClassName("pao-info-action")[0].innerHTML = card.action;
        elem.getElementsByClassName("pao-info-object")[0].innerHTML = (this.cardUtil.countCapitalLetters(card.object)) ? card.object : this.cardUtil.upperCaseFirstLetter(card.object);
        elem.getElementsByClassName("pao-info-card")[0].src = this.cardUtil.getSVGCardImageUrl(card)
        elem.getElementsByClassName("pao-info-image")[0].src = card.image;
        elem.getElementsByClassName("pao-info-description")[0].innerHTML = card.description;
        elem.style.display = 'block';
    }

    /**
     * Toggles the card info display.
     * @param card
     */
    toggleCardInfo(card) {
        const elem = document.getElementById('card-info');
        if (elem.style.display === 'none' || elem.style.display === '') {
            this.openCardInfo(card);
        } else {
            elem.style.display = 'none';
        }
    }

    /**
     * Renders the matrix interface.
     */
    renderMatrix() {

        const suits = this.SUITS;
        for (let rowIndex = 0; rowIndex < suits.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 13; columnIndex++) {

                const suit = suits[rowIndex];
                let card = this.currentMatrix[suit][columnIndex];
                let elem = document.getElementById(suit + "-" + (columnIndex + 1));
                elem.getElementsByClassName("pao-person")[0].innerHTML = card.person;
                elem.getElementsByClassName("pao-action")[0].innerHTML = card.action;
                elem.getElementsByClassName("pao-object")[0].innerHTML = card.object;

                let image = elem.getElementsByClassName("pao-image")[0];
                image.src = card.image;
                image.onmouseover = () => image.src = this.cardUtil.getSVGCardImageUrl(card);
                image.onmouseout = () => image.src = card.image;
                image.onclick = () => this.openCardInfo(card);
            }
        }
    }
}