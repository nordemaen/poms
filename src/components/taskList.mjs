'use strict';

import { Task } from "./task.mjs";

export class TaskList extends HTMLElement {
    #taskList;
    #newTaskButton;
    #style;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <h1>Task List</h1>
        <div>
            <button id="newTaskButton">Add task</button>
            <ol id="taskList">
            </ol>
        </div>
        `;

        const css = `
        h1 {
            position: relative;
            display: inline-block;
            font-size: 24px;
        }
        h1::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -5px;
            width: 20px;
            height: 3px;
            background-color: #5664f5;
        }
        `;

        this.#style = document.createElement("style");
        this.#style.textContent = css;
        this.shadowRoot.appendChild(this.#style);
        this.#taskList = this.shadowRoot.querySelector("#taskList");
        this.#newTaskButton = this.shadowRoot.querySelector("#newTaskButton");

        this.appendNewTask();

        this.#newTaskButton.addEventListener("click", () => {
            this.appendNewTask();
        });

    }

    appendNewTask() {
        let task = new Task();
        this.#taskList.append(task);
    }


}

customElements.define('task-list-component', TaskList);
