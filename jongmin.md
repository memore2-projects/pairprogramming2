# pairprogramming2

## 01. TiggleSideNavigation

Javascript를 작성하기 위해서는 미리 템플릿으로 제작된 html과 css를 제대로 확인하고 내가 뭘하고 싶은지, 그걸 하기 위해서는 무엇을 해야하는지를 확실하게 정하고 그것을 구현해야 했다. 그리고 그것을 하면 왜 내가 하고싶던 것이 해결되는 지를 확실히 하고 넘어갔어야 하는데 구현 자체에만 매달렸던 것 같다.

1번 미션에서 페이지가 사이드네비게이션이 열려있는 상태로 렌더링 되었을 때 움직이는 모션을 감추는 부분에서, 왜 이런 현상이 발생했는지, 그것을 어떻게 해결할지에 대한 고민이 선행되지 않았다.

사이드 네비게이션의 움직임이 보이는 이유는 transition 때문이었다. 결국 그 방법으로 템플릿에서 제시한 방법은 translate가 전부 일어날 때까지는 페이지를 감추어 두었다가 translate가 끝난 이후에 페이지가 보이도록 하는 것이 '무엇을 해야할지'에 대한 것이었다.

결국 사이드네비게이션이 열린 상태로 만드는 것(nav요소에 active 클래스를 주는 것)과 페이지를 보이도록 body visibility를 visible로 하는 것에 대한 순서를 보장하는 것이 그 방법이었고, 그렇게 먼저 해야할 것을 정리한 이후 그 방법에 대해 고민하는 것이 옳은 방향이었다.

또한 DOMContentLoaded에 대한 이해도 부족했는데, DOMContentLoaded는 DOM트리를 형성하는 시점을 이야기 하고, 그 이후에 paint 과정이 이루어지게 된다. 사이드네비게이션이 열려있는 상태로 렌더링 시키고 싶을 때, paint 가 일어나기 전에 미리 active를 주어 네비게이션을 열어놓게하기 위해서 DOMContentLoaded 이벤트에 active를 추가하는 동작을 하도록 하였다.

transition을 0에서 다시 주는 것에서 헤맨 것도 템플릿을 면밀히 확인하지 않아서였다. transition 값을 getComputedStyle(~).getPropertyValue로 읽어와서 그 값을 다시 주려고 했는데 애초에 그럴 필요가 없었던 것이 클래스별로 0과 0.5가 적용되어있었기 때문이다.

그것과 별개로 transition의 값을 위 방법으로 읽어왔을 때 왜 값이 없었는가에 대해 찾아보았다. transition의 값은 traslate가 일어날 때 적용되는 부분이기 때문이었다.

코드를 작성하기 이전에 무엇을 하고싶은지, 어떻게 해야할지, 왜 그렇게 해야하는지를 먼저 정리하고 코드 작성에 들어가는 습관을 들여야겠다.

## 02. TicTacToe

상태를 쓰는이유에 대한 고민을 하게해준 미션이었다. 상태를 쓰겠다다는 것은 상태를 기준으로 DOM을 출력하겠다는 것이고, 이벤트가 발생하면 상태를 변경하고 그것에 맞추어 다시 렌더링을 하겠다는 것이다. 따라서 한번 상태에 따라 어떻게 렌더링할지를 정하게 되면 DOM을 어떻게 조작할지에 대한 고민의 필요 없이 어떻게 상태를 변경시킬 것인가에 집중할 수 있다.

처음 초기 렌더링 이후 DOM 자체를 조작하여 구현하려고 했을 때, 데이터가 변할 때마다 데이터에 관련된 DOM을 일일히 찾아야 했고 중복되는 코드가 많아졌다. 또한 불필요한 DOM 접근또한 코드에서 발견하여 어떻게 처리해야 할지에 대한 고민을 했어야만 했다.

그러나 직접적인 DOM조작이 아니라 상태를 관리하고 상태에 따라 페이지 전체를 렌더링 하는 방식의 단점 또한 볼 수 있었는데, 렌더링을 할 때마다 전체 DOM을 다시 그리게 되어 불필요한 동작이 많아졌다. 애초에 #root를 제외하고 html을 비워두고, 동적으로 렌더링마다 모든 요소를 그려주게되니 어쩔 수 없는 현상이었다. react를 배우게 될 때 버츄얼 돔의 필요성에 대해 미리 경험할 수 있었다.

