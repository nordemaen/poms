'use strict';

export class Timer extends HTMLElement {
  #elapsed = 0;
  #intervalId;
  #isPaused = false;
  #timerDisplay; 
  #startButton;
  #stopButton;
  #pauseButton;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div>
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <button id="pause">Pause</button>
        <p id="timer">0</p>
      </div>
    `;

    this.#timerDisplay = this.shadowRoot.querySelector('#timer');
    this.#startButton = this.shadowRoot.querySelector('#start');
    this.#stopButton = this.shadowRoot.querySelector('#stop');
    this.#pauseButton = this.shadowRoot.querySelector('#pause');

    this.#startButton.addEventListener('click', () => this.start());
    this.#stopButton.addEventListener('click', () => this.stop());
    this.#pauseButton.addEventListener('click', () => this.pause());
  }

  start() {
    if (this.#intervalId) return;

    this.#intervalId = setInterval(() => {
      if (!this.#isPaused) {
        this.#elapsed++;
        this.#updateDisplay();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#elapsed = 0;
    this.#updateDisplay();
    this.#isPaused = false;
  }

  pause() {
    this.#pauseButton.textContent = this.#isPaused ?  'Pause' : 'Resume';
    
    if (this.#intervalId) {
      this.#isPaused = !this.#isPaused;
    }
  }

  #updateDisplay() {
    this.#timerDisplay.textContent = this.#elapsed;
  }
}

customElements.define('timer-component', Timer);