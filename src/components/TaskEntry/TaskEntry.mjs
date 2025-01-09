export default class TaskEntry extends HTMLLIElement {
  #checkbox;
  taskTitle;
  #deleteButton;
  done;

  async connectedCallback() {
    const response = await fetch(import.meta.resolve('./TaskEntry.html'))
    this.innerHTML = await response.text();

    this.#checkbox = this.querySelector("input[type=checkbox]");
    this.taskTitle = this.querySelector("input[type=text]");
    this.#deleteButton = this.querySelector("#deleteButton");

    this.#deleteButton.addEventListener('click', () => { this.delete() });
  }

  delete() {
    this.remove();
  }
}

customElements.define('task-entry', TaskEntry, { extends: 'li' });