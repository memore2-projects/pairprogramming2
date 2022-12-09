import Component from '../core/Component.js';
import Cards from './Cards.js';

class List extends Component {
  render() {
    const {
      list: { title, cards, isOpenCardComposer },
    } = this.props;

    // prettier-ignore
    return `
      <div class="list-container">
        <textarea class="mod-list-title">${title}</textarea>
        <div class="cards-container">${new Cards({ cards }).render()}</div>
        ${isOpenCardComposer
          ?
          `<form class="composer card-composer">
            <textarea class="new-card-title" placeholder="Enter a title for this card..." autofocus></textarea>
            <div class="composer-controller">
              <button class="btn">Add card</button>
              <a class="bx bx-x bx-md card-composer-closer"></a>
            </div>
          </form>`
          :
          `<div class="card-composer-opener">+ Add a card</div>`}
      </div>`;
  }
}

export default List;
