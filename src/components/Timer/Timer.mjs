import { notificationDisplay, playSound } from '../utils.mjs';

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
    #isBreak = false;

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

        this.#previousTimestamp = performance.now();
        this.#animationId = requestAnimationFrame(this.#animationFrame.bind(this));
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.#animationId);
    }

    #handleStateChange() {
        if (this.state === 'reset') {
            this.#time = this.#selectedTime;
            this.#maxTime = this.#selectedTime;
        } else if (this.state === 'play') {
            playSound('../../start.mp3');
            this.#previousTimestamp = performance.now();
            this.#animationId = requestAnimationFrame(this.#animationFrame.bind(this));
        }
    }

    #animationFrame(timestamp) {
        const elapsed = timestamp - this.#previousTimestamp;
        this.#previousTimestamp = timestamp;

        if (this.state === 'play') {
            if (this.#time <= 0) {
                this.#handleBreakStateChange();
                notificationDisplay('Pomodoro Timer', 'Time to take a break!');
                return;
            }
            this.#time -= elapsed;
        }

        this.#updateDisplay();
        this.#animationId = requestAnimationFrame(this.#animationFrame.bind(this));
    }

    #handleBreakStateChange() {
        this.#isBreak = !this.#isBreak;
        this.#time = this.#isBreak ? this.#maxTime / 5 : this.#selectedTime;
        this.#maxTime = this.#time;
        this.state = 'pause';
        this.#updateDisplay();
    }

    #updateDisplay() {
        const formattedTime = `${String(this.minutes).padStart(2, '0')}:${String(this.seconds).padStart(2, '0')}`;
        this.#timerSVG.style.setProperty('--delay', `-${this.#time / this.#maxTime}s`);
        this.#timerDisplay.textContent = formattedTime;
        document.title = `${formattedTime} - Pom's Pomodoro`;
    }

    get minutes() {
        return (~~(this.#time / MINUTE)).toString()
    }

    get seconds() {
        return (~~(this.#time % MINUTE / 1_000)).toString()
    }

    get #selectedTime() {
        if (this.#durationOptions.value === 'custom') {
            return this.#customTime * MINUTE
        }
        else {
            return parseInt(this.#durationOptions.value) * MINUTE
        }
    }

    get #customTime() {
        const time = parseInt(this.#durationInput.value);
        if ((isNaN(time)) || time < 1) {
            return 25; // just return it if not valid
        }
        return time;
    }

    get state() {
        if (this.#controls) {
            const checkedInput = this.#controls.querySelector('input:checked');
            if (checkedInput) {
                return checkedInput.id;
            }
        }
        return null;
    }

    set state(state) {
        if (this.#controls) {
            const targetInput = this.#controls.querySelector(`#${state}`);
            if (targetInput) {
                targetInput.checked = true;
            }
        }
        this.#handleStateChange();
    }
}

customElements.define('timer-component', Timer);