### 코드 컨셉의 불일치

original.js 파일 비교.

state로 관리 vs 변수로 관리

디스트럭쳐링 할당으로 변수를 모듈스코프에서 선언하여 다 간단하게 사용하고 싶었으나, 그럴 경우 상태를 통해 관리하는게 아니였고, 상태를 변경시켰을 때 해당 변수들에 적용이 되지 않아 많은 에러를 만났음.

## 03. AccordionMenu

클래스로 아코디언메듀를 구현하였는데 지금까지 function으로 구현하던 것과 차이점이 궁금하여 학습하기로 결정.

1. 실행 순서에 영향을 받지 않았음. 함수의 경우 서로 의존적인 함수들이 존재할 수 있고, 그것에 따른 실행 순서에 대한 고민이 필요했지만, 클래스의 메서드는 코드 작성 순서와 상관없이 메서드를 사용할 수 있었음.

2. 스코프 단위의 차이가 있었음. 함수의 경우 모듈 안에서만 각 함수가 쓰여지고 그 결과들만을 모듈 참조를 통해 얻을 수 있었는데, 클래스의 경우 모듈을 불러와 모듈 내의 메서드 또한 사용이 가능했다.

컴포넌트란 무엇인가.
재사용이 가능한 각각의 독립된 모듈. 컴포넌트에 대한 정보는 인터페이스를 통해서만 접근할 수 있다. 컴포넌트 내의 정보는 숨겨진다. 클래스 모듈 내의 메서드를 접근할 수 없도록 하기 위해서는 private으로 데이터를 변수로 만들고 그것을 class 내의 메서드로만 조작하여 사용자가 직접적으로 모듈 밖에서 조작할 수 없도록 할 수 있다.

## 04. Drag&Drop

drag 이벤트 객체의 drop 이벤트에 대한 이해가 부족해 drop 이벤트를 이용하는데 어려움을 겪었다. drop 이벤트가 계속해서 발생하지 않았고, 찾아본 결과 dragover와 dragenter에 preventDefault를 해주어야 동작한다는 것을 알게 되었다. 왜냐하면 브라우저는 기본적으로 드래그한 대상이 드랍이 되지 않도록 설계되어 있기 때문이었다. 그래서 dragover와 dragenter 이벤트가 일어날 때 이러한 브라우저의 동작을 preventDefault로 막아줌으로서 드랍이 가능하도록 해준 것이다. 즉 브라우저의 기본 동작을 막아줄 때만 드랍 이벤트를 읽어오는 것이 가능했다.

처음에는 dragstart의 어떤 대상을 drag 했는지에 대한 정보를 이벤트 밖에서 선언한 변수에 할당하고 dragdrop 이벤트 때 드랍되는 지점에 대한 정보와 비교했었는데, 사실 그러한 변수 선언은 불필요하다는 것을 알게 되었다. drag 이벤트객체 안에는 drag 대상의 정보를 얻을 수 있는 dataTransfer라는 프로퍼티가 있는데 setData 메서드를 사용하여 dragstart의 target의 정보를 저장하고 drop에서 getData 메서드를 이용해 그 정보를 읽어옴으로써 불필요한 변수의 선언을 제거할 수 있었다.

- before

  ```js
  languages.forEach(item => {
    const randomIndex = randomArray.splice(Math.floor(Math.random() * randomArray.length), 1);
    suffleLanguages[randomIndex] = item;
  });
  ```

- after
  ```js
  const randomArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  ```

처음 인덱스를 랜덤으로 0~9까지 배열에 넣는 것을 코드로 구현하려 했을 때, 순차적으로 나열된 'randomArray안의 랜덤한 인덱스'를 꺼내서 새 배열에 집어넣는 방식을 택했다. 난수 생성 방식에 대해 아는 점이 없어서 열심히 고민하여 구현했는데 가독성도 좋지 않고, 복잡해보였다.

구글링으로 훨씬 가독성이 좋으면서 코드도 간결한 방법을 찾았는데 sort를 할때 콜백함수로 0~1까지의 난수를 생성하는 메서드 Math.random을 사용하고 0.5를 빼주어 랜덤으로 앞뒤 순서를 조절하는 방법이었다. 바꾸기 이전 코드보다 훨씬 간결해보였으며 난수 생성은 종종 쓰일 방법 같아 따로 저장해두고 기억하겠다 생각했다.

## 05. AnalogClock

