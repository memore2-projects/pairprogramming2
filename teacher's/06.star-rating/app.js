import StarRating from './star-rating/index.js';

const $containers = [...document.querySelectorAll('.star-rating')];
const $currentRatings = document.querySelectorAll('.current-rating > span');

$containers.forEach(($container, i) => {
  const onChange = rating => {
    $currentRatings[i].textContent = rating;
  };

  /**
   * star-rating 요소를 생성한다.
   * $container: StarRating을 렌더링한 컨테이너
   * onChange: StarRating의 rating이 변경되면 호출될 함수
   */
  StarRating({ $container, onChange });
});
