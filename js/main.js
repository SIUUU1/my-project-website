"use strict";

/* =========================================================================
   나를 소개하는 웹페이지 — main.js

   전체 구조는 "사용자 이벤트 → 상태 변경 → DOM(화면) 업데이트" 흐름을 따릅니다.

   [설정값]
   - GitHub 사용자명: GITHUB_USERNAME
   - 스크롤 탑 버튼 노출 기준: 300px
   - 네비 배경 변경 기준: 60px
   - Intersection Observer threshold: 0.2
========================================================================= */

/* GitHub 사용자명 (저장소 목록을 불러올 계정) */
const GITHUB_USERNAME = "SIUUU1";

/* 설정값(README에 명시한 기준값들) */
const CONFIG = {
  scrollTopThreshold: 300, // 스크롤 탑 버튼이 나타나는 스크롤 위치(px)
  navScrollThreshold: 60,  // 네비게이션 배경이 바뀌는 스크롤 위치(px)
  revealThreshold: 0.2,    // 스크롤 등장 애니메이션 임계값
  toastDuration: 10000,    // 토스트 알림이 자동으로 사라지기까지의 시간(ms)
};

/* -------------------------------------------------------------------------
   0. 유틸: querySelector / querySelectorAll 을 짧게 쓰기 위한 헬퍼
      - 화살표 함수 + 구조분해(기본 매개변수) 활용
------------------------------------------------------------------------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* =========================================================================
   1. 다크 모드  [상태 → 렌더링 #1]
      토글 클릭 → 테마 상태 변경 → data-theme 속성 & 아이콘 변경 → 로컬스토리지 저장
      [보너스] 시스템 설정(prefers-color-scheme)을 감지하며, OS 설정이 항상 우선
        - OS 테마가 바뀌면 토글 선택과 관계없이 즉시 OS 테마로 전환
========================================================================= */
const THEME_KEY = "portfolio-theme";
const rootEl = document.documentElement; // <html>
const themeToggle = $("#themeToggle");

/* 테마 상태를 화면에 반영(렌더링)하는 함수 */
const applyTheme = (theme) => {
  rootEl.setAttribute("data-theme", theme);

  const icon = $("i", themeToggle);
  // classList 로 아이콘 클래스 교체 (달 ↔ 해)
  icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
  );
};

/* 시스템 다크 모드 설정 (prefers-color-scheme 미디어 쿼리) */
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const systemTheme = () => (darkQuery.matches ? "dark" : "light");

/* 저장된 토글 선택 읽기: { theme, system } 형태 (형식이 다르면 무시) */
const readSavedTheme = () => {
  try {
    return JSON.parse(localStorage.getItem(THEME_KEY));
  } catch {
    return null;
  }
};

/* 초기 테마 결정: 저장 당시와 OS 설정이 같으면 토글 선택 복원, 달라졌으면 OS 설정 */
const initTheme = () => {
  const saved = readSavedTheme();
  if (saved && saved.system === systemTheme()) {
    applyTheme(saved.theme);
  } else {
    localStorage.removeItem(THEME_KEY); // OS 설정이 바뀌었으면 이전 토글 선택은 폐기
    applyTheme(systemTheme());
  }
};

/* 시스템 테마 실시간 반영: OS 설정이 바뀌면 토글 선택을 지우고 즉시 OS 테마 적용 */
darkQuery.addEventListener("change", () => {
  localStorage.removeItem(THEME_KEY);
  applyTheme(systemTheme());
});

themeToggle.addEventListener("click", () => {
  const current = rootEl.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  // 새로고침 후에도 유지 (선택 당시의 OS 테마도 함께 저장)
  localStorage.setItem(THEME_KEY, JSON.stringify({ theme: next, system: systemTheme() }));
});

initTheme();

/* =========================================================================
   2. 햄버거 메뉴 토글
      모바일에서 버튼 클릭 → 메뉴 열림/닫힘 (classList.toggle('active'))
========================================================================= */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