setInterval로 times를 갱신하면서 갱신할 때마다 setHandPosition으로 시,분,초침의 모습을 변경시켜 출력하는 것으로 코드 작성을 구상하였다. 처음에 setHandPosition 안에서 times를 갱신시키면서 동시에 변경된 times를 바탕으로 출력하게 하였는데 app.js에서 각 컴포넌트를 불러올 때마다 times를 갱신하는 함수가 두번씩 호출되어버리는 바람에 의도한 것의 배로 시간이 갔다.

이것을 해결하기 위해 AnalogClock 안에서는 setHandPosition만을 하여 각 컴포넌트별로 시,분,초침의 위치만을 변경시키게 하고 times는 처음 javascript파일이 읽힐 때를 기준으로 단 하나의 함수로만 계속해서 갱신하도록하여 해결했다.

## 06. StarRating

처음 의아했던 것이 star-rating/index.js 안에서 충분히 요구한 어플리케이션을 구현할 수 있는데 커스텀 이벤트를 만들어서 app.js에 전달해서 star.length를 출력하는 이유가 무엇일까였다.

star-rating을 독립적인 컴포넌트로 보고싶었기 때문이다.

왜 app.js와 starRating을 분리했으며, 커스텀 이벤트를 사용했는가.
정보 전달. 왜. 컴포넌트란 무엇이냐.

커스텀 이벤트/props/옵저버패턴

## 07. Calendar&DatePicker

처음 picker 모듈에서 calendar를 이벤트 발생 때마다 읽어오도록 코드를 작성했더니 calendar의 이벤트가 지속적으로 쌓이는 현상이 일어났다. 그것을 해결하기 위해 calendar에는 이벤트만을 저장하고 단 한번 호출하여 이벤트가 쌓이는 것을 막고 render를 분리하여 picker의 이벤트마다 render를 호출하도록 변경하였다.

render를 calendar에서 분리하고 picker에서 호출하려고 하니 현재 상태에 대한 정보를 picker에서 전해줘야 한다는 문제점이 생겼다. calendar를 호출했을 때 return 값으로 상태를 반환하도록하고, picker에서 calendar를 호출했을 때 반환된 상태를 저장해 둠으로써 리렌더링마다 상태를 render에게 전달할 수 있도록 했다.

picker 모듈에서 click 이벤트 두곳에서 동적으로 생성하는 calendar 안의 button 요소를 두 이벤트가 다 읽어오질 못했다. 다른 요소들은 읽어오는데 button만 읽어오지
못하는 문제를 발견했다.
-> 버튼을 클릭했을 때의 화면에 보여지는 버튼과 실제 클릭한 버튼이 달랐기 때문이다.
버튼을 클릭하면 리렌더링이 되기 때문에 변경된 버튼을 조건에서 판단하여야 원하는대로 동작하게 할 수 있다.

## 08. NewsViewer

- Intersection Observer API

- observer 패턴
  한 주제 객체의 상태가 바뀌면 다른 구독 객체들에게 상태와 변경을 알리는 것.

      - polling : evnet / 어떠한 객체나 시스템에게 요구하는 상태가 되었나 안되었나 다른 객체들이 주기적으로 감지하는 패턴.

기존 방식(polling): 나이키 신제품이 나왔나 A,B,C가 나이키에 1시간마다 전화해서 확인.

- 양쪽 모두에게 부정적인 시간적 리소스가 요구됨.

옵저버 패턴: 나이키가 A,B,C 모두에게 구독을 요구하고 구독자 리스트에 등록이 되어있다면 신제품이 나왔을 때(이벤트가 발생) A,B,C 에게 나이키가 알아서 알림을 보냄.

관찰 대상: '주제 객체' / 관찰을 하는 객체: '구독 객체'

```js
notify(target);
// 옵저버 패턴

store; // 스토어 안에는 상태들이 저장

listeners = [Nav, NewsListRender]; // 실행할 함수는 인스턴스 렌더링하는

subscribe; // 상태 변화를 관찰해야하는 인스턴스 또는 컴포넌트 또는 렌더 구독하라는 의미

notify = state => {
  listeners.forEach(listener => listener(state));
};
```

