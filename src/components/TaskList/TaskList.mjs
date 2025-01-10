export class TaskList extends HTMLElement {
  #newTaskButton;
  #taskList;

  async connectedCallback() {
    const response = await fetch(import.meta.resolve('./TaskList.html'))
    this.innerHTML = await response.text();

    this.#newTaskButton = this.querySelector('#newTaskButton');
    this.#newTaskButton.addEventListener('click', () => {
      this.#taskList.append(document.createElement('li', { is: 'task-entry' }))
    })

    this.#taskList = this.querySelector('#taskList');
    // ISSUE: #37 feat(tasks): load tasks from localStorage
    // Click the button to make it add a new entry :)
    // this.#newTaskButton.dispatchEvent(new Event('click'))
  }
}

customElements.define('task-list', TaskList);