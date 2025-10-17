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
 * Card utility class.
 */
export class CardUtil {

    /**
     * Returns a card image in SVG format.
     * @param card
     * @returns {string}
     */
    getSVGCardImageUrl(card) {
        let cardId = (card.value > 1 && card.value < 11) ? card.value + "" : card.name;
        const suit = card.id.split("-")[0]; // hearts, diamonds, clubs, spades
        return "svg/cards/" + cardId.toLowerCase() + "_of_" + suit.toLowerCase() + ".svg";
    }

    /**
     * Counts capital letters in a string using regex.
     * @param str
     * @returns {number}
     */
    countCapitalLetters(str) {
        const matches = str.match(/[A-Z]/g); // 'g' flag for global match
        return matches ? matches.length : 0;
    }

    /**
     * Upper cases the first letter of a string.
     * @param str
     * @returns {string}
     */
    upperCaseFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Lower cases the first letter of a string.
     * @param str
     * @returns {string}
     */
    lowerCaseFirstLetter(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    properCase(str) {
        const capitalLetters = this.countCapitalLetters(str);
        if(str.charAt(1) === str.charAt(1).toUpperCase() && capitalLetters > 0) {
            return str; // Already proper cased
        }
        return this.upperCaseFirstLetter(str);
    }
}