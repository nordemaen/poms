'use strict';

export class Timer extends HTMLElement {
  #intervalId;
  #isPaused = false;
  #timerSVG;
  #timerDisplay;
  #startButton;
  #stopButton;
  #pauseButton;
  #durationInput;
  #durationOptions;
  #selectedDuration;
  #remainingTime;

  async connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const response = await fetch(import.meta.resolve('./Timer.html')).then()
    this.shadowRoot.innerHTML = await response.text();

    this.#timerSVG = this.shadowRoot.querySelector('#timer');
    this.#timerDisplay = this.#timerSVG.querySelector('text');
    this.#startButton = this.shadowRoot.querySelector('#start');
    this.#stopButton = this.shadowRoot.querySelector('#stop');
    this.#pauseButton = this.shadowRoot.querySelector('#pause');
    this.#durationInput = this.shadowRoot.querySelector('#durationInput');
    this.#durationOptions = this.shadowRoot.querySelector('#durationOptions');

    this.#durationOptions.addEventListener('change', () => this.handleDurationChange());

    this.#startButton.addEventListener('click', () => this.start());
    this.#stopButton.addEventListener('click', () => this.stop());
    this.#pauseButton.addEventListener('click', () => this.pause());
    this.#selectedDuration = 25;
  }

  handleDurationChange() {
    const selectedOption = this.#durationOptions.value;

    if (selectedOption === 'custom') {
      this.#durationInput.style.display = 'block';
    } else {
      this.#durationInput.style.display = 'none';
      this.#selectedDuration = parseInt(selectedOption);
    }
  }

  start() {
    if (this.#intervalId) return;

    if (this.#durationOptions.value === 'custom') {
      this.#selectedDuration = parseInt(this.#durationInput.value);
      if (isNaN(this.#selectedDuration) || this.#selectedDuration < 1) {
        alert('Please enter a valid duration (positive integer).');
        return;
      }
    }

    this.#remainingTime = this.#selectedDuration * 60;

    let intervalCallback = () => {
      if (!this.#isPaused) {
        if (this.#remainingTime > 0) {
          this.#remainingTime--;
          this.#updateDisplay();
        } else {
          this.stop();
        }
      }
    };

    intervalCallback();
    this.#intervalId = setInterval(intervalCallback, 1000);
  }

  stop() {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#remainingTime = this.#selectedDuration * 60;
    this.#updateDisplay();
    this.#isPaused = false;
  }

  pause() {
    this.#pauseButton.textContent = this.#isPaused ? 'Pause' : 'Resume';

    if (this.#intervalId) {
      this.#isPaused = !this.#isPaused;
    }
  }

  #updateDisplay() {
    const minutes = Math.floor(this.#remainingTime / 60);
    const seconds = this.#remainingTime % 60;
    this.#timerSVG.style.setProperty('--delay', `-${this.#remainingTime / (this.#selectedDuration * 60)}s`)
    this.#timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

customElements.define('timer-component', Timer);