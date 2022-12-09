import Component from '../core/Component.js';

class ListComposer extends Component {
  render() {
    const {
      listComposer: { isOpen },
    } = this.props;

    return isOpen
      ? `<form class="composer list-composer">
          <textarea class="new-list-title" placeholder="Enter list title..." autofocus></textarea>
          <div class="composer-controller">
            <button class="btn">Add list</button>
            <a class="bx bx-x bx-md list-composer-closer"></a>
          </div>
        </form>`
      : `<div class="list-composer-opener">+ Add another list</div>`;
  }
}

export default ListComposer;
