'use strict';

/** ms in one minute*/
const MINUTE = 60_000;

export class Timer extends HTMLElement {
  #timerSVG;
  #timerDisplay;
  #controls;
  #durationInput;
  #durationOptions;

  // ms
  #time = 25 * MINUTE;
  #maxTime = 25 * MINUTE;

  #previousTimestamp;
  #animationId;

  async connectedCallback() {
    const response = await fetch(import.meta.resolve('./Timer.html'))
    this.innerHTML = await response.text();

    this.#timerSVG = this.querySelector('#timer');
    this.#timerDisplay = this.#timerSVG.querySelector('text');
    this.#controls = this.querySelector('fieldset');
    this.#durationInput = this.querySelector('#durationInput');
    this.#durationOptions = this.querySelector('#durationOptions');

    this.#controls.querySelectorAll('input').forEach(input => input.addEventListener('change', this.#handleStateChange.bind(this)));

    const handleOptionChange = () => {
      this.state = "reset";
    };
    this.#durationInput.addEventListener('change', handleOptionChange);
    this.#durationOptions.addEventListener('change', handleOptionChange);

    // Start animating the timer.
    this.#previousTimestamp = performance.now();
    this.#animationId = requestAnimationFrame(this.#animationFrame.bind(this));
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.#animationId);
  }

  // Update timer whenever `state` changes
  #handleStateChange() {
    if (this.state === 'reset') {
      this.#time = this.#selectedTime;
      this.#maxTime = this.#selectedTime;
    }
  }

  #animationFrame(timestamp) {
    const elapsed = timestamp - this.#previousTimestamp;
    this.#previousTimestamp = timestamp;

    if (this.state === 'play') {
      if (this.#time <= 0) {
        this.state = 'reset';
        return;
      }

      this.#time -= elapsed;
    }

    this.#timerSVG.style.setProperty('--delay', `-${this.#time / this.#maxTime}s`);
    this.#timerDisplay.textContent = `${this.minutes.padStart(2, '0')}:${this.seconds.padStart(2, '0')}`;

    this.#animationId = requestAnimationFrame(this.#animationFrame.bind(this));
  }

  get minutes() {
    return (~~(this.#time / MINUTE)).toString()
  }

  get seconds() {
    return (~~(this.#time % MINUTE / 1_000)).toString()
  }

  get #selectedTime() {
    if (this.#durationOptions.value === 'custom')
      return this.#customTime * MINUTE
    else
      return parseInt(this.#durationOptions.value) * MINUTE
  }

  get #customTime() {
    const time = parseInt(this.#durationInput.value);
    if (time < 1) {
      alert('Please return a valid duration');
      return NaN;
    }
    return time;
  }

  get state() {
    return this.#controls.querySelector('input:checked').id;
  }

  set state(state) {
    this.#controls.querySelector(`#${state}`).checked = true;
    this.#handleStateChange();
  }
}

customElements.define('timer-component', Timer);