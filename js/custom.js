$(window).on("load", function () {
  // 1. 헤더 스크롤
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
      $("header").addClass("scrolled");
    } else {
      $("header").removeClass("scrolled");
    }
  });
  $("header li a").on("click", function (e) {
    e.preventDefault();
    let target = $(this).attr("href");
    if ($(target).length) {
      let offsetTop = $(target).offset().top;
      $("html, body").animate({ scrollTop: offsetTop }, 500);
    }
  });
  //마우스효과
  $(function () {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      gsap.to(cursor, {
        x: mouseX - 10,
        y: mouseY - 10,
        duration: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  });
  // 2. Red Heart
  if (document.querySelector(".redhot")) {
    gsap.fromTo(
      ".redhot",
      { opacity: 0, y: 50, scale: 0.2 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.5,
        onComplete: function () {
          gsap.to(".redhot", {
            y: "-=10",
            duration: 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
      }
    );
  }
  //GSAP ScrollTrigger 등록
  gsap.registerPlugin(ScrollTrigger);

  // 3. 붓든사진 - 다시 수정된 버전
  // 1. 이미지 등장
  gsap.fromTo(
    ".img-container",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".img-container",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // 2. #about 구간에서 고정 + 살짝 y 이동
  ScrollTrigger.create({
    trigger: "#about",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      gsap.to(".img-container", { y: 20 * self.progress, ease: "none" });
    },
  });

  // 3. #page3 구간 진입 시 서서히 사라지고 완전히 제거
  ScrollTrigger.create({
    trigger: "#page3",
    start: "top 80%",
    end: "top 20%",
    scrub: true,
    onEnter: () => {
      gsap.to(".img-container", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(".img-container", { display: "none" });
        },
      });
    },
    onLeaveBack: () => {
      gsap.set(".img-container", { display: "block" });
      gsap.to(".img-container", { opacity: 1, duration: 0.5 });
    },
  });
  // 4. #PORTFOLIO 고정
  ScrollTrigger.create({
    trigger: "#PORTFOLIO",
    start: "top top",
    end: "+=1000",
    pin: true,
    pinSpacing: true,
  });
  // 1. 초기 상태 설정 (JS 최상단에서 확실히 숨김)
  gsap.set(".lines", { opacity: 0 });
  gsap.set(".textbox", { y: "30%", opacity: 0 });

  // 2. 폭죽 애니메이션을 변수에 담아두고 처음엔 멈춰둠(paused: true)
  const pinkAni = gsap.to(".linepink", {
    x: 60,
    y: 30,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  const yellowAni = gsap.to(".lineyellow", {
    x: 15,
    y: 12,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  const whiteAni = gsap.to(".linewhite", {
    x: 20,
    y: 3,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  const skyAni = gsap.to(".linesky", {
    x: 15,
    y: 0,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    paused: true,
  });

  // 3. ScrollTrigger 설정
  ScrollTrigger.create({
    trigger: "#about",
    start: "top 20%", // 화면의 80% 지점에 #about이 보일 때 시작
    onEnter: () => {
      // 나타나는 애니메이션
      let tl = gsap.timeline();
      tl.to(".lines", { opacity: 1, duration: 0.3 }).to(".textbox", {
        y: "0%",
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
      });

      // 화면에 들어왔을 때만 폭죽 애니메이션 시작!
      pinkAni.play();
      yellowAni.play();
      whiteAni.play();
      skyAni.play();
    },
    onLeaveBack: () => {
      // 다시 위로 올리면 숨기고 애니메이션 멈춤
      gsap.to(".lines", { opacity: 0, duration: 0.3 });
      gsap.to(".textbox", { y: "30%", opacity: 0, duration: 0.5 });

      pinkAni.pause();
      yellowAni.pause();
      whiteAni.pause();
      skyAni.pause();
    },
  });
  gsap.to("#waterFill", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#page3",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });
  // 5. 벽화카드 (태블릿 간격 및 크기 최적화 버전)
  // ==========================================
  const carousel = document.getElementById("carousel");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const cards = document.querySelectorAll(".card");
  const totalCards = cards.length;
  let currentIndex = 0;

  if (totalCards > 0 && nextBtn && prevBtn) {
    function updateCarousel() {
      const winW = window.innerWidth;
      const isMobile = winW <= 768;
      const isTablet = winW <= 1024 && winW > 768; // 태블릿 판정

      if (isMobile) {
        let textCardIndex = (currentIndex - 1 + totalCards) % totalCards;

        cards.forEach((card, i) => {
          card.classList.remove("active-mobile");
          if (i === textCardIndex) {
            card.classList.add("active-mobile");
            const currentImgObj = card.querySelector(".card-front img");
            const imageCardIndex = (i + 1) % totalCards;
            const targetImgObj =
              cards[imageCardIndex].querySelector(".card-front img");

            if (currentImgObj && targetImgObj) {
              if (!currentImgObj.getAttribute("data-origin")) {
                currentImgObj.setAttribute(
                  "data-origin",
                  currentImgObj.getAttribute("src")
                );
              }
              if (!card.classList.contains("user-changed")) {
                currentImgObj.setAttribute(
                  "src",
                  targetImgObj.getAttribute("src")
                );
              }
            }
          } else {
            card.classList.remove("user-changed");
          }
        });
      } else {
        // === PC & 태블릿: 3D 회전 방식 ===

        // [수정 포인트] 태블릿일 때 간격을 확 줄입니다.
        const centerOffset = isTablet ? 160 : 220; // 중앙 카드 위치 (220 -> 120)
        const spreadStep = isTablet ? 250 : 300; // 카드 사이 간격 (300 -> 200)
        const zDepth = isTablet ? 150 : 300; // 뒤로 들어가는 깊이 (300 -> 150)

        cards.forEach((card, i) => {
          card.classList.remove("active-mobile");
          card.classList.remove("user-changed");

          const originSrc = card
            .querySelector(".card-front img")
            .getAttribute("data-origin");
          if (originSrc) {
            card
              .querySelector(".card-front img")
              .setAttribute("src", originSrc);
          }

          let relativePos = (i - currentIndex + totalCards) % totalCards;
          if (relativePos >= totalCards / 2) relativePos -= totalCards;

          card.style.filter = "none";
          card.style.opacity = 1;
          card.style.zIndex = 0;
          card.style.position = "absolute";
          card.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";

          if (relativePos === 0) {
            // 현재 중앙 카드
            card.style.transform = `translateX(${centerOffset}px) translateZ(200px) rotateY(-10deg) rotateZ(3deg)`;
            card.style.zIndex = 100;
          } else if (relativePos === -1) {
            // 왼쪽으로 넘어간 카드
            card.style.transform = `translateX(-${centerOffset}px) translateZ(100px) rotateY(200deg) rotateZ(10deg)`;
            card.style.zIndex = 90;
          } else if (relativePos > 0) {
            // 오른쪽 대기 카드들
            const startX = centerOffset + (isTablet ? 40 : 60);
            const x = startX + relativePos * spreadStep;
            const z = -relativePos * zDepth;
            const rY = -25 * relativePos;
            const rZ = 5 * relativePos;
            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
            card.style.zIndex = 50 - relativePos;
          } else {
            // 왼쪽 대기 카드들
            const dist = Math.abs(relativePos) - 1;
            const startX = -centerOffset - (isTablet ? 40 : 60);
            const x = startX - dist * spreadStep;
            const z = -dist * zDepth;
            const rY = 25 * (dist + 1);
            const rZ = -5 * (dist + 1);
            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
            card.style.zIndex = 50 - dist;
          }
          if (Math.abs(relativePos) > 3) card.style.opacity = 0;
        });
      }
    }

    // [나머지 이벤트 리스너들은 기존과 동일]
    $(".array img").on("click touchstart mouseenter", function (e) {
      const isMobile = window.innerWidth <= 768;
      const largeImageSrc = $(this).attr("data-large");
      const currentCard = $(this).closest(".card");

      if (isMobile) {
        const cardImg = currentCard.find(".card-front img");
        if (largeImageSrc && cardImg.length) {
          cardImg.attr("src", largeImageSrc);
          currentCard.addClass("user-changed");
        }
      } else {
        if (e.type === "mouseenter") {
          const currentCardIndex = Array.from(cards).indexOf(currentCard[0]);
          const nextIndex = (currentCardIndex + 1) % totalCards;
          const nextCard = $(cards[nextIndex]);
          const nextCardImg = nextCard.find(".card-front img");
          if (largeImageSrc && nextCardImg.length) {
            nextCardImg.attr("src", largeImageSrc);
          }
        }
      }
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });

    const intervalTime = 3000;
    let autoSlideInterval;
    function startAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        nextBtn.click();
      }, intervalTime);
    }
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }

    nextBtn.addEventListener("click", startAutoSlide);
    prevBtn.addEventListener("click", startAutoSlide);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", stopAutoSlide);
      card.addEventListener("mouseleave", startAutoSlide);
    });

    updateCarousel();
    window.addEventListener("resize", () => {
      setTimeout(updateCarousel, 100);
    });
    startAutoSlide();
  }
  // 🔥 4. 텍스트 페이드 인/아웃 애니메이션
  gsap.fromTo(
    ".text-inner",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 4,
      scrollTrigger: {
        trigger: "#page3",
        start: "top 50%",
        end: "top 50%",
        scrub: 2,
      },
    }
  );

  // 고양이에서 확대 및 포트폴리오 섹션 관련 코드
  const portfolioReveal = document.querySelector(".portfolio-reveal-section");
  const portfolioSection = document.querySelector(
    "#portfolio.portfolio-with-transition"
  );
  const creativeSection = document.querySelector("#creative");
  const anchorIcon = document.querySelector(".portfolio-anchor-icon");

  // GSAP MatchMedia 생성
  let mm = gsap.matchMedia();

  if (portfolioReveal && portfolioSection) {
    // ✅ 1. PC 버전 (화면 너비가 768px 이상일 때만 애니메이션 적용)
    mm.add("(min-width: 768px)", () => {
      // PC 초기 설정: creative 섹션 숨기기
      if (creativeSection) {
        gsap.set(creativeSection, {
          opacity: 0,
          visibility: "hidden",
        });
      }

      // PC용 ScrollTrigger 애니메이션
      ScrollTrigger.create({
        trigger: portfolioReveal,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: false, // 모바일에서 자연스럽게 넘어가려면 false가 나을 수 있음 (상황에 따라 true)
        scrub: 1,

        onUpdate: (self) => {
          const progress = self.progress;

          // 원 확대 애니메이션
          gsap.to(portfolioSection, {
            opacity: progress > 0 ? 1 : 0,
            clipPath: `circle(${progress * 150}% at 18% 70%)`,
            pointerEvents: progress > 0.8 ? "auto" : "none",
            duration: 0.1,
            overwrite: true,
          });

          // 고양이 아이콘 사라짐
          if (anchorIcon) {
            gsap.to(anchorIcon, {
              scale: 1 - progress * 0.2,
              opacity: 1 - progress * 1.5,
              duration: 0.1,
              overwrite: true,
            });
          }
        },

        onLeave: () => {
          // 애니메이션 끝난 후 PC 스타일 고정
          gsap.set(portfolioReveal, { display: "none" });
          gsap.set(portfolioSection, {
            position: "relative",
            top: "auto",
            opacity: 1,
            clipPath: "circle(150% at 50% 50%)", // 완전히 열린 상태
            pointerEvents: "auto",
          });
          if (creativeSection) {
            gsap.set(creativeSection, { visibility: "visible" });
            gsap.to(creativeSection, { opacity: 1, duration: 0.5 });
          }
        },

        onEnterBack: () => {
          // 뒤로 스크롤 시 PC 스타일 복귀
          gsap.set(portfolioReveal, { display: "flex" });
          gsap.set(portfolioSection, {
            position: "fixed",
            top: "0",
            opacity: 1,
            pointerEvents: "none",
          });
          if (creativeSection) {
            gsap.set(creativeSection, { opacity: 0, visibility: "hidden" });
          }
        },
      });
    });

    // ✅ 2. 모바일 버전 (화면 너비가 768px 미만일 때)
    mm.add("(max-width: 767px)", () => {
      // 모바일에서는 애니메이션 없이 그냥 보이도록 강제 설정

      // 고양이 섹션(Reveal)은 모바일 디자인에 따라 숨기거나 그냥 둠 (여기선 숨김 예시)
      // 만약 고양이 아이콘도 그냥 스크롤로 지나가게 하려면 display: block으로 두세요.
      gsap.set(portfolioReveal, {
        display: "block", // 혹은 디자인에 따라 "none" 처리
        position: "relative",
      });

      // 포트폴리오 섹션: 고정(fixed) 풀고, 마스크(clipPath) 제거하고, 그냥 보이게 함
      gsap.set(portfolioSection, {
        position: "relative",
        top: "auto",
        opacity: 1,
        clipPath: "none", // 원형 마스크 제거 (전체 다 보임)
        pointerEvents: "auto",
        visibility: "visible",
      });

      // Creative 섹션도 바로 보이게
      if (creativeSection) {
        gsap.set(creativeSection, {
          opacity: 1,
          visibility: "visible",
          position: "relative",
        });
      }
    });
  }

  // ==========================================
  // 6. 포트폴리오 아코디언
  // ==========================================
  const portfolioItems = $(".portfolio-item");
  const portfolioContainer = $(".portfolio-container");

  // 초기 설정: 모든 detail-layer를 숨김
  $(".portfolio-item .detail-layer").hide();

  portfolioItems.on("click", function () {
    const clickedItem = $(this);

    // 1. 이미 활성화된 항목을 다시 클릭한 경우: 닫기 (초기 상태로 복귀)
    if (clickedItem.hasClass("active")) {
      clickedItem.removeClass("active");
      portfolioContainer.removeClass("expand-mode");
      clickedItem.find(".detail-layer").stop().fadeOut(300); // 디테일 숨김
      return;
    }

    // 2. 다른 항목을 클릭한 경우: 기존 항목 닫기
    portfolioItems.removeClass("active");
    portfolioItems.find(".detail-layer").stop().fadeOut(300); // 모두 숨김

    // 3. 현재 항목 열기
    clickedItem.addClass("active"); // 현재 클릭한 것만 활성화
    clickedItem.find(".detail-layer").stop().fadeIn(500); // 디테일 보이기

    // 4. 컨테이너에 모드 추가 (나머지 녀석들을 찌그러뜨리기 위해)
    portfolioContainer.addClass("expand-mode");
  });
  /* --- 5. 마우스 커서 효과 --- */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    gsap.to(cursorOutline, {
      x: posX,
      y: posY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  $("a, .art-item").hover(
    function () {
      $("body").addClass("hovered");
    },
    function () {
      $("body").removeClass("hovered");
    }
  );

  /* ==========================================
     contact (수정됨: 중첩 이벤트 리스너 제거)
     ========================================== */
  const target = document.querySelector(".contact-txt");
  const arrow = document.querySelector(".growing-arrow");
  const semicircleContainer = document.querySelector(".semicircle-container");
  const textLineOne = document.querySelector(".one");
  const textLineTwo = document.querySelector(".two");
  const textReveals = document.querySelectorAll(".text-reveal");

  if (target && arrow && semicircleContainer && textLineOne && textLineTwo) {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 텍스트가 먼저 올라오며 나타남
          textReveals.forEach((text, index) => {
            setTimeout(() => {
              text.classList.add("active");
            }, index * 500);
          });

          // 반원이 쑥 올라옴 (0.2초 후)
          setTimeout(() => {
            semicircleContainer.classList.add("active");
            textLineOne.classList.add("active");
          }, 1000);

          // 화살표는 0.5초 후에 나타남
          setTimeout(() => {
            arrow.classList.add("active");
            textLineTwo.classList.add("active");
          }, 1000);

          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(target);
  }
});
