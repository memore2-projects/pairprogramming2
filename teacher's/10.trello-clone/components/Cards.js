import Component from '../core/Component.js';
import Card from './Card.js';

class Cards extends Component {
  render() {
    const { cards } = this.props;

    return cards.map(card => `${new Card({ card }).render()}`).join('');
  }
}

export default Cards;
