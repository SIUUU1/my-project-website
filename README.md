# 포트폴리오 — 나를 소개하는 웹페이지

외부 라이브러리 없이 **HTML · CSS · JavaScript**만으로 처음부터 만든 반응형 포트폴리오 웹사이트입니다.
화면을 그리는 데서 그치지 않고, **"사용자 이벤트 → 상태 변경 → DOM 업데이트"** 흐름을 기능마다 직접 구현하는 것을 목표로 했습니다.

- 금융 SI 개발 · 의료 데이터 구축 · 의료 AI 서비스 경험을 경력기술서 기반으로 소개합니다.
- GitHub API로 저장소 목록을 불러와 로딩 / 성공 / 에러 / 빈 상태를 UI로 표현합니다.

## 🔗 링크

| 구분 | URL |
| --- | --- |
| 배포 사이트 (GitHub Pages) | https://siuuu1.github.io/my-project-website/ |
| GitHub 저장소 | https://github.com/SIUUU1/my-project-website |

## 🧩 페이지 구성

| 섹션 | 내용 |
| --- | --- |
| Header | 로고 · 앵커 네비게이션 · 다크 모드 토글 · 햄버거 버튼 |
| Hero | 인사말 + 타이핑 효과, CTA 버튼(프로젝트 보기 / GitHub) |
| About | 자기소개, 프로필 이미지, 핵심 수치 |
| Skills | Backend · Frontend · Database · Infra/DevOps · AI/Data · 협업 도구 |
| Experience | 경력 · 교육 타임라인 (최신순) |
| Projects | 주요 프로젝트 카드(최신순) + **GitHub API 저장소 카드**(최신순, 언어 필터) |
| Certifications | 자격증 · 면허 |
| Contact | 문의 폼 (유효성 검사 + 실제 메일 전송) |
| Footer | 저작권, 소셜 링크(GitHub · 이메일) |

## 🛠 사용 기술

- **HTML5**: 시맨틱 마크업 (`header`, `nav`, `main`, `section`, `article`, `footer`)
- **CSS3**: CSS 변수(`:root`, `[data-theme="dark"]`), Flexbox, Grid(`auto-fit` + `minmax`), 모바일 퍼스트 반응형, `transition`
- **JavaScript (ES6+)**: DOM 조작, 이벤트, `fetch` + `async/await`, Intersection Observer, `matchMedia`, localStorage
- **GitHub REST API**: `https://api.github.com/users/SIUUU1/repos`
- **Web3Forms API**: 문의 폼 실제 메일 전송 (보너스)
- **Font Awesome · Google Fonts**: 아이콘, 웹 폰트 (미션에서 허용된 외부 리소스)

> React, Vue, jQuery, Bootstrap, Tailwind 등 외부 라이브러리는 사용하지 않았습니다.

## 📁 폴더 구조

```
my-project-website/
├── index.html              # 메인 페이지
├── css/
│   └── style.css           # CSS 변수 · 다크 모드 변수 · 레이아웃 · 반응형
├── js/
│   └── main.js             # DOM · 이벤트 · 상태 관리 · API 연동 · 폼 검증/전송
├── images/
│   ├── profile_image.png   # 프로필 이미지
│   ├── favicon.svg         # 파비콘
│   └── screenshots/        # README용 스크린샷
└── README.md
```

- `style.css`는 `<head>`에서, `main.js`는 **`defer`** 속성으로 연결해 HTML 파싱을 막지 않습니다.

## ✅ 요구사항 구현 현황

### 필수

