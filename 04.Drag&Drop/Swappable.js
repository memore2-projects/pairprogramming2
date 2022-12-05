// https://githut.info
const languages = ['JavaScript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++', 'C', 'Shell', 'C#'];

export default $swappable => {
  const suffledLanguages = [];

  const render = () => {
    // prettier-ignore
    $swappable.innerHTML = `
      <ul class="draggable-list">
        ${suffledLanguages.map((language, index) =>`
          <li class="${language === languages[index] ? 'right' : 'wrong'}">
            <div class="seq">${index + 1}</div>
            <div class="draggable" draggable="true">
              <p class="language-name">${language}</p>
              <i class="bx bx-menu"></i>
            </div>
          </li>`
          ).join('')}
      </ul>`;
  };

  // randomNumberArray 변수에 인덱스를 무작위 순서로 채워넣은 배열을 할당.
  // 무작위 순서의 인덱스를 바탕으로 기존 languages의 해당 언어를 순서대로 suffledLanguages에 할당.
  const creatSuffleLanguages = () => {
    const randomNumberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    languages.forEach((language, index) => {
      suffledLanguages[randomNumberArray[index]] = language;
    });
  };

  // suffledLanguages의 배열에서 drag된 요소의 인덱스와 drop된 요소의 인덱스의 값을 서로 바꿈.
  // 바뀐 배열을 바탕으로 다시 렌더링
  const changeLanguagePosition = (dragIndex, dropIndex) => {
    // prettier-ignore
    [suffledLanguages[dragIndex], suffledLanguages[dropIndex]] =
    [suffledLanguages[dropIndex], suffledLanguages[dragIndex]];
  };

  creatSuffleLanguages();
  render();

  /* ------------------------------ Event Handler ----------------------------- */
  // drag and drop Web API 학습
  // drop 이벤트가 발생하지 않는 문제 https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drop

  // -> 기본적으로 브라우저는 드래그한 대상이 드랍이 되지 않도록 설계 되어있음. 즉 브라우저가 기본 동작이 drop 이벤트 자체를 막고 있기 때문에 이벤트가 발생하지 않는다.
  // 브라우저의 기본 동작을 제어함으로써 drop 이벤트 발생을 읽을 수 있음.
  // dragover, dragenter에서 preventDefault를 해주었다.

  // dataTransfer 프로퍼티를 이용하여 start 이벤트의 타겟 정보를 drop 이벤트에서도 접근할 수 있도록 setData 메서드를 사용하여 drag 이벤트 객체에 저장.
  // $swappable의 자식요소가 가진 textContent를 읽어오는 것이 목적. 스페이싱도 text로 인식하기 때문에 trim()
  $swappable.addEventListener('dragstart', e => {
    e.dataTransfer.setData('dragLanguage', e.target.closest('li').firstElementChild.textContent);
  });

  $swappable.addEventListener('dragover', e => {
    e.preventDefault();
  });

  $swappable.addEventListener('dragenter', e => {
    if (!e.target.closest('.draggable')) return;
    e.preventDefault();

    // dragenter event가 dragleave event보다 먼저 실행되기 때문에 a와 p 요소에서 .over 요소가 제거되는 현상이 있었음
    // eragenter 이벤트 핸들러에 setTimeout을 설정하여 dragleave event보다 늦게 동작하도록 설정함으로써 p태그 a태그에서도 .over 클래스가 적용된채로 유지할 수 있었음.
    setTimeout(() => {
      e.target.closest('li').classList.add('over');
    }, 0);
  });

  $swappable.addEventListener('dragleave', e => {
    e.target.parentNode.classList.remove('over');
  });

  // dragIndex 와 dropIndex를 그냥 표현식을 인수로 주는 것 vs 변수에 담아서 주는 것 고민
  // changeLanguagePosition 이라는 함수에 각 표현식을 뜻하는 이름의 변수를 인수로 주어 명시적으로 표현.
  $swappable.addEventListener('drop', e => {
    if (!e.target.closest('.draggable')) return;
    const dragIndex = +e.dataTransfer.getData('dragLanguage') - 1;
    const dropIndex = +e.target.closest('li').firstElementChild.textContent - 1;

    e.target.parentNode.classList.remove('over');

    changeLanguagePosition(dragIndex, dropIndex);
    render();
  });
};