const closeMenu = () => {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "메뉴 열기");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

/* 메뉴 링크 클릭 시 메뉴 닫기 (모바일 UX) */
$$(".nav__link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* =========================================================================
   3. 부드러운 스크롤
      앵커 링크 클릭 → 해당 섹션으로 부드럽게 이동
      (CSS의 scroll-behavior: smooth 와 함께 동작, JS로 메뉴도 닫음)
========================================================================= */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    // '#' 뿐이거나, JS가 나중에 href를 바꾼 경우(푸터 이메일 → mailto:)는 그냥 기본 동작에 맡김
    if (!targetId.startsWith("#") || targetId === "#") return;

    const target = $(targetId);
    if (target) {
      event.preventDefault(); // 기본 점프 동작 방지
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =========================================================================
   4. 스크롤 이벤트 처리 (한 번의 리스너로 두 가지 처리)
      a. 네비게이션 배경 변경 (60px 이상)
      b. 스크롤 탑 버튼 노출 (300px 이상)
========================================================================= */
const header = $("#header");
const scrollTopBtn = $("#scrollTop");

const handleScroll = () => {
  const y = window.scrollY;

  // a. 네비 배경
  header.classList.toggle("is-scrolled", y > CONFIG.navScrollThreshold);

  // b. 스크롤 탑 버튼
  scrollTopBtn.classList.toggle("is-visible", y > CONFIG.scrollTopThreshold);
};

window.addEventListener("scroll", handleScroll);
handleScroll(); // 로드 직후 현재 위치 기준 1회 실행

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================================
   5. 스크롤 등장 애니메이션 (Intersection Observer, threshold 0.2)
      요소가 화면에 보이면 'is-visible' 클래스를 붙여 나타나게 함
========================================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  { threshold: CONFIG.revealThreshold }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

/* =========================================================================
   6. Hero 타이핑 효과  [보너스]
      여러 단어를 한 글자씩 타이핑 → 지우기 → 다음 단어 반복
========================================================================= */
const initTyping = () => {
  const target = $("#typed");
  if (!target) return;

  const words = ["데이터로 문제를 정의합니다.","AI로 해결책을 만듭니다.","서비스로 구현합니다.",
];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = words[wordIndex];

    // 현재 글자 수만큼 잘라서 표시
    target.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
    } else if (deleting && charIndex > 0) {
      charIndex -= 1;
    } else {
      // 방향 전환
      deleting = !deleting;
      if (!deleting) {
        wordIndex = (wordIndex + 1) % words.length; // 다음 단어로
      }
    }

    // 타이핑은 빠르게, 지우기는 더 빠르게, 완성/삭제 후엔 잠깐 멈춤
    const delay = deleting ? 60 : charIndex === current.length ? 1400 : 110;
    setTimeout(tick, delay);
  };

  tick();
};

initTyping();

/* =========================================================================
   7. 폼 유효성 검사 + 메일 발송(Web3Forms)  [상태 → 렌더링 #2]
      입력하는 즉시(input) · 입력칸에서 나갈 때(blur) · 제출할 때 → 검증
      → formState(에러 상태) 변경 → 에러 메시지 표시/숨김
      검증 통과 시 Web3Forms API로 전송 → 전송 중 / 성공(토스트) / 실패(폼 아래 메시지)
========================================================================= */

/* --- 연락처 이메일 --------------------------------------------------------
   주소를 HTML에 그대로 적어 두면 스팸 봇이 페이지를 긁어갈 때 정규식 한 번으로
   수집됩니다. 그래서 조각으로 나눠 두고 실행 시점에 합칩니다.
   (비밀로 감추는 것이 아니라 "기계가 자동으로 긁어가기 어렵게" 만드는 것이 목적) */
const EMAIL_PARTS = ["jumia011", "gmail", "com"];
const contactEmail = () => `${EMAIL_PARTS[0]}@${EMAIL_PARTS[1]}.${EMAIL_PARTS[2]}`;