| 요구사항 | 구현 내용 |
| --- | --- |
| 시맨틱 마크업 | `header` / `nav` / `main` / `section` / `footer`, 카드는 `article`로 렌더링 |
| 앵커 네비게이션 | 모든 섹션으로 이동하는 `#id` 링크 |
| 접근성 | 이미지 `alt`, `<label for>` ↔ `input id` 매칭, 아이콘 버튼 `aria-label` |
| CSS 변수 | `:root`에 색상·폰트·간격 정의, `[data-theme="dark"]`에 다크 모드 변수 별도 정의 |
| Flexbox | 네비게이션(로고 왼쪽 · 메뉴 오른쪽), 버튼 그룹, 태그 목록 |
| Grid | 저장소 카드 `repeat(auto-fit, minmax(280px, 1fr))`, 기술 스택·자격 카드, About 레이아웃 |
| 반응형 | 모바일 퍼스트, 브레이크포인트 **768px**(태블릿) · **1024px**(데스크톱), 모바일에서 햄버거 메뉴 |
| 시각 효과 | 버튼·카드 `hover` + `transition`, 카드 `box-shadow` |
| JS 코드 스타일 | `const`/`let`만 사용, `onclick` 대신 `addEventListener`, 인라인 `style` 없음 |
| 이벤트 | `click` · `submit` · `scroll` · `input` (+ `blur`, `change`) |
| 햄버거 메뉴 | `classList.toggle('active')`로 열기/닫기, 메뉴 링크 클릭 시 자동 닫힘 |
| 부드러운 스크롤 | `scrollIntoView({ behavior: "smooth" })` + CSS `scroll-behavior` |
| 스크롤 탑 버튼 | 300px 이상 스크롤 시 노출, 클릭 시 맨 위로 이동 |
| 네비 스타일 변경 | 60px 이상 스크롤 시 헤더 배경·그림자 적용 |
| 다크 모드 + 상태 유지 | 토글 시 `data-theme` 변경, localStorage 저장으로 새로고침 후 유지 |
| 스크롤 애니메이션 | Intersection Observer (`threshold: 0.2`), 한 번 나타나면 관찰 해제 |
| 폼 UX | 이름·이메일·메시지 필수값 검증, 이메일 형식 검증, **입력 즉시(실시간) 피드백**, 필드 바로 아래 에러 메시지, `event.preventDefault()`, 성공 메시지 |
| ES6+ | 화살표 함수, 템플릿 리터럴로 카드 HTML 생성, 구조분해 할당, `map` / `filter` / `forEach` |
| 비동기 · API | `fetch` + `async/await` + `try/catch`로 GitHub API 호출, 로딩 / 성공 / 에러(+다시 시도) / 빈 상태 UI |
| 레이트 리밋 | 403 응답 시 한도 초과 안내와 함께 에러 상태 UI 표시 |

### 보너스

| 보너스 과제 | 구현 내용 |
| --- | --- |
| 1. 프로젝트 필터링 | 저장소 언어 목록을 `Set`으로 추출해 필터 버튼 생성, `array.filter()`로 목록 갱신 |
| 2. 타이핑 효과 | Hero 문구를 한 글자씩 타이핑 → 지우기 → 다음 문구 반복 |
| 3. 폼 실제 전송 | **Web3Forms** API로 실제 이메일 전송 (Formspree와 같은 방식의 폼 전송 서비스) |
| 4. 시스템 다크 모드 감지 | `matchMedia("(prefers-color-scheme: dark)")`로 감지, OS 설정 변경 시 **실시간 반영** |

### 추가 구현

- **즉각적인 피드백**: 제출할 때뿐 아니라 `input`(입력하는 즉시) · `blur`(입력칸 이탈) 시점에도 해당 필드를 검증해, 필수값 누락·이메일 형식 오류를 바로 알려주고 고치는 순간 바로 사라집니다
  - 필수값 누락은 입력 중에도 곧바로 표시하고, 이메일 형식 오류는 첫 `blur`/제출 이후부터 실시간 표시 — 두 글자 쳤을 뿐인데 "형식이 아닙니다"가 뜨는 것을 막기 위함
