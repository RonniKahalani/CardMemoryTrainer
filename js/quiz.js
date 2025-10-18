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
 * Handles the quiz and palace features.
 */
import {CardUtil} from "./card-util.js";
import {Timer} from "./timer.js";

/**
 * The quiz feature.
 */
export class Quiz {

    /**
     * Constructor.
     * @param matrix
     */
    constructor(matrix) {

        this.matrix = matrix;
        this.cardUtil = new CardUtil();
        this.answers = [];

        this.quizImage = document.getElementById("quiz-image");

        this.quizPerson = document.getElementById("quiz-select-person");
        this.quizPerson.onchange = () => this.quizPersonChange(this.quizPerson);
        this.quizPerson.onfocus = () => this.quizFocusChange(this.quizPerson);
        this.quizPerson.onblur = () => this.quizFocusChange(this.quizPerson);

        this.quizAction = document.getElementById("quiz-select-action");
        this.quizAction.onchange = () => this.quizActionChange(this.quizAction);
        this.quizAction.onfocus = () => this.quizFocusChange(this.quizAction);
        this.quizAction.onblur = () => this.quizFocusChange(this.quizAction);

        this.quizObject = document.getElementById("quiz-select-object");
        this.quizObject.onchange = () => this.quizObjectChange(this.quizObject);
        this.quizObject.onfocus = () => this.quizFocusChange(this.quizObject);
        this.quizObject.onblur = () => this.quizFocusChange(this.quizObject);

        this.quizCard = document.getElementById("quiz-select-card");
        this.quizCard.onchange = () => this.quizCardChange(this.quizCard);
        this.quizCard.onfocus = () => this.quizFocusChange(this.quizCard);
        this.quizCard.onblur = () => this.quizFocusChange(this.quizCard);

        this.quizRevealPerson = document.getElementById("quiz-reveal-person");
        this.quizRevealPerson.onchange = () => this.quizCheck(this.quizRevealPerson);
        this.quizRevealPerson.onfocus = () => this.quizFocusChange(this.quizRevealPerson);
        this.quizRevealPerson.onblur = () => this.quizFocusChange(this.quizRevealPerson);

        this.quizRevealAction = document.getElementById("quiz-reveal-action");
        this.quizRevealAction.onchange = () => this.quizCheck(this.quizRevealAction);
        this.quizRevealAction.onfocus = () => this.quizFocusChange(this.quizRevealAction);
        this.quizRevealAction.onblur = () => this.quizFocusChange(this.quizRevealAction);

        this.quizRevealObject = document.getElementById("quiz-reveal-object");
        this.quizRevealObject.onchange = () => this.quizCheck(this.quizRevealObject);
        this.quizRevealObject.onfocus = () => this.quizFocusChange(this.quizRevealObject);
        this.quizRevealObject.onblur = () => this.quizFocusChange(this.quizRevealObject);

        this.quizRevealCard = document.getElementById("quiz-reveal-card");
        this.quizRevealCard.onchange = () => this.quizCheck(this.quizRevealCard);
        this.quizRevealCard.onfocus = () => this.quizFocusChange(this.quizRevealCard);
        this.quizRevealCard.onblur = () => this.quizFocusChange(this.quizRevealCard);

        this.quizRevealAll = document.getElementById("quiz-reveal-all");
        this.quizRevealAll.onchange = () => this.checkRevealAll(this.quizRevealAll);
        this.quizRevealAll.onfocus = () => this.quizFocusChange(this.quizRevealAll);
        this.quizRevealAll.onblur = () => this.quizFocusChange(this.quizRevealAll);

        this.quizFeature = document.getElementById("quiz-feature");
        this.quizFront = document.getElementById("quiz-front");

        document.getElementById("quiz-start").onclick = () => this.startQuiz();
        document.getElementById("btn-quiz-next").onclick = () => this.nextQuizCard();
        document.getElementById("btn-quiz-prev").onclick = () => this.prevQuizCard();
        document.getElementById("btn-quiz-restart").onclick = () => this.restartQuiz();
        document.getElementById("btn-quiz-shuffle-deck").onclick = () => this.shuffleDeck();
        document.getElementById("btn-quiz-reveal").onclick = () => this.revealAll();
        document.getElementById("btn-prev-loci").onclick = () => this.prevLoci();
        document.getElementById("btn-reveal-loci-cards").onclick = () => this.revealLociCards();
        document.getElementById("btn-next-loci").onclick = () => this.nextLoci();

        this.cardCounter = document.getElementById("card-counter");
        this.currentQuiz = null;
        this.currentPalace = null;
        this.currentLociIndex = 1;

        this.timer = new Timer();
        this.load();
    }

