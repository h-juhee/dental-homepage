# Dental Homepage

치과 롱스크롤 메인페이지를 단계적으로 제작하기 위한 초기 프로젝트입니다.

## 기술 스택

HTML, CSS, Vanilla JavaScript를 기반으로 하며 빌드 도구는 사용하지 않습니다.

Swiper 14.0.2와 GSAP 3.13.0을 jsDelivr CDN으로 연결합니다. 메인 비주얼은 Swiper와 GSAP 코어를 사용하고, 진료철학 섹션은 GSAP ScrollTrigger를 추가로 사용합니다.

## 구조

```text
dental-homepage/
├─ index.html
├─ css/ (reset, variables, common, layout, responsive)
├─ js/ (main 및 기능별 modules)
└─ assets/ (images, videos, icons, fonts)
```

## 실행

`index.html`을 브라우저에서 직접 열거나 프로젝트 폴더를 로컬 정적 서버의 루트로 실행합니다. ES Modules의 로컬 파일 제한이 있는 브라우저에서는 정적 서버 사용을 권장합니다.

## 파일 역할

- `reset.css`: 브라우저 기본 스타일 정리
- `variables.css`: 색상, 간격, 타이포그래피, 모션 토큰
- `common.css`: 공통 요소와 접근성 스타일
- `layout.css`: 섹션, 헤더, 장비 영역의 기본 레이아웃
- `responsive.css`: 태블릿·모바일 반응형 골격
- `main.js`: 모듈 초기화 진입점
- `header.js`: 헤더 DOM 초기화 골격
- `scrollReveal.js`: 등장 대상 수집 골격
- `equipmentFocus.js`: 데스크톱 sticky scroll 구간에서 IntersectionObserver로 활성 장비를 전환하고 포커스 프레임·콘텐츠·스텝 인디케이터를 동기화, 모바일에서는 전체 카드 노출로 전환
- `heroSlider.js`: 메인 비주얼 슬라이드, 애니메이션, 자동 재생 및 접근성 상태 관리

장비 소개 영역은 데스크톱에서 sticky scroll과 함께 활성 장비 전환, 포커스 프레임 효과가 연결되어 있습니다. 모바일(767px 이하)에서는 sticky를 해제하고 모든 장비를 카드형으로 순서대로 노출합니다.