- **전송 UX**: 전송 중 버튼 비활성화(중복 제출 방지), 성공 시 **토스트 알림(10초 후 자동 닫힘)**, 실패 시 폼 아래 에러 안내
- **스팸 방지**: 화면에 보이지 않는 honeypot 필드(`botcheck`)
- **최신순 정렬**: 주요 프로젝트는 `sortKey`, GitHub 저장소는 생성일(`created_at`) 기준 내림차순
- **접근성**: `prefers-reduced-motion` 설정 시 애니메이션 최소화

## ⚙️ 동작 기준값

미션에서 "자유 변경 가능하나 README에 명시"하도록 한 값들입니다. `js/main.js`의 `CONFIG` 객체에서 관리합니다.

| 항목 | 기준값 |
| --- | --- |
| 스크롤 탑 버튼 노출 | 스크롤 **300px** 이상 |
| 네비게이션 배경 변경 | 스크롤 **60px** 이상 |
| 스크롤 애니메이션 (Intersection Observer `threshold`) | **0.2** |
| 메일 전송 성공 토스트 자동 닫힘 | **10초** |

## 🔄 "상태 → 렌더링" 흐름

| # | 사용자 이벤트 | 상태 변경 | 화면 업데이트 |
| --- | --- | --- | --- |
| 1 | 다크 모드 토글 클릭 / OS 테마 변경 | 테마 상태(`data-theme`) + localStorage | 전체 색상 변수 교체, 토글 아이콘(달 ↔ 해) 변경 |
| 2 | 폼 입력 · 입력칸 이탈 · 제출 | `formState.errors` / `formState.touched` | 에러 메시지 즉시 표시/숨김, 입력칸 테두리 강조, `aria-invalid` 갱신 |
| 3 | 폼 전송 | 전송 중 / 성공 / 실패 | 버튼 비활성화 → 토스트 또는 에러 메시지 |
| 4 | 페이지 로드 → GitHub API 호출 | 로딩 / 성공 / 에러 / 빈 상태 | 스피너 → 저장소 카드 / 에러 + 다시 시도 / 빈 상태 메시지 |
| 5 | 언어 필터 버튼 클릭 | `projectState.activeLang` | 활성 버튼 표시, 저장소 목록 다시 렌더링 |

예시: GitHub API 연동 (`loadRepos`)

```js
async function loadRepos() {
  renderLoading();                        // 상태: 로딩 → 스피너 렌더링
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(/* 403 / 404 / 기타 메시지 */);
    const data = await response.json();
    projectState.repos = data
      .filter((repo) => !repo.fork)       // 포크 제외
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderFilters(projectState.repos);    // 상태: 성공 → 필터 버튼 + 카드 렌더링
    applyFilter();                        //   (0개면 빈 상태 렌더링)
  } catch (error) {
    renderError(error.message);           // 상태: 에러 → 메시지 + 다시 시도 버튼
  }
}
```

## ❓ 예상 질문 (Q&A)

미션의 "과제 목표"와 구현 선택에 대해 나올 수 있는 질문을 정리했습니다.

### 1. HTML · 시맨틱 마크업

**Q. 시맨틱 태그를 왜 사용했나요? 전부 `div`로 해도 화면은 똑같지 않나요?**
화면은 같지만 **의미**가 다릅니다. `div`는 의미가 없는 상자라서, 스크린 리더는 어디가 본문이고 어디가 네비게이션인지 알 수 없고 검색 엔진도 문서 구조를 파악하기 어렵습니다. 시맨틱 태그를 쓰면 보조기기가 "헤더로 이동", "본문으로 건너뛰기" 같은 탐색을 제공할 수 있고, 코드만 읽어도 각 영역의 역할이 드러나 유지보수가 쉬워집니다.

