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
        <input type="text" id="taskTitle" placeholder="Type your task...">
        <button id="deleteButton" class="actionButton">✕</button>
        <button id="editButton" class="actionButton">⋮</button>
    </li>
`;

        const css = `
   

.task {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F0F1FF;
    padding: 1rem 1.25rem; 
    border-radius: 0 1rem 1rem 0; 
    margin-bottom: 1.2rem;
    box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.05);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    border-left: 4px solid #5664f5; 
}

.task:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.1);
}

#taskCheckbox {
    accent-color: #5664F5;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.875rem;
    cursor: pointer;
}

#taskTitle {
    flex-grow: 1;
    border: none;
    background: none;
    outline: none;
    color: #5664F5;
    font-size: 1.125rem;
    padding: 0.375rem 0;
    font-weight: 500;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

#taskTitle::placeholder {
    color: #A3A6FF;
}

#taskTitle:focus {
    background-color: #E0E3FF;
    box-shadow: 0 0 0 0.125rem #5664F5;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

.actionButton {
    background: none;
    border: none;
    color: #5664F5;
    font-size: 1.125rem;
    padding: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.actionButton:hover {
    color: #3B48D9;
}

.actionButton:active {
    background-color: #D0D4FF;
    color: #2A37A8;
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
