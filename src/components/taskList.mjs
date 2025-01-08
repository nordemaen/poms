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

        #newTaskButton {
    background-color: #f0f1ff;
    color: #5664f5;
    font-weight: bold;
    border: none;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

     #newTaskButton:hover {
    background-color: #e6e7ff;
    box-shadow: 0 0.375rem 0.75rem rgba(0, 0, 0, 0.1);
  }

     #newTaskButton:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(86, 100, 245, 0.2);
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