    /**
     * Handles focus changes on quiz elements.
     * @param elem
     */
    quizFocusChange(elem) {
        if (elem === document.activeElement) {
            elem.style.border = "3px solid #00FF00";
        } else {
            elem.style.border = "3px solid black";
        }
    }

    /**
     * Loads and initializes the quiz.
     */
    load() {
        const ref = this;
        $.getJSON("../data/palace/default.json", function (json) {

            ref.currentQuiz = ref.loadQuiz();
            ref.currentPalace = json;
            ref.renderQuiz();
            ref.renderPalace(ref.currentPalace);
        });
    }

    /**
     * Load the quiz from its REST endpoint.
     * @returns {*[]}
     */
    loadQuiz() {
        this.quizCards = [];
        this.matrix.SUITS.forEach(suit => {
            const cards = this.matrix.currentMatrix[suit].forEach(card => {
                this.quizCards[this.quizCards.length] = {suit: suit, name: card.name, value: card.value};
            });
        });
    }

    /**
     * Renders the quiz interface.
     */
    renderQuiz() {

        for (let i = 0; i < this.quizCards.length; i++) {
            let card = this.quizCards[i];
            let paoIndex = card.suit.toLowerCase();
            let paoItem = this.matrix.currentMatrix[paoIndex];
            card.pao = paoItem[card.value - 1];
        }

        let persons = this.quizCards.map(x => x.pao.person).sort();
        let actions = this.quizCards.map(x => this.cardUtil.properCase(x.pao.action)).sort();
        let objects = this.quizCards.map(x => this.cardUtil.properCase(x.pao.object)).sort();
        let cards = this.quizCards.map(x => `${x.value} (${x.name}) of ${x.suit}`).sort(this.cardNameSorter);

        this.setQuizSelectOptions(this.quizPerson, persons);
        this.setQuizSelectOptions(this.quizAction, actions);
        this.setQuizSelectOptions(this.quizObject, objects);
        this.setQuizSelectOptions(this.quizCard, cards);
    }

    /**
     * Starts the quiz.
     */
    startQuiz() {
        this.currentQuizIndex = -1;
        this.timer.stopTime();
        this.quizFeature.style.display = "block";
        this.quizFront.style.display = "none";
        this.nextQuizCard();
        this.timer.startWatch();

        this.notify("toast-quiz-start");
    }

    /**
     * Restarts the quiz.
     */
    restartQuiz() {
        this.startQuiz();
    }

    /**
     * Comparator function used for sorting cards.
     * Ex.
     * a = "5 (Five) of Spades"
     * b = "13 (King) of Hearts"
     * @param a
     * @param b
     * @returns if (a < b) = -1, (a > b) = 1 else (a === b) = 0
     */
    cardNameSorter(a, b) {
        let as = a.split(" ");
        let bs = b.split(" ");
        let x = parseInt(as[0]);
        let y = parseInt(bs[0]);
        if (x < y) return -1;  // any negative number works
        if (x > y) return 1;   // any positive number works
        return (as[3] < bs[3]) ? -1 : 1; // equal values MUST yield zero
    }

    /**
     * Set options to a given select element.
     * @param elem
     * @param values
     */
    setQuizSelectOptions(elem, values) {
        for (let i = 0; i < 52; i++) {
            let opt = document.createElement('option');
            opt.value = values[i];
            opt.innerHTML = opt.value;
            elem.appendChild(opt);
        }
    }

    /**
     * Handles a selection in the person select.
     * @param select
     */
    quizPersonChange(select) {
        let selectValue = select.options[select.selectedIndex].value;
        let correctValue = this.quizCards[this.currentQuizIndex].pao.person;

        this.setSelectColor(select, selectValue.toLowerCase() === correctValue.toLowerCase());
        this.updateAnswerValues();
    }

    /**
     * Handles a selection in the action select.
     * @param select
     */
    quizActionChange(select) {
        let selectValue = select.options[select.selectedIndex].value;
        let correctValue = this.quizCards[this.currentQuizIndex].pao.action;

        this.setSelectColor(select, selectValue.toLowerCase() === correctValue.toLowerCase());
        this.updateAnswerValues();
    }

    /**
     * Handles a selection in the object select.
     * @param select
     */
    quizObjectChange(select) {
        let selectValue = select.options[select.selectedIndex].value;
        let correctValue = this.quizCards[this.currentQuizIndex].pao.object;

        this.setSelectColor(select, selectValue.toLowerCase() === correctValue.toLowerCase());
        this.updateAnswerValues();
    }

