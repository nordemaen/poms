export default class TaskEntry extends HTMLLIElement {
  #checkbox;
  taskTitle;
  #deleteButton;
  done;

  async connectedCallback() {
    // Built-in elements don't use shadow dom
    const response = await fetch(import.meta.resolve('./TaskEntry.html'))
    this.innerHTML = await response.text();

    this.#checkbox = this.querySelector("#taskCheckbox");
    this.taskTitle = this.querySelector("#taskTitle");
    this.#deleteButton = this.querySelector("#deleteButton");

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

customElements.define('task-entry', TaskEntry, { extends: 'li' });