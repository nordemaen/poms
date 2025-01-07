'use strict';

import { Task } from "./task.mjs";

export class TaskList extends HTMLElement {
    #taskList;
    #newTaskButton;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <div>
            <button id="newTaskButton">Add task</button>
            <ol id="taskList">
            </ol>
        </div>
        `;
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