    /**
     * Handles a selection in the card select.
     * @param select
     */
    quizCardChange(select) {
        let selectValue = select.options[select.selectedIndex].value;

        const correctCard = this.quizCards[this.currentQuizIndex];
        let correctValue = `${correctCard.value} (${correctCard.name}) of ${correctCard.suit}`;

        this.setSelectColor(select, selectValue.toLowerCase() === correctValue.toLowerCase());
        this.updateAnswerValues();
    }

    /**
     * Updates the current select values into the current answer.
     */
    updateAnswerValues() {
        this.updateCurrentAnswer();
        if (this.isAllAnswersCorrect()) {
            this.notifyAllAnswersCorrect();
        } else if (this.isCurrentAnswerCorrect()) {
            this.notifyCurrentAnswerCorrect();
        }
    }

    /**
     * Sets a select background color based on if it is a correct value, wrong value or the first neutral entry.
     * @param select
     * @param isCorrect
     */
    setSelectColor(select, isCorrect) {
        if (select.selectedIndex === 0) {
            select.classList.remove("quiz-select-wrong", "quiz-select-correct");
            select.classList.add("quiz-select-neutral");
            return;
        }

        if (isCorrect) {
            select.classList.remove("quiz-select-neutral", "quiz-select-wrong");
            select.classList.add("quiz-select-correct");
            console.log("CORRECT")
        } else {
            select.classList.remove("quiz-select-neutral", "quiz-select-correct");
            select.classList.add("quiz-select-wrong");
            console.log("WRONG")
        }
    }

    /**
     * Returns true if all quiz select values are correct.
     * @returns {boolean}
     */
    updateCurrentAnswer() {

        const answer = {};
        answer.person = {
            "correct": this.quizPerson.classList.contains("quiz-select-correct"),
            "index": this.quizPerson.selectedIndex
        };
        answer.action = {
            "correct": this.quizAction.classList.contains("quiz-select-correct"),
            "index": this.quizAction.selectedIndex
        };
        answer.object = {
            "correct": this.quizObject.classList.contains("quiz-select-correct"),
            "index": this.quizObject.selectedIndex
        };
        answer.card = {
            "correct": this.quizCard.classList.contains("quiz-select-correct"),
            "index": this.quizCard.selectedIndex
        };
        answer.correct = answer.person.correct && answer.action.correct && answer.object.correct && answer.card.correct;

        this.answers[this.currentQuizIndex] = answer;
    }

    /**
     * Returns true if all quiz select values are correct.
     * @returns {boolean}
     */
    isCurrentAnswerCorrect() {
        const answer = this.answers[this.currentQuizIndex];
        if (answer !== undefined) {

            return this.answers[this.currentQuizIndex].correct;
        }
        return false;
    }

    /**
     * Checks if all quiz answers are correct.
     * @returns {boolean}
     */
    isAllAnswersCorrect() {

        for (let entry of this.answers) {
            if (!entry.correct) return false;
        }

        return true;
    }

    /**
     * Notifies current quiz answer is correct.
     */
    notifyCurrentAnswerCorrect() {
        this.notify("toast-current-answer-correct");
    }

    /**
     * Notifies all quiz answers are correct.
     */
    notifyAllAnswersCorrect() {
        this.notify("toast-all-answers-correct");
    }

    /**
     * Notifies a specific message.
     * @param id
     */
    notify(id) {
        $("#" + id).toast("show");
    }

    /**
     * Updates the current quiz select values.
     */
    updateSelectValues() {

        const answer = this.answers[this.currentQuizIndex];
        if (answer !== undefined) {

            this.quizPerson.selectedIndex = answer.person.index;
            this.quizPersonChange(this.quizPerson);

            this.quizAction.selectedIndex = answer.action.index;
            this.quizActionChange(this.quizAction);

            this.quizObject.selectedIndex = answer.object.index;
            this.quizObjectChange(this.quizObject);

            this.quizCard.selectedIndex = answer.card.index;
            this.quizCardChange(this.quizCard);

        } else {
            this.clearSelects();
        }
    }

    /**
     * Navigates to the previous quiz card.
     */
    prevQuizCard() {
        this.currentQuizIndex = this.currentQuizIndex > 0 ? this.currentQuizIndex - 1 : 51;
        this.quizImage.src = this.quizCards[this.currentQuizIndex].pao.image;
        this.updateQuiz();
    }

    /**
     * Navigates to the next quiz card.
     */
    nextQuizCard() {
        this.currentQuizIndex = this.currentQuizIndex < 51 ? this.currentQuizIndex + 1 : 0;
        this.quizImage.src = this.quizCards[this.currentQuizIndex].pao.image;
        this.updateQuiz();
    }

