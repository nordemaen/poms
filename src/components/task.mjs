'use strict';

export class Task extends HTMLElement {
    #checkbox;
    taskTitle;
    #deleteButton;
    #style;
    done;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <li class="task">
                <input type="checkbox" id="taskCheckbox">
                <input type="text" id="taskTitle" placeholder="Task title">
                <button id="deleteButton">Delete</button>
            </li>
        `;

        const css = `
            #taskTitle {
                border: none;          /* Remove the border */
                background: none;      /* Remove the background color */
                outline: none;         /* Remove the focus outline */
                color: inherit; 
            }
        `;

        // Add the CSS to the Shadow DOM
        this.#style = document.createElement("style");
        this.#style.textContent = css;
        this.shadowRoot.appendChild(this.#style);

        this.#checkbox = this.shadowRoot.querySelector("#taskCheckbox");
        this.taskTitle = this.shadowRoot.querySelector("#taskTitle");
        this.#deleteButton = this.shadowRoot.querySelector("#deleteButton");

        this.#checkbox.addEventListener('change', () => { this.checkboxToggle() });
        this.#deleteButton.addEventListener('click', () => { this.delete() });

    }

    checkboxToggle() {
        if (this.#checkbox.checked) {
            this.taskTitle.style.textDecoration = "line-through";
            this.done = true;
        } else {
            this.taskTitle.style.textDecoration = "none";
            this.done = false;
        }
    }

    delete() {
        this.remove();
    }


}

customElements.define('task-component', Task);