**Q. 어떤 기준으로 구조를 설계했나요?**
- 페이지 공통 영역을 `header`(로고·네비) / `main`(본문) / `footer`(저작권·소셜)로 나누고, 메뉴는 `nav`로 감쌌습니다.
- 본문은 **네비게이션 메뉴 1개 = `section` 1개**가 되도록 설계해 앵커 링크와 1:1로 대응시켰습니다.
- 프로젝트·저장소 카드는 그 자체로 독립적으로 읽히는 콘텐츠라서 `article`을 사용했습니다.
- 제목은 `h1`(Hero) → `h2`(섹션 제목) → `h3`(카드/타임라인 제목) → `h4`(카드 내부 제목) 순서를 건너뛰지 않게 맞췄습니다.

**Q. 접근성을 위해 무엇을 했나요?**
이미지에 의미 있는 `alt`, 폼의 `<label for>` ↔ `input id` 매칭, 아이콘만 있는 버튼에 `aria-label`, 햄버거 버튼에 `aria-expanded`(열림/닫힘 상태), 에러·상태 메시지 영역에 `aria-live`/`role="status"`를 적용했습니다. 장식용 아이콘은 `aria-hidden="true"`로 읽히지 않게 했습니다.

### 2. CSS · 레이아웃

**Q. Flexbox와 Grid의 차이는? 어떤 기준으로 선택했나요?**
Flexbox는 **1차원**(한 줄), Grid는 **2차원**(행 + 열) 레이아웃 도구입니다.
- Flexbox: 네비게이션(로고 왼쪽 · 메뉴 오른쪽), 버튼 그룹, 줄바꿈되는 태그 목록처럼 "한 방향으로 나열하고 정렬"하는 곳
- Grid: 카드 목록, 자격 목록, About(이미지 + 본문)처럼 "칸을 나눠 배치"하는 곳

**Q. 카드 목록에서 `repeat(auto-fit, minmax(280px, 1fr))`은 무슨 뜻인가요?**
"카드 최소 너비는 280px, 남는 공간은 똑같이 나눠 갖고, 들어갈 수 있는 만큼 열을 자동으로 만들어라"는 뜻입니다. 화면이 좁아지면 열 개수가 알아서 줄어들기 때문에 **카드 목록에는 별도의 미디어 쿼리가 필요 없습니다.**
(`auto-fill`은 공간이 남아도 빈 열을 유지하고, `auto-fit`은 빈 열을 접어 카드가 남은 공간을 채웁니다.)

**Q. 모바일 퍼스트로 작성한 이유는?**
기본 스타일을 모바일 기준으로 쓰고 `min-width` 미디어 쿼리로 화면을 넓혀가며 규칙을 더합니다. 좁은 화면일수록 레이아웃이 단순해서 기본값이 간결해지고, 덮어쓰는 CSS가 줄어듭니다. 브레이크포인트는 768px(태블릿), 1024px(데스크톱)입니다.

**Q. 다크 모드를 CSS 변수로 구현한 이유는?**
색상을 `:root`의 CSS 변수로 정의하고 `[data-theme="dark"]`에서 **같은 이름의 변수만 다시 정의**했습니다. 그래서 JS는 `<html>`의 `data-theme` 속성 하나만 바꾸면 되고, 색을 쓰는 모든 컴포넌트가 한 번에 전환됩니다. 클래스 대신 속성을 쓴 이유는 테마가 "켜짐/꺼짐"이 아니라 값을 가지는 상태이기 때문입니다.

**Q. 인라인 스타일을 쓰지 않은 이유는?**
스타일이 HTML 곳곳에 흩어지면 재사용과 수정이 어렵고, 명시도가 높아 나중에 덮어쓰기 힘듭니다. 상태에 따른 변화는 모두 **클래스 토글**(`is-visible`, `has-error`, `active`)로 처리했습니다.

### 3. JavaScript 기초 (DOM · 이벤트)

**Q. `defer`를 붙인 이유는? `async`와 무엇이 다른가요?**
`defer`는 HTML 파싱을 막지 않고 스크립트를 내려받고, **파싱이 끝난 뒤** 실행합니다. 그래서 스크립트가 DOM 요소를 안전하게 찾을 수 있습니다. `async`는 내려받는 즉시 실행해 실행 시점이 보장되지 않아, DOM을 다루는 코드에는 맞지 않습니다.

