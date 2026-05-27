document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. INTRO: WHITE FRAGMENT REVEAL SYSTEM (인트로 애니메이션)
    // ==========================================
    const particleContainer = document.getElementById("particle-container");
    const fakeLogo = document.getElementById("fake-logo-text");
    const logoSvg = document.getElementById("logo-svg");
    const logoWrapper = document.getElementById("logo-portal-wrapper");
    const introOverlay = document.getElementById("intro-overlay");
    const mainContent = document.getElementById("main-content");

    const fragmentCount = 45; // 화면 오른쪽에서 날아올 하얀 파편 개수

    // 파편 조각들을 동적으로 생성하고 날려보내는 로직
    for (let i = 0; i < fragmentCount; i++) {
        const fragment = document.createElement("div");
        fragment.classList.add("white-fragment");

        // 파편의 랜덤한 크기 설정 (가로가 긴 직사각형 형태)
        const width = Math.random() * 120 + 30;
        const height = Math.random() * 6 + 2;
        fragment.style.width = `${width}px`;
        fragment.style.height = `${height}px`;

        // 시작 위치: 화면 오른쪽 바깥 영역에 무작위 분산 배치
        fragment.style.top = `${Math.random() * 100}vh`;
        fragment.style.left = `${Math.random() * 50 + 100}vw`;

        particleContainer.appendChild(fragment);

        // 각 파편마다 날아오는 속도(Duration)와 시간차(Delay)를 다르게 주어 리듬감 부여
        const delay = Math.random() * 0.6; 
        const duration = Math.random() * 0.4 + 0.3; // 0.3초~0.7초 사이로 빠르게

        fragment.style.transition = `left ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, 
                                    opacity ${duration}s ease ${delay}s`;

        // 브라우저가 스타일 변경을 인지한 후 애니메이션을 실행하도록 유도
        requestAnimationFrame(() => {
            fragment.style.left = `${Math.random() * 20 + 40}vw`; // 화면 중앙 로고 근처로 수렴
            fragment.style.opacity = "1";

            // 중심부에 모인 파편들을 로고가 켜지는 순간 자연스럽게 사라지도록 처리
            setTimeout(() => {
                fragment.style.transition = `all 0.4s ease-in`;
                fragment.style.left = '50vw';
                fragment.style.transform = 'translate(-50%, -50%) scale(0)';
                fragment.style.opacity = '0';
            }, Math.floor((delay + duration) * 1000)); // 연산 안정성을 위해 정수화 보정
        });
    }

    // [0.8초 후] 파편들이 뭉쳐지는 타이밍에 맞춰 선명한 흰색 로고 가사(Fake Text) 등장
    setTimeout(() => {
        if (fakeLogo) {
            fakeLogo.style.transition = "opacity 0.4s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            fakeLogo.style.opacity = "1";
            fakeLogo.style.transform = "scale(1)";
        }
    }, 800);

    // [1.5초 후] 가짜 텍스트를 숨기고 뒤편이 투명하게 뚫린 진짜 SVG 마스크 레이어로 교체
    setTimeout(() => {
        if (logoSvg && fakeLogo) {
            logoSvg.style.opacity = "1";
            fakeLogo.style.opacity = "0"; 
        }
    }, 1500);

    // [2.2초 후] 로고 마스크 레이어를 대폭 확대(Scale-up)하여 글자 틈새 터널로 진입하는 효과 유도
    setTimeout(() => {
        if (logoWrapper && introOverlay && mainContent) {
            logoWrapper.classList.add("zoom-active");
            introOverlay.style.opacity = "0"; // 검은색 인트로 가림막 페이드아웃
            mainContent.classList.add("visible"); // 본문 내용 페이드인
            document.body.style.overflowY = "auto"; // 잠가두었던 스크롤 활성화
        }
    }, 2200);

    // [3.4초 후] 애니메이션이 완전히 끝나면 무거워지지 않게 인트로 돔(DOM) 요소를 아예 제거
    setTimeout(() => {
        if (introOverlay) {
            introOverlay.style.display = "none";
        }
        // 첫 화면(Hero 타이틀 구역)의 순차 등장 애니메이션 강제 트리거
        triggerScrollReveal(); 
    }, 3400);


    // ==========================================
    // 2. MAIN: SCROLL SEQUENTIAL REVEAL INTERACTION (스크롤 순차 등장)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal-el");

    function triggerScrollReveal() {
        // 요소가 사용자의 뷰포트 하단 85% 지점을 통과할 때 등장하도록 설정
        const triggerBottom = window.innerHeight * 0.85; 

        revealElements.forEach((el) => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                if (!el.classList.contains("active")) {
                    
                    // 핵심 부모(제품 카드나 타이틀 박스)를 찾아 그 안의 자식 요소들 간의 순서 계산
                    const parentCard = el.closest('.product-card') || el.closest('.section-title-box');
                    if (parentCard) {
                        const siblings = Array.from(parentCard.querySelectorAll('.reveal-el'));
                        const elementIndex = siblings.indexOf(el);
                        
                        // 기본 자식 요소들은 0.12초 간격 순차 등장
                        let delayTime = elementIndex * 0.12;

                        // [특수 제어] 차량 바디와 그림자 레이어는 텍스트가 먼저 나오고 마지막에 치고 들어오도록 배치
                        if (el.classList.contains('part-body')) {
                            delayTime = 0.45; // 텍스트 라인업이 끝나는 시점에 강렬하게 난입
                        } else if (el.classList.contains('part-shadow')) {
                            delayTime = 0.50; // 바디보다 0.05초 미세하게 뒤처지며 바닥 마찰 궤적 연출
                        }
                        
                        el.style.transitionDelay = `${delayTime}s`;
                    }
                    
                    // active 클래스를 붙여 변경된 드리프트 궤적 CSS 트랜지션을 실행
                    el.classList.add("active");
                }
            }
        });
    }

    // 사용자가 스크롤을 할 때마다 위의 등장 조건을 실시간으로 체크
    window.addEventListener("scroll", triggerScrollReveal);
});