/* 푸터의 이메일 아이콘: HTML에는 #contact 로 두고, JS가 mailto 링크로 교체 */
const emailLink = $("#emailLink");
if (emailLink) {
  emailLink.href = `mailto:${contactEmail()}`;
  emailLink.setAttribute("aria-label", "이메일 보내기");
}

/* Web3Forms 액세스 키: 공개용 키 */
const WEB3FORMS_ACCESS_KEY = "d9f82be9-1d7b-4bd3-8479-93f3febd9d2c";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const form = $("#contactForm");
const statusMsg = $("#formStatus");
const submitBtn = $(".form__submit", form);

/* --- 토스트 알림: 표시 후 CONFIG.toastDuration(10초) 뒤 자동으로 사라짐 --- */
const toast = $("#toast");
const toastText = $("#toastText");
let toastTimer = null;

const hideToast = () => {
  clearTimeout(toastTimer);
  toast.classList.remove("is-visible");
};

const showToast = (text) => {
  toastText.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer); // 연속 표시 시 타이머 초기화
  toastTimer = setTimeout(hideToast, CONFIG.toastDuration);
};

$("#toastClose").addEventListener("click", hideToast);

/* 이메일 형식 검증용 정규식 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 필드별 검증 규칙: 위에서부터 검사해 처음 실패한 규칙의 메시지를 표시
   - live: true  → 입력하는 즉시 검사 (필수값 누락은 바로 알려주는 편이 친절)
   - live: false → 첫 blur/제출 이후부터 즉시 검사
     (이메일을 두 글자 쳤을 뿐인데 "형식이 아닙니다"가 뜨는 것을 막기 위함) */
/* 길이 제한 규칙: 숫자를 JS에 또 적지 않고 HTML의 maxlength 속성을 그대로 읽어옵니다.
   (maxlength 가 입력 자체를 막아 주지만, 붙여넣기·자동완성 등을 대비한 이중 안전장치) */
const maxLengthRule = {
  test: (v, input) => input.maxLength <= 0 || v.length <= input.maxLength,
  msg: (input) => `${input.maxLength}자 이내로 입력해주세요.`,
  live: true,
};

const RULES = {
  name: [
    { test: (v) => v !== "", msg: "이름을 입력해주세요.", live: true },
    maxLengthRule,
  ],
  email: [
    { test: (v) => v !== "", msg: "이메일을 입력해주세요.", live: true },
    { test: (v) => EMAIL_RE.test(v), msg: "올바른 이메일 형식이 아닙니다." },
    maxLengthRule,
  ],
  message: [
    { test: (v) => v !== "", msg: "메시지를 입력해주세요.", live: true },
    maxLengthRule,
  ],
};

const fieldInputs = Object.keys(RULES).map((id) => $(`#${id}`));

/* 폼의 검증 상태를 한 객체로 관리 (프로젝트 섹션의 projectState 와 같은 방식) */
const formState = {
  touched: new Set(), // 한 번이라도 blur/제출을 거친 필드 id (= 모든 규칙을 적용할 필드)
  errors: {},         // { 필드id: 에러 메시지 } — 빈 문자열이면 통과
};

/* 값 → 에러 메시지 계산
   liveOnly 면 live 규칙만 검사한다 */
const getFieldError = (input, liveOnly) => {
  const value = input.value.trim();
  const rules = liveOnly ? RULES[input.id].filter((rule) => rule.live) : RULES[input.id];
  // find 로 "처음 실패한 규칙"만 골라내기
  const failed = rules.find(({ test }) => !test(value, input));
  if (!failed) return "";
  // msg 는 문자열이거나, 입력칸 정보가 필요한 경우(길이 제한) 함수일 수 있음
  return typeof failed.msg === "function" ? failed.msg(input) : failed.msg;
};

