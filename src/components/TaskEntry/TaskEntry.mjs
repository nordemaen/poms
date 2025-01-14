export default class TaskEntry extends HTMLLIElement {
  #checkbox;
  #taskTitle;
  #deleteButton;

  async connectedCallback() {
    const response = await fetch(import.meta.resolve('./TaskEntry.html'))
    this.innerHTML = await response.text();

    this.#checkbox = this.querySelector("input[type=checkbox]");
    this.#taskTitle = this.querySelector("input[type=text]");
    this.#deleteButton = this.querySelector("#deleteButton");

    const { done, title } = this.dataset;
    this.done = done === 'true';
    this.title = title || '';

    this.#deleteButton.addEventListener('click', () => {
      this.remove();
    });
  }

  get done() {
    return this.#checkbox.checked;
  }

  set done(value) {
    this.#checkbox.checked = value;
  }

  get title() {
    return this.#taskTitle.value;
  }

  set title(value) {
    this.#taskTitle.value = value;
  }

  get data() {
    return {
      done: this.done,
      title: this.title
    };
  }

  set data(object) {
    ({ done: this.done, title: this.title } = object);
  }
}

customElements.define('task-entry', TaskEntry, { extends: 'li' });