    updateQuiz() {
        this.cardCounter.innerHTML = (this.currentQuizIndex + 1).toString();
        this.updateSelectValues();
        this.autoReveal();
        this.checkQuizDone();
    }

    checkQuizDone() {
        if (this.isQuizDone()) {
            this.notify("toast-quiz-done");
        }
    }

    /**
     * Returns true if the quiz is done.
     * TODO: Should instead validate that all cards has been answered correctly.
     * @returns {boolean}
     */
    isQuizDone() {
        if (this.answers.length < 18) {
            return false;
        }

        return this.answers.every(v => v.correct === true);
    }

    /**
     * Checks to see which selects should be revealed automatically.
     */
    autoReveal() {
        if (this.quizRevealPerson.checked) this.revealPerson();
        if (this.quizRevealAction.checked) this.revealAction();
        if (this.quizRevealObject.checked) this.revealObject();
        if (this.quizRevealCard.checked) this.revealCard();
    }

    /**
     * Toggles checking all the select checkboxes.
     * @param elem
     */
    checkRevealAll(elem) {
        this.quizRevealPerson.checked = elem.checked;
        this.quizRevealAction.checked = elem.checked;
        this.quizRevealObject.checked = elem.checked;
        this.quizRevealCard.checked = elem.checked;
        if (elem.checked) {
            this.autoReveal();
        } else {
            this.clearSelects();
        }
    }

    /**
     * Reveals al the selects.
     */
    revealAll() {
        this.revealPerson();
        this.revealAction();
        this.revealObject();
        this.revealCard();
    }

    /**
     * Handles a single select reveal checkbox.
     * @param elem
     */
    quizCheck(elem) {
        let item = null;
        let reveal = null;

        switch (elem) {
            case this.quizRevealPerson:
                item = this.quizPerson;
                reveal = this.revealPerson;
                break;
            case this.quizRevealAction:
                item = this.quizAction;
                reveal = this.revealAction;
                break;
            case this.quizRevealObject:
                item = this.quizObject;
                reveal = this.revealObject;
                break;
            case this.quizRevealCard:
                item = this.quizCard;
                reveal = this.revealCard;
                break;
        }

        if (elem.checked && reveal !== null) {
            reveal(this);
        } else {
            this.clearSelect(item);
        }
    }

    /**
     * Reveals the person select value.
     */
    revealPerson(target) {
        if (target === undefined) {
            target = this;
        }
        let card = target.quizCards[target.currentQuizIndex];
        let correctValue = card.pao.person;
        for (let index = 1; index < target.quizPerson.options.length; index++) {
            if (target.quizPerson.options[index].value.toLowerCase() === correctValue.toLowerCase()) {
                target.quizPerson.selectedIndex = index;
                target.setSelectColor(target.quizPerson, true);
                break;
            }
        }
    }

    /**
     * Reveals the action select value.
     */
    revealAction(target) {
        if (target === undefined) {
            target = this;
        }
        let card = target.quizCards[target.currentQuizIndex];
        let correctValue = card.pao.action;
        for (let index = 1; index < target.quizPerson.options.length; index++) {
            if (target.quizAction.options[index].value.toLowerCase() === correctValue.toLowerCase()) {
                target.quizAction.selectedIndex = index;
                target.setSelectColor(target.quizAction, true);
                break;
            }
        }
    }

    /**
     * Reveals the object select value.
     */
    revealObject(target) {
        if (target === undefined) {
            target = this;
        }
        let card = target.quizCards[target.currentQuizIndex];
        let correctValue = card.pao.object;
        for (let index = 1; index < target.quizPerson.options.length; index++) {
            if (target.quizObject.options[index].value.toLowerCase() === correctValue.toLowerCase()) {
                target.quizObject.selectedIndex = index;
                target.setSelectColor(target.quizObject, true);
                break;
            }
        }
    }

    /**
     * Reveals the card select value.
     */
    revealCard(target) {
        if (target === undefined) {
            target = this;
        }
        let card = target.quizCards[target.currentQuizIndex];
        let correctValue = `${card.value} (${card.name}) of ${card.suit}`;
        for (let index = 1; index < target.quizCard.options.length; index++) {
            if (target.quizCard.options[index].value.toLowerCase() === correctValue.toLowerCase()) {
                target.quizCard.selectedIndex = index;
                target.setSelectColor(target.quizCard, true);
                break;
            }
        }
    }

    /**
     * Clears/resets all the selects.
     */
    clearSelects() {
        this.clearSelect(this.quizPerson);
        this.clearSelect(this.quizAction);
        this.clearSelect(this.quizObject);
        this.clearSelect(this.quizCard);
    }

