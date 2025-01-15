const OBSERVER_CONFIG = {
  childList: true, // Watch for additions/removals of child nodes (<li>)
  subtree: true,   // Watch all descendants of the target node (including inputs within <li>)
  attributes: true, // Watch for attribute changes on the subtree (value changes on inputs)
  attributeFilter: ['value', 'checked'] // Only watch the value attribute
};

export class TaskList extends HTMLElement {
  #newTaskButton;
  #taskList;
  /** ID used to load/save the list from `localStorage`. */
  #itemName = `task-list-${this.id}`;
  #observer = new MutationObserver(this.#handleChange.bind(this));

  async connectedCallback() {
    this.append(document.querySelector('#task-list-template').content.cloneNode(true));

    this.#newTaskButton = this.querySelector('#newTaskButton');
    this.#newTaskButton.addEventListener('click', () => {
      this.#taskList.append(document.createElement('li', { is: 'task-entry' }))
    });

    this.#taskList = this.querySelector('#taskList');

    const list = localStorage.getItem(this.#itemName);
    if (list) {
      this.data = JSON.parse(list);
    }

    this.#observer.observe(this.#taskList, OBSERVER_CONFIG);
    this.#taskList.addEventListener('input', this.#handleChange.bind(this));
  }

  get data() {
    return Array.from(this.#taskList.children, entry => entry.data);
  }

  set data(list) {
    for (const entry of list) {
      const li = document.createElement('li', { is: 'task-entry' });
      li.dataset.done = entry.done;
      li.dataset.title = entry.title;
      this.#taskList.append(li);
    }
  }

  #handleChange() {
    let json;
    try {
      json = JSON.stringify(this.data);
    } catch {}
    // ISSUE: #50 refactor(tasks): change MutationObserver to not throw error
    localStorage.setItem(this.#itemName, json);
  }
}

customElements.define('task-list', TaskList);