/* 상태(formState.errors) → 화면(에러 문구 · 빨간 테두리 · aria-invalid) 반영 */
const renderFieldError = (input) => {
  const message = formState.errors[input.id] ?? "";
  $(`#${input.id}Error`).textContent = message;
  input.classList.toggle("has-error", message !== "");
  input.setAttribute("aria-invalid", String(message !== ""));
};

/* 글자 수 카운터 렌더링: #<필드id>Counter 요소가 있는 필드만 갱신
   maxlength 는 한도에 닿으면 아무 말 없이 입력을 막기 때문에, 남은 양을 눈으로 보여준다 */
const renderCounter = (input) => {
  const counter = $(`#${input.id}Counter`);
  if (!counter || input.maxLength <= 0) return;

  const { length } = input.value; // maxlength 와 기준을 맞추려고 trim 하지 않음
  counter.textContent = `${length} / ${input.maxLength}`;
  counter.classList.toggle("is-near-limit", length >= input.maxLength * 0.9);
};

/* 필드 1개를 검증하고 통과 여부(boolean)를 반환 (input · blur · submit 공용)
   live=true (입력 중)일 때, 아직 손대지 않은 필드는 live 규칙만 검사 */
const validateField = (input, live = false) => {
  if (!live) formState.touched.add(input.id); // blur/제출 = 이 필드를 본격 검증 대상으로 승격

  const liveOnly = live && !formState.touched.has(input.id);
  formState.errors[input.id] = getFieldError(input, liveOnly); // 상태 변경
  renderFieldError(input);                                     // 렌더링

  return formState.errors[input.id] === "";
};

/* 폼 전체 검증: 모든 필드의 에러를 한 번에 보여주기 위해 map으로 전부 검사한 뒤 every로 판정 */
const validateForm = () => fieldInputs.map((input) => validateField(input)).every(Boolean);

/* 검증 상태 초기화 (전송 성공 후 폼을 비울 때) */
const resetValidation = () => {
  formState.touched.clear();
  formState.errors = {};
  fieldInputs.forEach((input) => {
    renderFieldError(input);
    renderCounter(input);
  });
};

/* 전송 상태 메시지 렌더링 (type: "success" | "error" | "") */
const setStatus = (text, type = "") => {
  statusMsg.textContent = text;
  statusMsg.className = type ? `form__status form__status--${type}` : "form__status";
};

