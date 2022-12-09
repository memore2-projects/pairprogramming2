import Component from '../core/Component.js';
import { findCard, findList } from '../state/controller.js';

class Popup extends Component {
  render() {
    const {
      lists,
      popup: { isOpen, isOpenCardDescComposer, listId, cardId },
    } = this.props;

    return isOpen
      ? `
        <div class="popup-overlay">
          <div class="popup-container" tabindex="-1">
            <a href="#" class="bx bx-x bx-md close-popup"></a>
            <div class="popup-header">
              <i class="bx bx-window popup-card-title-icon"></i>
              <div class="popup-card-title">
                <textarea class="mod-card-title">${findCard(lists, cardId).title}</textarea>
                <div class="popup-list-title">
                  in list
                  <a href="#" class="list-title-link">${findList(lists, listId).title}</a>
                </div>
              </div>
            </div>
            <div class="popup-main">
              <i class="bx bx-list-minus popup-card-title-icon"></i>
              <div class="popup-card-desc">
                <div class="popup-card-desc-title">Description</div>
                ${
                  isOpenCardDescComposer
                    ? `
                  <form class="composer card-desc-composer">
                    <textarea class="mod-card-desc" placeholder="Add a more detailed description..." autofocus>${
                      findCard(lists, cardId).description
                    }</textarea>
                    <div class="composer-controller">
                      <button class="btn">Save</button>
                      <a class="bx bx-x bx-md card-desc-composer-closer"></a>
                    </div>
                  </form>`
                    : `
                  <a href="#" class="card-desc-composer-opener" data-placeholder="Add a more detailed description...." >${
                    findCard(lists, cardId).description
                  }</a>`
                }
              </div>
            </div>
          </div>
        </div>`
      : '';
  }
}

export default Popup;