**Q. `var` 대신 `const`/`let`을 쓰는 이유는?**
`var`는 함수 스코프라 블록 밖으로 새어 나가고 재선언도 허용돼 실수를 잡기 어렵습니다. `const`/`let`은 블록 스코프이고, `const`는 재할당을 막아 "바뀌지 않는 값"이라는 의도를 코드로 드러냅니다.

**Q. `onclick` 대신 `addEventListener`를 쓴 이유는?**
HTML(구조)과 JS(동작)를 분리할 수 있고, 한 요소에 리스너를 **여러 개** 붙일 수 있으며, 필요할 때 `removeEventListener`로 해제할 수 있습니다.

**Q. `querySelector`로 요소를 선택하고 이벤트를 연결하는 흐름을 설명해 주세요.**
`querySelector`(CSS 선택자로 첫 번째 요소) 또는 `querySelectorAll`(전부, NodeList)로 요소를 찾고 → `addEventListener("이벤트명", 콜백)`으로 동작을 연결 → 콜백 안에서 상태를 바꾸고 DOM을 업데이트합니다. 이 프로젝트는 반복되는 선택 코드를 줄이려고 `$`, `$$` 헬퍼를 만들어 썼습니다(`$$`는 배열 메서드를 바로 쓸 수 있도록 스프레드로 배열 변환).

**Q. `textContent`와 `innerHTML`은 어떻게 구분해 썼나요?**
글자만 바꿀 때는 `textContent`(태그로 해석되지 않아 더 안전하고 빠름), 카드처럼 **구조가 있는 HTML**을 만들 때는 템플릿 리터럴 + `innerHTML`을 썼습니다.

**Q. `classList.toggle`에 두 번째 인자를 넘긴 이유는?**
`toggle(class, 조건)` 형태로 쓰면 "조건이 참이면 추가, 거짓이면 제거"가 한 줄로 끝납니다. 스크롤 위치에 따라 헤더 배경과 스크롤 탑 버튼을 켜고 끄는 코드가 `if/else` 없이 정리됩니다.

### 4. ES6+ 문법 · 배열 메서드

**Q. 화살표 함수를 왜 쓰나요? `loadRepos`만 `function`으로 선언한 이유는?**
화살표 함수는 짧고, 자신만의 `this`를 만들지 않아 콜백에서 예측 가능하게 동작합니다. 다만 `loadRepos`는 **에러 상태의 "다시 시도" 버튼(`renderError`)에서 정의보다 먼저 참조**하기 때문에, 호이스팅되는 `function` 선언으로 두었습니다.

**Q. 구조분해 할당은 어디에 썼나요?**
저장소 객체에서 필요한 값만 꺼낼 때(`const { name, description, html_url, ... } = repo`), 프로젝트 카드 함수의 매개변수에서 기본값과 함께(`{ highlights = [], links = [] }`), 헬퍼 함수의 기본 매개변수(`scope = document`)에 사용했습니다. 필요한 값만 이름으로 꺼내 쓰므로 `repo.xxx`가 반복되지 않습니다.

**Q. `map` / `filter` / `forEach`는 각각 어디에 썼나요?**
- `map`: 데이터 → HTML 카드 문자열 변환 (새 배열 반환)
- `filter`: 포크 저장소 제외, 언어별 필터링 (조건에 맞는 것만)
- `forEach`: 버튼마다 이벤트 연결처럼 반환값 없이 순회만 할 때
- 그 외 `sort`(최신순 정렬), `find`(처음 실패한 검증 규칙), `every`(전체 통과 여부), `Set`(언어 목록 중복 제거)을 사용했습니다.