/* Web3Forms API로 메일 전송 (실패 시 에러를 던짐) */
const sendMessage = async () => {
  if (WEB3FORMS_ACCESS_KEY.startsWith("YOUR_")) {
    throw new Error("메일 전송 설정(Web3Forms 액세스 키)이 아직 되어 있지 않습니다.");
  }

  // FormData → 일반 객체 (name, email, message, 스팸 방지용 botcheck)
  const fields = Object.fromEntries(new FormData(form));

  let response;
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `[포트폴리오] ${fields.name}님의 새 메시지`,
        from_name: "안시우 포트폴리오",
        ...fields,
      }),
    });
  } catch {
    // fetch 자체가 실패 = 네트워크 오류
    throw new Error("네트워크 오류로 메시지를 보내지 못했습니다.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error("메시지 전송에 실패했습니다.");
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 기본 제출(새로고침) 방지

  if (!validateForm()) {
    setStatus("");
    $(".has-error", form)?.focus(); // 첫 번째 에러 칸으로 포커스 이동
    return;
  }

  // 전송 중 상태: 중복 제출 방지
  submitBtn.disabled = true;
  submitBtn.textContent = "보내는 중...";
  setStatus("");

  try {
    await sendMessage();
    showToast("메시지가 전송되었습니다. 확인 후 답장드리겠습니다. 감사합니다!");
    form.reset();
    resetValidation(); // 값이 비워졌으므로 에러 표시도 함께 초기화
  } catch (error) {
    setStatus(`${error.message} 잠시 후 다시 시도하시거나 ${contactEmail()}으로 직접 보내주세요.`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "메시지 보내기";
  }
});

fieldInputs.forEach((input) => {
  /* input 이벤트: 입력하는 즉시 검증 → 누락·형식 오류를 바로 표시하고, 고치는 순간 바로 사라짐 */
  input.addEventListener("input", () => {
    validateField(input, true);
    renderCounter(input);
    setStatus("");
  });

  /* blur 이벤트: 입력칸에서 나갈 때 모든 규칙으로 검증 (이후에는 입력 중에도 즉시 반영) */
  input.addEventListener("blur", () => validateField(input));

  renderCounter(input); // 로드 직후 1회 (새로고침 시 브라우저가 값을 복원하는 경우 대비)
});

/* =========================================================================
   8. 주요 프로젝트 (최신순 정렬)  [상태 → 렌더링 #3]
      프로젝트 데이터 배열 → sortKey 기준 내림차순 정렬 → 카드 렌더링
      새 프로젝트는 배열 어디에 추가해도 자동으로 최신순으로 표시됩니다.
========================================================================= */
const FEATURED_PROJECTS = [
  {
    title: "ER:ON",
    subtitle: "응급실 악화 예측·기록 지원 시스템",
    period: "2026.05 – 2026.09",
    sortKey: "2026-09",
    context: "SeSAC 의료·바이오 AI 과정 PBL · 팀장",
    badge: "최우수상",
    summary:
      "MIMIC-IV 실제 응급실 데이터로 성인 내원 환자의 악화 위험을 실시간 예측하고, 음성 인식으로 응급진료기록 초안까지 생성하는 응급실 AI 서비스입니다.",
    highlights: [
      "FastAPI·SQLAlchemy·PostgreSQL(pgvector)로 응급실 현황·환자 모니터링 API와 데모 시간축 기반 코호트 관리 구현",
      "악화 예측 모델을 마이크로서비스(Riskmodel)로 분리해 재예측 스케줄러·예측 API와 연동",
      "데이터 드리프트(PSI)·라벨 재현·온라인/배치 일치 검증을 포함한 MLOps 모니터링 화면과 회귀 테스트 구축 — 온라인/배치 위험도 오차 0 검증",
      "Docker Compose·Nginx 리버스 프록시로 다중 서비스를 컨테이너화해 OCI에 자체 도메인 HTTPS로 배포",
      "총 4개 팀 중 2위(최우수상) 수상",
    ],
    note: "LLM 기반 기록 초안·음성 인식(STT)은 팀원과 협업",
    stack: ["FastAPI", "SQLAlchemy", "PostgreSQL", "pgvector", "Docker Compose", "Nginx", "OCI", "MLOps"],
    links: [{ label: "GitHub", url: "https://github.com/SIUUU1/eron-project" }],
  },
  {
    title: "oo은행 여신사후관리시스템 재구축",
    subtitle: "금융 SI 프로젝트",
    period: "2024.11 – 2025.08",
    sortKey: "2025-08", // 정렬 기준: 종료 시점(YYYY-MM)
    context: "위드정보 · SI 개발 (주임)",
    summary:
      "경공매·개별충당금·신용보증 세 업무 영역의 화면과 백엔드 기능을 개발하고, 공매·기계공매 파트를 주 담당했습니다.",
    highlights: [
      "Spring Boot 백엔드와 Nexacro 화면을 연동하고 Tibero 기반 쿼리를 작성·최적화",
      // "공매 화면 12개(주 담당), 경매 화면 2개(최초 구축), 신용보증 조회 1개, 개별충당금 팝업 13개 등 총 28개 화면/팝업 개발",
      "화면정의서·프로그램 설계서 작성, 단위 테스트 및 업무 시나리오 기반 테스트 수행",
      // "공매 파트를 예상 일정보다 앞당겨 완료하고, 확보한 여력으로 경매 파트 개발을 지원해 팀 일정 대응에 기여",
    ],
    caseStudy: {
      title: "문제해결 · 데이터 정합성 결함 발견 및 수정",
      text: "경매 등록/수정 시 원장 반영 메서드에 조건문이 누락되어 부적절한 상황에서도 원장이 등록·수정되는 문제를 로그 분석으로 특정해 보완했고, 테스트 단계에서 사전 발견해 운영 반영 전에 차단했습니다.",
    },
    stack: ["Java", "Spring Boot", "Nexacro", "Tibero"],
  },
  {
    title: "WePlan",
    subtitle: "생산성 관리 도구",
    period: "2024.02 – 2024.08",
    sortKey: "2024-08", // KH 파이널 프로젝트 (세미 프로젝트 이후)
    context: "KH정보교육원 파이널 프로젝트 · 3인 팀장",
    summary: "React와 Spring Boot로 프론트엔드와 백엔드를 분리해 개발한 생산성 관리 도구입니다.",
    highlights: [
      "JWT(AccessToken·RefreshToken, HMAC SHA-512) 인증과 OAuth2 소셜 로그인(구글·네이버·카카오) 구현",
      "Bcrypt 암호화, 이메일 보안코드 인증",
      "웹소켓 기반 실시간 채팅·알림, Iamport 결제, 기상청 API 연동",
      "세미 프로젝트의 일정 지연 원인을 분석해 정기 회의·질의응답, 명확한 업무 분담, 커밋 컨벤션과 코드 리뷰를 도입하고 기한 내 완성",
    ],
    stack: ["React", "Spring Boot", "JWT", "OAuth2", "WebSocket"],
    links: [{ label: "GitHub", url: "https://github.com/SIUUU1/planner-teamproject-repo1" }],
  },
  {
    title: "CRUELLA",
    subtitle: "의류 쇼핑몰",
    period: "2024.02 – 2024.08",
    sortKey: "2024-07", // KH 세미 프로젝트 (파이널 프로젝트보다 앞)
    context: "KH정보교육원 세미 프로젝트 · 6인 팀장",
    summary: "MVC2 패턴 기반으로 Java·JSP/Servlet·Oracle을 사용해 만든 의류 쇼핑몰입니다.",
    highlights: [
      "회원·상품·장바구니·결제·관리자 기능 구현",
      "기획·역할 분담·일정 조율을 주도하고 기한 내 완성·발표",
    ],
    stack: ["Java", "JSP/Servlet", "Oracle", "MVC2"],
    links: [{ label: "GitHub", url: "https://github.com/SIUUU1/shoppingmall-teamproject-repo1" }],
  },
  {
    title: "내시경 AI 학습용 데이터 구축",
    subtitle: "의료 AI 합성데이터 국책 과제",
    period: "2023.07 – 2023.12",
    sortKey: "2023-12",
    context: "oo대학병원 위장관외과 · CRC",
    summary:
      "개인정보 이슈 없이 누구나 활용 가능한 ‘내시경 이미지 합성데이터’ 구축 과제로, 양산부산대병원 주관 아래 서울대병원·KAIST 등 다기관이 협업했습니다.",
    highlights: [
      "실제 위·대장 내시경 임상 데이터 수집·전처리·비식별화, 임상–이미지 데이터 매칭 및 메타데이터 관리",
      "라벨링(바운딩박스·세그멘테이션) 기준 수립 지원 및 QA, 합성데이터 정합성 검토",
      "GCP 등 연구 프로토콜을 준수하며 의료진·데이터 처리 인력과 협업",
      "합성 이미지 4만 장(궤양·용종·암), 어노테이션 객체 5만 4천여 건 규모의 데이터셋 구축에 기여 — YOLOv8 기반 병변 검출 모델 학습·검증(mAP)에 활용, 관련 논문 발표",
    ],
    stack: ["의료 데이터", "비식별화", "라벨링 QA", "YOLOv8 데이터셋"],
    links: [
      {
        label: "AI Hub ‘내시경 이미지 합성데이터’",
        url: "https://www.aihub.or.kr/aihubdata/data/view.do?pageIndex=1&currMenu=115&topMenu=100&srchOptnCnd=OPTNCND001&searchKeyword=%EB%82%B4%EC%8B%9C%EA%B2%BD&srchDetailCnd=DETAILCND001&srchOrder=ORDER001&srchPagePer=20&srchDataRealmCode=REALM006&aihubDataSe=data&dataSetSn=71666",
        icon: "fa-solid fa-database",
      },
    ],
  },
];

const featuredBox = $("#featuredProjects");

/* 프로젝트 1개 → 카드 HTML (구조분해 + 기본값 + 템플릿 리터럴) */
const projectCardHTML = ({
  title, subtitle, period, context, badge, summary,
  highlights = [], caseStudy, note, stack = [], links = [],
}) => `
  <article class="project-card">
    <div class="project-card__aside">
      <p class="project-card__period">${period}</p>
      <p class="project-card__context">${context}</p>
      ${badge ? `<span class="project-card__badge"><i class="fa-solid fa-trophy" aria-hidden="true"></i> ${badge}</span>` : ""}
    </div>
    <div class="project-card__main">
      <h4 class="project-card__title">${title}</h4>
      <p class="project-card__subtitle">${subtitle}</p>
      <p class="project-card__summary">${summary}</p>
      <ul class="project-card__list">
        ${highlights.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      ${caseStudy ? `
        <div class="project-card__case">
          <strong>${caseStudy.title}</strong>
          <p>${caseStudy.text}</p>
        </div>` : ""}
      ${note ? `<p class="project-card__note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ${note}</p>` : ""}
      <ul class="tag-list">
        ${stack.map((tech) => `<li>${tech}</li>`).join("")}
      </ul>
      ${links.length ? `
        <div class="project-card__links">
          ${links.map(({ label, url, icon = "fa-brands fa-github" }) => `
            <a class="project-card__link" href="${url}" target="_blank" rel="noopener">
              <i class="${icon}" aria-hidden="true"></i> ${label}
            </a>`).join("")}
        </div>` : ""}
    </div>
  </article>`;

/* sortKey(YYYY-MM) 내림차순 정렬 → 최신 프로젝트가 맨 위 */
const renderFeatured = () => {
  const sorted = [...FEATURED_PROJECTS].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  featuredBox.innerHTML = sorted.map(projectCardHTML).join("");
};

renderFeatured();

/* =========================================================================
   9. GitHub API 연동  [상태 → 렌더링 #4]
      fetch + async/await → 로딩/성공/에러/빈 상태를 UI로 렌더링
      저장소는 생성일(created_at) 기준 최신순으로 정렬
      [보너스] 언어별 필터 버튼
========================================================================= */
const projectsView = $("#projectsView");
const filtersBox = $("#projectFilters");

/* 이 섹션의 상태를 한 객체로 관리 */
const projectState = {
  repos: [],        // 원본 데이터
  activeLang: "all" // 현재 선택된 필터
};

/* --- 각 상태별 화면(HTML) 생성 --- */
const renderLoading = () => {
  projectsView.innerHTML = `
    <div class="state">
      <div class="spinner" role="status" aria-label="로딩 중"></div>
      <p>저장소를 불러오는 중...</p>
    </div>`;
};

const renderError = (messageText) => {
  projectsView.innerHTML = `
    <div class="state">
      <i class="fa-solid fa-triangle-exclamation state__icon"></i>
      <p>${messageText}</p>
      <button class="btn btn--primary" id="retryBtn" type="button">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> 다시 시도
      </button>
    </div>`;
  // 재시도 버튼에 이벤트 연결
  $("#retryBtn").addEventListener("click", loadRepos);
};

const renderEmpty = () => {
  projectsView.innerHTML = `
    <div class="state">
      <i class="fa-regular fa-folder-open state__icon"></i>
      <p>표시할 저장소가 없습니다.</p>
    </div>`;
};

/* ISO 날짜 문자열 → "YYYY.MM" (예: 2026-08-13T... → 2026.08) */
const formatMonth = (iso) => iso.slice(0, 7).replace("-", ".");

/* 저장소 배열 → 카드 */
const renderRepos = (repos) => {
  if (repos.length === 0) {
    renderEmpty();
    return;
  }

  const cards = repos
    .map((repo) => {
      const { name, description, html_url, language, stargazers_count, forks_count, created_at } = repo;
      return `
        <article class="repo-card">
          <h4 class="repo-card__name">
            <a href="${html_url}" target="_blank" rel="noopener">${name}</a>
          </h4>
          <p class="repo-card__desc">${description ?? "설명이 없습니다."}</p>
          <div class="repo-card__meta">
            <span><i class="fa-regular fa-calendar"></i> ${formatMonth(created_at)}</span>
            ${language ? `<span><span class="repo-card__lang-dot"></span>${language}</span>` : ""}
            <span><i class="fa-solid fa-star"></i> ${stargazers_count}</span>
            <span><i class="fa-solid fa-code-fork"></i> ${forks_count}</span>
          </div>
        </article>`;
    })
    .join("");

  projectsView.innerHTML = `<div class="projects__grid">${cards}</div>`;
};

/* --- 필터 버튼 만들기 (언어 목록 추출) --- */
const renderFilters = (repos) => {
  // repos에서 언어만 뽑고 중복 제거 (Set) → null 제외
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
  const options = ["all", ...languages];

  filtersBox.innerHTML = options
    .map((lang) => {
      const label = lang === "all" ? "전체" : lang;
      const isActive = lang === projectState.activeLang ? "active" : "";
      return `<button class="filter-btn ${isActive}" type="button" data-lang="${lang}">${label}</button>`;
    })
    .join("");

  // 각 버튼에 클릭 이벤트 연결 [상태 → 렌더링 #5]
  $$(".filter-btn", filtersBox).forEach((btn) => {
    btn.addEventListener("click", () => {
      projectState.activeLang = btn.dataset.lang; // 상태 변경
      updateActiveFilter();
      applyFilter(); // 화면 다시 렌더링
    });
  });
};

/* 활성 버튼 표시 갱신 */
const updateActiveFilter = () => {
  $$(".filter-btn", filtersBox).forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === projectState.activeLang);
  });
};

/* 현재 필터 상태에 맞춰 저장소를 걸러 렌더링 (filter 메서드) */
const applyFilter = () => {
  const { repos, activeLang } = projectState;
  const filtered =
    activeLang === "all" ? repos : repos.filter((r) => r.language === activeLang);
  renderRepos(filtered);
};

/* --- 실제 데이터 요청 (async/await + try/catch) --- */
async function loadRepos() {
  renderLoading(); // 로딩 상태 렌더링

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`;
    const response = await fetch(url);

    // 레이트 리밋(403) 또는 사용자 없음(404) 등 실패 응답 처리
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("요청이 많아 잠시 후 다시 시도해주세요. (GitHub API 한도 초과)");
      }
      if (response.status === 404) {
        throw new Error(`사용자 '${GITHUB_USERNAME}'를 찾을 수 없습니다.`);
      }
      throw new Error("프로젝트를 불러올 수 없습니다.");
    }

    const data = await response.json();

    // 포크 저장소는 제외하고, 생성일 기준 최신순으로 정렬 (filter + sort)
    projectState.repos = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    renderFilters(projectState.repos); // 필터 버튼 생성
    applyFilter();                      // 성공 상태 렌더링
  } catch (error) {
    // 네트워크 오류 등 처리
    renderError(error.message || "프로젝트를 불러올 수 없습니다.");
  }
}

/* 페이지 로드 시 저장소 불러오기 시작 */
loadRepos();
