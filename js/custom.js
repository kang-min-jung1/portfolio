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
  // 4.붓에서나오는 폭죽
  gsap.set(".lines", { opacity: 0 });
  gsap.set(".textbox", { y: "30%", opacity: 1 });

  gsap.to(".linepink", { x: 60, y: 30, duration: 0.5, yoyo: true, repeat: -1 });
  gsap.to(".lineyellow", {
    x: 15,
    y: 12,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
  });
  gsap.to(".linewhite", { x: 20, y: 3, duration: 0.5, yoyo: true, repeat: -1 });
  gsap.to(".linesky", { x: 15, y: 0, duration: 0.5, yoyo: true, repeat: -1 });

  ScrollTrigger.create({
    trigger: "#about",
    start: "top 80%", // ★ 화면 중간쯤에서 실행
    end: "bottom top",
    onEnter: () => {
      let tl = gsap.timeline();
      tl.to(".lines", { opacity: 1, duration: 0.3 }).to(".textbox", {
        y: "0%",
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
      });
    },
    onLeaveBack: () => {
      gsap.to(".lines", { opacity: 0, duration: 0.3 });
      gsap.to(".textbox", { y: "30%", duration: 0.5 });
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
  // ==========================================
  // 5.벽화카드 (모바일 대응 로직 추가)
  // ==========================================
  const carousel = document.getElementById("carousel");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  // HTML에 카드가 이미 있다고 가정하고 가져옵니다.
  const cards = document.querySelectorAll(".card");
  const totalCards = cards.length;
  let currentIndex = 0;

  // 안전장치: 카드가 하나라도 있어야 실행
  if (totalCards > 0 && nextBtn && prevBtn) {
    function updateCarousel() {
      const isMobile = window.innerWidth <= 768; // ★ 모바일 체크 (768px 이하)

      const centerOffset = 220;
      const spreadStep = 300;

      cards.forEach((card, i) => {
        // 인덱스 계산
        let relativePos = (i - currentIndex + totalCards) % totalCards;
        if (relativePos >= totalCards / 2) relativePos -= totalCards;

        // 초기화
        card.style.filter = "none";
        card.style.opacity = 1;
        card.style.zIndex = 0;
        card.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";

        // --- 모바일 (768px 이하) 대응 로직 ---
        if (isMobile) {
          // 모바일에서는 3D 효과를 끄고, 현재 카드만 보여줌
          card.style.transform = "none"; // CSS의 transform: none; (3D 해제)를 따르게 함

          if (relativePos === 0) {
            // 주인공 카드: 중앙에 위치하며 보이게
            card.style.opacity = 1;
            card.style.zIndex = 100;
          } else {
            // 나머지 카드: 숨김 처리 (CSS에서 처리되지만 안전장치)
            card.style.opacity = 0;
            card.style.zIndex = 0;
          }
          return; // 모바일이면 3D 로직 실행하지 않고 종료
        }
        // --- PC (3D) 로직 ---

        // [CASE A] 오른쪽 메인 (현재 주인공 - 이미지 보임)
        if (relativePos === 0) {
          card.style.transform = `translateX(${centerOffset}px) translateZ(200px) rotateY(-10deg) rotateZ(3deg)`;
          card.style.zIndex = 100;
        }

        // [CASE B] 왼쪽 메인 (설명창 - 뒤집혀서 뒷면 보임)
        else if (relativePos === -1) {
          // HTML에 써놓은 뒷면이 보이도록 200도 회전
          card.style.transform = `translateX(-${centerOffset}px) translateZ(100px) rotateY(200deg) rotateZ(10deg)`;
          card.style.zIndex = 90;
        }

        // [CASE C] 오른쪽 배경
        else if (relativePos > 0) {
          const startX = centerOffset + 60;
          const x = startX + relativePos * spreadStep;
          const z = -relativePos * 300;
          const rY = -25 * relativePos;
          const rZ = 5 * relativePos;
          card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
          card.style.zIndex = 50 - relativePos;
        }

        // [CASE D] 왼쪽 배경
        else {
          const dist = Math.abs(relativePos) - 1;
          const startX = -centerOffset - 60;
          const x = startX - dist * spreadStep;
          const z = -dist * 300;
          const rY = 25 * (dist + 1);
          const rZ = -5 * (dist + 1);
          card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
          card.style.zIndex = 50 - dist;
        }

        // 너무 먼 카드 숨김
        if (Math.abs(relativePos) > 3) card.style.opacity = 0;
      });
    }

    // 버튼 이벤트
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });

    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    $(".array img").on("mouseenter", function () {
      const largeImageSrc = $(this).attr("data-large");

      // 현재 카드의 인덱스 찾기
      const currentCard = $(this).closest(".card");
      const currentIndex = Array.from(cards).indexOf(currentCard[0]);

      // 다음 카드 찾기 (원형 구조이므로 totalCards로 나눈 나머지)
      const nextIndex = (currentIndex + 1) % totalCards;
      const nextCard = $(cards[nextIndex]);

      // 다음 카드의 앞면 이미지 변경
      const nextCardImg = nextCard.find(".card-front img");

      if (largeImageSrc && nextCardImg.length) {
        nextCardImg.attr("src", largeImageSrc);
      }
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
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    // 버튼 클릭 시 자동 슬라이드 리셋
    nextBtn.addEventListener("click", startAutoSlide);
    prevBtn.addEventListener("click", startAutoSlide);

    // ⭐ 카드에 마우스 호버 시 자동 슬라이드 정지 ⭐
    cards.forEach((card) => {
      card.addEventListener("mouseenter", stopAutoSlide);
      card.addEventListener("mouseleave", startAutoSlide);
    });

    // 페이지 로드 시 자동 슬라이드 시작
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
        start: "top 20%",
        end: "top 50%",
        scrub: 2,
      },
    }
  );
  //고양이에서확대
  //고양이에서확대
  const portfolioReveal = document.querySelector(".portfolio-reveal-section");
  const portfolioSection = document.querySelector(
    "#portfolio.portfolio-with-transition"
  );
  const creativeSection = document.querySelector("#creative");
  const anchorIcon = document.querySelector(".portfolio-anchor-icon");

  if (portfolioReveal && portfolioSection) {
    // ⭐ creative 섹션 초기 숨김
    if (creativeSection) {
      gsap.set(creativeSection, {
        opacity: 0,
        visibility: "hidden",
      });
    }

    ScrollTrigger.create({
      trigger: portfolioReveal,
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: false,
      scrub: 1,

      onUpdate: (self) => {
        const progress = self.progress;

        // 🔴 1. 원 확대 애니메이션
        gsap.to(portfolioSection, {
          opacity: progress > 0 ? 1 : 0,
          clipPath: `circle(${progress * 150}% at 18% 70%)`,
          pointerEvents: progress > 0.8 ? "auto" : "none",
          duration: 0.1,
          overwrite: true,
        });

        // 🔴 2. 고양이 아이콘 사라짐
        if (anchorIcon) {
          gsap.to(anchorIcon, {
            scale: 1 - progress * 0.2,
            opacity: 1 - progress * 1.5,
            duration: 0.1,
            overwrite: true,
          });
        }
      },

      // ⭐ 애니메이션 완료 후
      onLeave: () => {
        // 고양이 섹션 숨기기
        gsap.set(portfolioReveal, {
          display: "none",
        });

        // #portfolio를 relative로 전환
        gsap.set(portfolioSection, {
          position: "relative",
          top: "auto",
          opacity: 1,
          clipPath: "circle(150% at 50% 50%)",
          pointerEvents: "auto",
        });

        // ⭐ creative 섹션 보이기
        if (creativeSection) {
          gsap.set(creativeSection, { visibility: "visible" });
          gsap.to(creativeSection, { opacity: 1, duration: 0.5 });
        }
      },

      onEnterBack: () => {
        // 고양이 섹션 다시 보이기
        gsap.set(portfolioReveal, {
          display: "flex",
        });

        // #portfolio를 다시 fixed로
        gsap.set(portfolioSection, {
          position: "fixed",
          top: "0",
          opacity: 1,
          pointerEvents: "none",
        });

        // ⭐ creative 섹션 숨기기
        if (creativeSection) {
          gsap.set(creativeSection, {
            opacity: 0,
            visibility: "hidden",
          });
        }
      },
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
