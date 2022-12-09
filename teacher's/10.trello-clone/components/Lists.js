import Component from '../core/Component.js';
import List from './List.js';

class Lists extends Component {
  render() {
    const { lists } = this.props;

    // prettier-ignore
    return lists.map((list, i) => `
      <div class="list" data-list-index="${i}" data-list-id="${list.id}" draggable="true">
        ${new List({ list }).render()}
      </div>`
    ).join('');
  }
}

export default Lists;