**Q. 템플릿 리터럴로 HTML을 만들 때 주의할 점은?**
외부에서 받은 문자열이 그대로 `innerHTML`에 들어가면 XSS 위험이 있습니다. 이 프로젝트가 넣는 값은 본인 계정의 저장소 정보와 직접 작성한 프로젝트 데이터라 위험이 낮지만, 사용자 입력을 렌더링한다면 이스케이프 처리나 `textContent`가 필요합니다.

### 5. 비동기 처리 · API 연동

**Q. `fetch` + `async/await`로 데이터를 가져오는 흐름을 설명해 주세요.**
`renderLoading()`으로 먼저 로딩 UI를 그리고 → `await fetch(url)`로 응답을 기다린 뒤 → `response.ok`를 확인하고 → `await response.json()`으로 데이터를 파싱 → 포크 제외·정렬 후 카드 렌더링, 실패하면 `catch`에서 에러 UI를 렌더링합니다.

**Q. `try/catch`만으로 충분한가요? `response.ok`는 왜 확인하나요?**
`fetch`는 **404·403 같은 HTTP 에러에서도 reject되지 않습니다.** 네트워크 자체가 실패할 때만 예외가 납니다. 그래서 `response.ok`를 직접 확인해 `throw`로 바꿔 주고, `catch`에서 네트워크 오류와 함께 처리합니다.

**Q. 로딩/성공/에러/빈 상태를 어떻게 구분했나요?**
상태마다 렌더 함수를 하나씩 두었습니다: `renderLoading`(스피너) / `renderRepos`(카드 목록) / `renderError`(메시지 + 다시 시도 버튼) / `renderEmpty`(빈 상태 메시지). 저장소가 0개면 `renderRepos`가 `renderEmpty`를 호출합니다.

**Q. 레이트 리밋(403)은 어떻게 처리했나요?**
상태 코드별로 메시지를 나눠 던집니다. 403이면 "요청이 많아 잠시 후 다시 시도해주세요(API 한도 초과)", 404면 "사용자를 찾을 수 없습니다"를 표시하고, 함께 나오는 **다시 시도** 버튼이 `loadRepos`를 다시 호출합니다.

**Q. API에 `sort=created`를 넘기면서 JS에서 또 정렬하는 이유는?**
API 파라미터에만 의존하면 응답 순서가 바뀌었을 때 화면 순서가 흔들립니다. 받은 데이터를 화면에 그리기 직전에 한 번 더 정렬해 **"최신순"을 코드로 보장**했습니다. 포크 저장소는 직접 만든 결과물이 아니라서 `filter`로 제외했습니다.

### 6. 상태 관리 · 기능별 선택

**Q. "이벤트 → 상태 변경 → DOM 업데이트"가 React와 어떻게 연결되나요?**
React의 `setState` → 리렌더링을 손으로 구현한 구조입니다. 이 프로젝트는 상태를 변수/객체(`projectState`, `data-theme`, 검증 결과)에 두고, 상태를 바꾼 뒤 **렌더 함수를 호출해 화면을 다시 그립니다.** React는 이 "다시 그리기"를 자동화하고 변경된 부분만 갱신해 준다는 점이 다릅니다.

**Q. 다크 모드에서 localStorage에 무엇을 저장하나요?**
`{ theme, system }`, 즉 **선택한 테마와 선택 당시의 OS 테마**를 함께 저장합니다. 새로고침 시 OS 설정이 그대로면 토글 선택을 복원하고, OS 설정이 바뀌었으면 저장값을 버리고 OS를 따릅니다. 페이지를 보는 중에 OS 테마가 바뀌면 `matchMedia`의 `change` 이벤트로 즉시 전환됩니다(OS 설정 우선).

**Q. 스크롤 애니메이션에 Intersection Observer를 쓴 이유는? `threshold: 0.2`는?**
`scroll` 이벤트로 위치를 계산하면 스크롤할 때마다 코드가 실행되어 비효율적입니다. Intersection Observer는 브라우저가 교차 여부를 감시하다 필요할 때만 콜백을 실행합니다. `threshold: 0.2`는 "요소의 20%가 보이면" 실행한다는 뜻이고, 한 번 나타난 요소는 `unobserve`로 관찰을 해제해 다시 계산하지 않습니다.

