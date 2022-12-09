import Component from '../core/Component.js';
import { Lists, ListComposer, Popup } from './index.js';

class Main extends Component {
  render() {
    const { lists, listComposer } = this.props;

    return `
      <div class="lists-container">${new Lists({ lists }).render()}</div>
      <div class="list-composer-container">${new ListComposer({ listComposer }).render()}</div>
      <div class="popup">${new Popup(this.props).render()}</div>`;
  }
}

export default Main;
