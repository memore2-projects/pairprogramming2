# pairprogramming2

## 01.ToggleSideNavigation

visiblity hidden의 값을 body.style에서 읽을 수 없었다. 그 이유는?

transition은 언제 일어나는가? 트랜지션은 초기값이 변경이될때 일어난다.

1번문제를 풀 때 DOMContentLoaded 이벤트를 사용하는 이유는 렌더링이 일어나기 전에 처리해야할 선작업이 있기 때문이다. 이번 문제를 예시로 들면 localStorage에 저장된 값을 기준으로 새로고침 할때 네비게이션의 open/close를 정하는데 DOMContentLoaded 이벤트를 사용하지 않으면 trnasigion의 움직임이 사용자에게 보여지게 된다. 그래서 DOMContentLoaded를 사용해야 한다.

localStorage에 저장된 값은 문자열이다.

## 02.TicTacToe

- 상태(state)와 변수의 차이점은 무엇인가?
- 모든 요소를 #root 요소에 동적 생성하는 방법을 사용할 때 장점과 단점은 무엇인가?

/// 내용 추가하고 맞는지 확인하자

상태는 데이터를 관리하고 데이터가 변한다면 렌더링 한다. 사용자에게 변화하는 모습이 감지된다.

모든 요소를 #root 요소에 동적 생성하는 방법을 사용하면 html에 의존적이지 않게 된다. 그래서 노드의 배치나 생성 등을 좀더 원하는대로 사용가능 하다. 단점으로는 domApi를 사용해 노드객체를 찾을 수없고 동적으로 HTML을 생성한 이후에 찾을 수 있다. 이벤트도 마찬가지.

처음에는 TicTacToe생성자 함수에는 이벤트만 존재하고 그 밖에 state관리와 render 함수가 존재했다.
mvc로 나누고 싶었기 때문인데, 생각해보니 데이터가 클로저 방식으로 관리되면 TicTacToe 컴포넌트가 여러개 만들어졌을때 하나의 데이터를 공유하므로 문제가
발생한다는 생각이 들어, TicTacToe 생성자함수 안에 모든 데이터를 넣었다.

## 03.Accordion

컴포넌트란 무엇인가? 컴포넌트는 재사용이 가능한 각각의 독립된 모듈이다. 독자적으로 사용가능한 작은 어플리케이션이라 할 수 있다.

app.js에서 menuList 데이터를 받아올때 처음에는 해당 데이터의 프로퍼티를 변경하면서 렌더링을 했었다. 서버에서 데이터를 받아오고 다시 변경한 데이터를 서버에 보내는 불필요한 작업을 했다. 그래서 받아온 데이터를 변경하지 않는 방법을 사용했다.

## 04.Drag&Drop

drop이벤트가 계속 발생하지 않아서 학습한 결과 dragover와 dragenter에 preventDefault를 해주어야 동작한다는 것을 알았다.

브라우저는 기본적으로 드래그한 대상이 드랍이 되지 않도록 설계되어 있다. 그래서 over와 enter 이벤트가 일어날때 이러한 브라우저의 기본 동작을 막음으로써 드랍이 가능하도록 한 것이다.

스타트 이벤트에서 드래그 하는 대상의 정보를 저장하기 위해 변수를 선언해 저장했었는데 드래그 이벤트 안에는 드래그 대상의 정보를 얻을 수 있는 dataTransfer라는 프로퍼티가 존재해서 변수의 선언없이도 데이터를 저장하고 넘길수 있었다.

## 05.AnalogClock

setInterval을 이용해 1초마다 시침, 분침, 초침의 deg값을 변경했다. 그런데 setInterval을 AnalogClock안에서 선언해서
새로운 AnalogClock을 생성할때마다 setInterval이 호출되는 문제가 발생했다( 두개를 만들면 deg값이 두배로). 단 한번만 실행하기 위해 setInterval을 AnalogClock 밖에다가 선언하였다.

컴포넌트를 만들때 단 한번만 실행해야 하는 것과 생성될때마다 갱신되야하는 것들을 잘 구분해서 만들어야겠다.

## 06.StarRating

커스텀이벤트

별을 클릭했을때 발생하는 이벤트에서 rating의 text를 변경하지 않고 왜 커스텀 이벤트를 사용했을까? starRating의 state를 외부에서 사용할 필요가 있기 때문이다.

## 07.Calendar&DatePicker

picker와 calendar 두개의 컴포넌트를 만들어야했다.
서로 다른 컴포넌트였지만 연관성이 높기때문에 서로 역할을 분리하는 방법을 찾기가 어려웠고 아쉬웠다.

캘린더의 좌우버튼을 클릭시 e.target.closest()로 원하는 노드를 찾지 못하는 현상이 발생했다. 이유를 찾아보니 버튼을 클릭시 리랜더링이 일어나 e.target의 부모요소를 찾지 못한 것이었다.

document로 dom에 접근한다면 발생하는 문제점: 컴포넌트를 만들때 기준이 되는 컨테이너 노드를 인수로 전달해줬다. 그런데 전달된 노드에 자식이나 본인에 이벤트를 달지 않고 document.querySelector를 사용해 접근했었다. 그랬더니 재사용에 문제점이 발생했는데, 두개의 컴포넌트를 만들었을때 첫번째 컴포넌트에만 이벤트가 동작하는 문제가 발생했다. 기준을 좀 더 명확히 하고 document를 사용할때는 곰곰히 생각해 보고 사용해야겠다.

## 08.NewsViewer

Intersectionobserver는 document 의 viewport 사이의 intersection 내의 변화를 비동기적으로 관찰하는 방법인데, 처음에 들었던 생각은 querySelectorAll을 사용해 해당되는 노드 전부를 불러와 마지막요소를 찾는다면 원하는 함수가 호출하려 했는데.scroll-observer라는 하나의 노드가 존재했고 그 노드를 관찰해 isintersecting true일 때 함수를 호출하는 방법으로 했다.

proxy는 첫번째 인수로 state 객체를 전달하고 두번째 인수로 state의 프로퍼티를 조작하기 위해 handler 객체를 사용하는데, 전달받은 객체를 target이라고 하고
handler 내에는 set,get 등등의 매서드가 존재한다. 마치 객체의 setter와 getter처럼 동작을 하는데, 각각의 메서드 내에는 target,prop, receiver매개변수를 받는다. target은 전달받은 state객체를 의미하고, prop은
new Proxy.propertyName = 1 에서 .propertyName이다. receiver는 할당 연산자 우측의 값이다. 그래서 state를 할당연산자로 변경하면 set메서드가 호출되고 set메서드 안의 코드가 실행된다. state의 값을 가져오거나 변경할때 다른 작업도 하고 싶을때 사용한다.

## 깃 사용

git restreo . 을 사용해서 그동안 작성했던 회고록이 지워졌다
git을 사용할때 주의하자. 특히 .을 사용할때 고민하고 사용하자.
