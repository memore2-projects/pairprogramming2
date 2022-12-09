import Component from '../core/Component.js';

class Card extends Component {
  render() {
    const { card } = this.props;

    return `
      <div data-card-id="${card.id}" class="card" draggable="true">
        <div>
          <span>${card.title}</span>
          ${card.description !== '' ? `<i class="bx bx-menu-alt-left has-desc"></i>` : ''}
        </div>
        <!--<i class='bx bx-x-circle remove-card'></i>-->
        <i class="bx bx-pencil card-menu"></i>
      </div>`;
  }
}

export default Card;