**Q. 폼에 `novalidate`를 붙인 이유는?**
브라우저 기본 검증 풍선 대신, 메시지 문구와 표시 위치·시점을 직접 제어하기 위해서입니다. 검증은 **입력하는 즉시(`input`) · 입력칸에서 나갈 때(`blur`) · 제출할 때** 실행되어 필수값 누락과 이메일 형식 오류를 즉각 피드백하고, 값을 고치면 그 즉시 에러가 사라집니다. 규칙은 `RULES` 객체 한 곳에 모아 세 시점이 같은 규칙을 공유하고, 어떤 필드를 이미 검증 대상으로 볼지는 `formState.touched`가 기억합니다.

**Q. Web3Forms 액세스 키가 코드에 그대로 있는데 괜찮나요?**
Web3Forms의 액세스 키는 **프론트엔드 공개를 전제로 한 키**이고, 메일은 키를 발급받은 주소로만 전송됩니다. 정적 사이트(GitHub Pages)에는 서버가 없어 키를 숨길 곳이 없기 때문에, 공개를 전제로 설계된 서비스를 사용했습니다. 봇 대응으로는 보이지 않는 honeypot 필드를 두었습니다.

**Q. 전송에 실패하면 어떻게 되나요?**
버튼이 "보내는 중..."으로 바뀌고 잠겨 중복 제출을 막습니다. 성공하면 토스트(10초 후 자동 닫힘)를 띄우고 폼을 비우며, 실패하면 폼 아래에 에러 메시지와 함께 직접 메일을 보낼 주소를 안내하고 **입력한 내용은 지우지 않습니다.**

### 7. 알려진 한계와 개선 아이디어

- **테마 초기 깜빡임(FOUC)**: `main.js`가 `defer`로 실행되므로, 다크 모드 사용자는 아주 짧게 라이트 화면을 볼 수 있습니다. `<head>`의 인라인 스크립트로 테마를 먼저 지정하면 해결됩니다.
- **스크롤 이벤트 최적화**: 현재는 클래스 토글만 해서 가볍지만, 작업이 늘어나면 `requestAnimationFrame`이나 throttle, `{ passive: true }` 적용이 필요합니다.
- **이벤트 위임**: 필터 버튼은 렌더링할 때마다 버튼마다 리스너를 붙입니다. 부모 한 곳에서 처리하는 이벤트 위임이 더 효율적입니다.
- **부분 렌더링**: 상태가 바뀌면 목록 전체를 `innerHTML`로 다시 그립니다. 항목이 많아지면 변경된 카드만 갱신하는 방식이 필요합니다.
- **이미지 최적화**: 프로필 이미지가 약 2MB PNG라 WebP 변환·리사이즈로 로딩 속도를 줄일 수 있습니다.
- **현재 섹션 표시**: 스크롤 위치에 따라 네비게이션 메뉴를 강조하는 기능(scroll spy)은 아직 없습니다.

## 🚀 로컬 실행

1. 저장소를 클론하고 VS Code로 엽니다.
2. **Live Server** 확장을 설치한 뒤 `index.html`에서 우클릭 → **Open with Live Server**를 선택합니다.

## ⚠️ 주의사항

- **GitHub API 레이트 리밋**: 인증 없이 호출하면 IP당 **시간당 60회**로 제한됩니다. 초과 시 403 응답과 함께 에러 상태 UI와 **다시 시도** 버튼이 표시되니, 짧은 시간 내 반복 새로고침은 피해 주세요.
- **Web3Forms 액세스 키**: 프론트엔드에 노출되는 것을 전제로 한 공개용 키이며, 메일은 키를 발급받은 주소로만 전송됩니다.
