import Component from '../core/Component.js';

class Header extends Component {
  render() {
    return `
      <a class="logo" href="#">
        <img src="assets/logo.gif" alt="logo">
        <img src="assets/logo-loading.gif" alt="logo-loading">
      </a>`;
  }
}

export default Header;