- Proxy 패턴

  하나의 대상객체/주제객체에 클라이언트가 직접 접근하지 않고 Proxy를 통해 간접적으로 접근한다는 개념.

  클라이언트와 실제객체 사이에 존재함. (대리인의 역할)

  적용사례:

  1. 클라이언트가 객체에 접근해야 하는데 접근하기 위한 validation이 필요한 경우
  2. 원격 객체에 데이터를 요청을 할 때 프록시 객체에 캐싱 로직을 씌워주는 것. 캐싱이 되어있고, 같은 요청이 들어오면 캐싱된 객체를 우선적으로 반환.
  3. 은행 체크카드 (proxy) / 현금 (실제 객체)

![](images/2022-12-08-15-29-11.png)

실제 객체를 proxy가 참조한다.

```js
const proxy = new Proxy(target, handler); // target은 실제 객체 / handler proxy에게 어떤 요청이 들어왔을 때 그 작업을 직접적으로 실행해주는 역할.
//---

//Subject 인터페이스
interface Payment {
  request(amount: number): void;
}
// Real Subject 실제객체
class Cash implements Payment {
  request(amount: number) {
    console.log(`결제요청 완료.. 금액: ${amount}`);
  }
}
const targetObject = new Cash();
// Proxy
const paymentProxy = new Proxy(targetObject, {
  get: (object, prop) => {
    if (prop === 'request') {
      return object[prop];
    }
    throw new Error('operation not implemented');
  },
});

paymentProxy.request(100);
```

### 왜 프록시를 사용했나.

사실 이번 8번 미션에서는 굳이 프록시를 사용하지 않아도 객체의 접근자 프로퍼티를 통해 해결할 수 있다. 이번 문제의 컨셉은 상태를 변경했을 때 상태를 관찰하고있는 각 컴포넌트들이 모두 리렌더링 되는 것이다. 객체의 접근자 프로퍼티를 통해 해결하려고 할 경우 상태를 관찰해야하는 컴포넌트, 함수, 인스턴스마다 계속해서 접근자 프로퍼티를 추가해주어야 한다.

상태를 관찰하는 대상이 몇개이든 상관없이 상태를 변경한다면 프록시 하나로 모든 대상을 리렌더링 시키는 것이 가능하다.

### 상태를 관리하는 객체의 위치

처음 category 상태를 관리하는 객체를 component 폴더안에서 관리했었다. 상태를 관리하는 객체의 위치는 어디에 있어야 할까. 상태를 관리하는 객체는 현재 객체를 관찰하고 있는 함수/인스턴스 들을 읽어올 수 있는 위치에 있어야한다. 그래서 component 안에 있을 때에는 따로 export를 통해 category도 전달해주면서 import로 관찰하고있는 요소들을 가져와야했다. 때문에 상호참조와 같은 문제가 일어나 모듈 관리가 힘들었다.

app.js 파일안에 category 상태 객체를 넣어줌으로써 해당 참조 대상들을 따로 읽어올 필요가 없어졌고, 인수로 넘겨주게 되면서 export도 따로 해줄 필요가 없어졌다.

<!-- ----------------------------- ----------- ----------------------------- -->

## PairProgramming 2 통합 회고.

처음에는 생각이 당장 과제 기능 자체를 구현하는데에만 함몰되어 그 것을 구현할 때 무엇이 필요하고 어떤 것을 구현했을 때 내가 얻어내야 하는가에 대해 고민하는 시간을 가지지 못했다. 그리고 혼자 공부했을 때에는 그러한 습관을 끝까지 고치지 못했을 것 같다.

그러나 옆에서 내가 고민없이 관성적으로 쓰던 코드들에 대한 질문을 해주는 팀 덕에 내가 쓰던 코드들이 과연 최선인가에 대한 고민을 해보게 되었고, 그렇게 생긴 고민들은 결국 다른 학우들에게 질문하는 것으로 이어져 구현을 위한 방법이 어떤 것들이 있는가에 대한 범위가 더욱 늘어난 것 같았다.

평소 강사님에게 Why에 집중하라는 강의를 계속 들었었고, 공부를 함에 있어서 어떠한 태도를 지녀야 하는가에 대해 계속해서 들었는데도, 이미 한번 길들어진 공부 습관을 바꾸질 못했었다. 페어프로그래밍을 두 차례 진행하면서 그러한 안좋은 습관들에 대해 파악하고 계속해서 말해줄 수 있는 사람이 있다는 것이 좋았고, 혼자 공부했다면 마주치지 못했을 고민들을 계속 하게되면서 이렇게 공부해야되고, 이런 고민을 해야되는구나라는 것에 대해 매일매일 느꼈던 것 같다.