    /**
     * Clears/resets a single select.
     * @param elem
     */
    clearSelect(elem) {
        elem.selectedIndex = 0;
        elem.classList.remove("quiz-select-wrong", "quiz-select-correct");
        elem.classList.add("quiz-select-neutral");
    }

    /**
     * Shuffles the quiz card deck and updates the palace.
     */
    shuffleDeck() {
        this.shuffle(this.quizCards);
        this.renderPalace(this.currentPalace);
        this.restartQuiz();
    }

    /**
     * Shuffles a card deck.
     * @param deck
     */
    shuffle(deck) {
        let currentIndex = deck.length;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [deck[currentIndex], deck[randomIndex]] = [
                deck[randomIndex], deck[currentIndex]];
        }
    }

    /**
     * Hides all palace loci.
     */
    hideAllLoci() {
        for (let index = 1; index < 19; index++) {
            document.getElementById("palace-loci-" + index).style.display = "none";
        }
    }

    /**
     * Sets background image of an element by its id.
     * @param id
     * @param imageUrl
     */
    setBackgroundImage(id, imageUrl) {
        document.getElementById(id).style.backgroundImage = `url('${imageUrl}')`;
    }

    /**
     * Sets inner HTML of an element by its id.
     * @param id
     * @param html
     */
    setInnerHTML(id, html) {
        document.getElementById(id).innerHTML = html;
    }

    /**
     * Renders the palace interface.
     * @param palace
     */
    renderPalace(palace) {

        this.hideAllLoci();

        this.currentLociIndex = 1;
        document.getElementById("palace-loci-" + this.currentLociIndex).style.display = "block";

        for (let i = 0; i < 52; i++) {
            let index = i + 1;
            let currentPalaceEntry = palace[i];

            try {
                this.setInnerHTML(`palace-label-${index}`, `${currentPalaceEntry.label} (${index} of 17)`);
                this.setBackgroundImage(`palace-image-${index}`, currentPalaceEntry.image);
                this.setInnerHTML(`palace-info-${index}`, currentPalaceEntry.info);
            } catch (e) {
                // HACK! console.log("Weird things happened after the 6th item");
            }

            const svgUrl = this.cardUtil.getSVGCardImageUrl(this.quizCards[i].pao);
            this.setInnerHTML(`palace-item-${index}`, `<img src="${svgUrl}" class="card" alt="">`);

            if (i > 0 && (i + 1) % 3 === 0) {
                const id = (i + 1) / 3;
                const quizPerson = this.quizCards[i - 2].pao.person;
                const action = this.quizCards[i - 1].pao.action;
                const quizAction = this.cardUtil.lowerCaseFirstLetter(action);
                const quizObject = this.quizCards[i].pao.object;

                // Set a 3 colored phrase.
                this.setInnerHTML(`palace-phrase-${id}`, `<span class="phrase-color1">${quizPerson}</span> <span class="phrase-color2">${quizAction}</span> <span class="phrase-color3">${quizObject}</span>`);
            }

            if (i === 51) {
                this.setInnerHTML("palace-phrase-18", this.quizCards[i].pao.person);
            }
        }
    }

    /**
     * Navigates to the previous palace loci.
     */
    prevLoci() {
        this.hideLoci(this.currentLociIndex);
        this.currentLociIndex = (this.currentLociIndex === 1) ? 18 : this.currentLociIndex - 1;
        this.showLoci(this.currentLociIndex);
    }

    /**
     * Navigates to the next palace loci.
     */
    nextLoci() {
        this.hideLoci(this.currentLociIndex);
        this.currentLociIndex = (this.currentLociIndex === 18) ? 1 : this.currentLociIndex + 1;
        this.showLoci(this.currentLociIndex);
    }

    /**
     * Set the visibility of a palace loci based on its index.
     * @param index
     * @param visible
     */
    setLoci(index, visible) {
        document.getElementById("palace-loci-" + index).style.display = visible ? "block" : "none";
    }

    /**
     * Hides a given loci.
     * @param index
     */
    hideLoci(index) {
        this.setLoci(index, false);
    }

    /**
     * Shows a given loci.
     * @param index
     */
    showLoci(index) {
        this.setLoci(index, true);
    }

    /**
     * Toggles the visibility of the current loci cards.
     */
    revealLociCards() {
        const elem = document.getElementById("palace-image-" + this.currentLociIndex);
        const items = elem.getElementsByClassName("palace-items")[0];
        items.style.display = (items.style.display === "block") ? "none" : "block";
    }
}