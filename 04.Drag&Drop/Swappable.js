// https://githut.info
const languages = ['JavaScript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++', 'C', 'Shell', 'C#'];
const suffleLanguages = [];

const render = $swappable => {
  // prettier-ignore
  $swappable.innerHTML = `
      <ul class="draggable-list">
        ${suffleLanguages.map((language, index) =>
          `<li class="${language === languages[index] ? 'right' : 'wrong'}">
            <div class="seq">${index + 1}</div>
            <div class="draggable" draggable="true">
              <p class="language-name">${language}</p>
              <i class="bx bx-menu"></i>
            </div>
          </li>`
          ).join('')}
      </ul>`;
};

const creatSuffleLanguages = () => {
  const randomArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  languages.forEach(item => {
    const randomIndex = randomArray.splice(Math.floor(Math.random() * randomArray.length), 1);
    suffleLanguages[randomIndex] = item;
  });
};

const changeLanguagePosition = (dragLanguage, dropLanguage) => {
  const dragIndex = suffleLanguages.indexOf(dragLanguage);
  const dropIndex = suffleLanguages.indexOf(dropLanguage);

  [suffleLanguages[dragIndex], suffleLanguages[dropIndex]] = [suffleLanguages[dropIndex], suffleLanguages[dragIndex]];
};

export default $swappable => {
  creatSuffleLanguages();
  render($swappable);

  $swappable.addEventListener('dragstart', e => {
    e.dataTransfer.setData('dragLanguage', e.target.textContent.trim());
  });

  $swappable.addEventListener('dragover', e => {
    e.preventDefault();
  });

  $swappable.addEventListener('dragenter', e => {
    if (!e.target.matches('.draggable')) return;

    e.target.parentNode.classList.add('over');
  });

  $swappable.addEventListener('dragleave', e => {
    if (!e.target.matches('.draggable')) return;

    e.target.parentNode.classList.remove('over');
  });

  $swappable.addEventListener('drop', e => {
    if (!e.target.matches('.draggable')) return;

    e.target.parentNode.classList.remove('over');

    changeLanguagePosition(e.dataTransfer.getData('dragLanguage'), e.target.textContent.trim());
    render($swappable);
  });
};
