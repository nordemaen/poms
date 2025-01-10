const OBSERVER_CONFIG = {
  childList: true, // Watch for additions/removals of child nodes (<li>)
  subtree: true,   // Watch all descendants of the target node (including inputs within <li>)
  attributes: true, // Watch for attribute changes on the subtree (value changes on inputs)
  attributeFilter: ['value'] // Only watch the value attribute
};

export class TaskList extends HTMLElement {
  #newTaskButton;
  #taskList;
  /** ID used to load/save the list from `localStorage`. */
  #itemName = `task-list-${this.id}`;
  #observer = new MutationObserver(this.#mutationHandler);

  async connectedCallback() {
    const response = await fetch(import.meta.resolve('./TaskList.html'))
    this.innerHTML = await response.text();

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

  #mutationHandler(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Handle addition/removal of <li> elements
        console.log('Child list changed:', mutation);
        // You can further check mutation.addedNodes and mutation.removedNodes
        mutation.removedNodes.forEach(removedNode => {
          if (removedNode.nodeName === 'LI') {
            console.log("An LI was removed");
          }
        })
      } else if (mutation.type === 'attributes') {
        // Handle changes to input values (indirectly, by observing attribute changes)
        console.log('Attributes changed:', mutation);
      }
    }
  }

  // TODO: add a MutationObserver
}

customElements.define('task-list', TaskList);