/* =========================================================
   JAY PATHARKAR — VIDEO EDITOR PORTFOLIO
   PERFORMANCE + VIDEO HOVER + CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. CUSTOM CURSOR
  ========================================================= */

  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");

  if (cursor && cursorDot && window.matchMedia("(pointer:fine)").matches) {

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }


  /* =========================================================
     2. HERO BACKGROUND VIDEO SWITCHING
  ========================================================= */

  const heroVideos = document.querySelectorAll(".bg-video");
  const styleSections = document.querySelectorAll("[data-bg-target]");

  function activateHeroVideo(target) {

    heroVideos.forEach(video => {

      if (video.dataset.bg === target) {

        video.classList.add("active");

        if (video.paused) {
          video.play().catch(() => {});
        }

      } else {

        video.classList.remove("active");
        video.pause();

      }

    });

  }

  styleSections.forEach(section => {

    section.addEventListener("mouseenter", () => {

      const target = section.dataset.bgTarget;

      if (target) {
        activateHeroVideo(target);
      }

    });

  });


  /* =========================================================
     3. PORTFOLIO VIDEOS
     
     Desktop:
     HOVER → PLAY
     LEAVE → PAUSE

     Mobile:
     TAP → PLAY / PAUSE
  ========================================================= */

  const portfolioVideos = document.querySelectorAll(
    ".cinematic-video video, " +
    ".mini-video video, " +
    ".video-card video, " +
    ".feature-video video"
  );

  let audioUnlocked = false;


  /* =========================================================
     AUDIO UNLOCK
  ========================================================= */

  function unlockAudio() {

    audioUnlocked = true;

    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
  }

  document.addEventListener("click", unlockAudio, {
    passive: true
  });

  document.addEventListener("keydown", unlockAudio);

  document.addEventListener("touchstart", unlockAudio, {
    passive: true
  });


  /* =========================================================
     STOP OTHER VIDEOS
  ========================================================= */

  function stopOtherVideos(currentVideo) {

    portfolioVideos.forEach(otherVideo => {

      if (otherVideo !== currentVideo) {

        otherVideo.pause();
        otherVideo.muted = true;

        const otherCard = otherVideo.closest(
          ".cinematic-video, .mini-video, .video-card, .feature-video"
        );

        if (otherCard) {
          otherCard.classList.remove("is-playing");

          const otherPlayBtn =
            otherCard.querySelector(".play-btn");

          if (otherPlayBtn) {
            otherPlayBtn.classList.remove("playing");
          }

          const otherSoundBtn =
            otherCard.querySelector(".sound-btn");

          if (otherSoundBtn) {
            otherSoundBtn.textContent = "🔇";
          }
        }
      }

    });

  }


  /* =========================================================
     PLAY VIDEO
  ========================================================= */

  async function playVideo(video, card) {

    stopOtherVideos(video);

    try {

      if (audioUnlocked) {
        video.muted = false;
      } else {
        video.muted = true;
      }

      await video.play();

      card.classList.add("is-playing");

      const playBtn =
        card.querySelector(".play-btn");

      if (playBtn) {
        playBtn.classList.add("playing");
      }

      const soundBtn =
        card.querySelector(".sound-btn");

      if (soundBtn) {
        soundBtn.textContent =
          video.muted ? "🔇" : "🔊";
      }

    } catch (error) {

      /*
        Browser may block autoplay with sound.
        Retry muted.
      */

      video.muted = true;

      try {

        await video.play();

        card.classList.add("is-playing");

        const playBtn =
          card.querySelector(".play-btn");

        if (playBtn) {
          playBtn.classList.add("playing");
        }

      } catch (e) {

        console.log(
          "Video could not be played:",
          video.src
        );

      }

    }

  }


  /* =========================================================
     PAUSE VIDEO
  ========================================================= */

  function pauseVideo(video, card) {

    video.pause();
    video.muted = true;

    card.classList.remove("is-playing");

    const playBtn =
      card.querySelector(".play-btn");

    if (playBtn) {
      playBtn.classList.remove("playing");
    }

    const soundBtn =
      card.querySelector(".sound-btn");

    if (soundBtn) {
      soundBtn.textContent = "🔇";
    }

  }


  /* =========================================================
     SETUP EACH VIDEO
  ========================================================= */

  portfolioVideos.forEach(video => {

    const card = video.closest(
      ".cinematic-video, .mini-video, .video-card, .feature-video"
    );

    if (!card) return;


    /* -------------------------------------------------------
       DESKTOP HOVER
    ------------------------------------------------------- */

    card.addEventListener("mouseenter", () => {

      if (window.matchMedia("(pointer:fine)").matches) {

        playVideo(video, card);

      }

    });


    card.addEventListener("mouseleave", () => {

      if (window.matchMedia("(pointer:fine)").matches) {

        pauseVideo(video, card);

      }

    });


    /* -------------------------------------------------------
       PLAY BUTTON
    ------------------------------------------------------- */

    const playBtn =
      card.querySelector(".play-btn");

    if (playBtn) {

      playBtn.addEventListener("click", async (event) => {

        event.preventDefault();
        event.stopPropagation();

        audioUnlocked = true;

        if (video.paused) {

          await playVideo(video, card);

        } else {

          pauseVideo(video, card);

        }

      });

    }


    /* -------------------------------------------------------
       SOUND BUTTON
    ------------------------------------------------------- */

    const soundBtn =
      card.querySelector(".sound-btn");

    if (soundBtn) {

      soundBtn.addEventListener("click", async (event) => {

        event.preventDefault();
        event.stopPropagation();

        audioUnlocked = true;

        if (video.paused) {

          await playVideo(video, card);

        }

        video.muted = !video.muted;

        soundBtn.textContent =
          video.muted ? "🔇" : "🔊";

      });

    }


    /* -------------------------------------------------------
       MOBILE TAP
    ------------------------------------------------------- */

    let lastTouchTime = 0;

    card.addEventListener("touchend", async (event) => {

      const now = Date.now();

      /*
        Prevent double firing.
      */

      if (now - lastTouchTime < 400) {
        return;
      }

      lastTouchTime = now;

      /*
        Ignore taps on buttons.
      */

      if (
        event.target.closest(".play-btn") ||
        event.target.closest(".sound-btn")
      ) {
        return;
      }

      audioUnlocked = true;

      if (video.paused) {

        await playVideo(video, card);

      } else {

        pauseVideo(video, card);

      }

    }, {
      passive: true
    });


    /* -------------------------------------------------------
       VIDEO ERROR
    ------------------------------------------------------- */

    video.addEventListener("error", () => {

      console.warn(
        "Video failed to load:",
        video.getAttribute("src")
      );

    });


    /* -------------------------------------------------------
       VIDEO CAN PLAY
    ------------------------------------------------------- */

    video.addEventListener("canplay", () => {

      video.classList.add("video-ready");

    });

  });


  /* =========================================================
     4. VISIBILITY CHANGE
  ========================================================= */

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

      portfolioVideos.forEach(video => {

        video.pause();
        video.muted = true;

      });

    }

  });


  /* =========================================================
     5. INTERSECTION OBSERVER
     
     Pause videos when they are far outside viewport.
  ========================================================= */

  if ("IntersectionObserver" in window) {

    const videoObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            const video = entry.target;

            if (!entry.isIntersecting) {

              video.pause();
              video.muted = true;

              const card = video.closest(
                ".cinematic-video, .mini-video, .video-card, .feature-video"
              );

              if (card) {

                card.classList.remove("is-playing");

                const playBtn =
                  card.querySelector(".play-btn");

                if (playBtn) {
                  playBtn.classList.remove("playing");
                }

              }

            }

          });

        },
        {
          rootMargin: "150px",
          threshold: 0.05
        }
      );


    portfolioVideos.forEach(video => {

      videoObserver.observe(video);

    });

  }


  /* =========================================================
     6. CAROUSEL
     
     WORKS WITH:
       .carousel-track
       .carousel-card
       .carousel-prev
       .carousel-next
       .carousel-dot
  ========================================================= */

  const carouselSections =
    document.querySelectorAll(".carousel-section");


  carouselSections.forEach(section => {

    const track =
      section.querySelector(".carousel-track");

    const cards =
      section.querySelectorAll(".carousel-card");

    const prevBtn =
      section.querySelector(".carousel-prev");

    const nextBtn =
      section.querySelector(".carousel-next");

    const dots =
      section.querySelectorAll(".carousel-dot");


    if (!track || cards.length === 0) {
      return;
    }


    let currentIndex = 0;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    let startTime = 0;


    /* =======================================================
       GET SLIDE WIDTH
    ======================================================= */

    function getSlideWidth() {

      if (cards.length === 0) {
        return 0;
      }

      const card =
        cards[0];

      const cardWidth =
        card.getBoundingClientRect().width;

      const styles =
        window.getComputedStyle(track);

      const gap =
        parseFloat(styles.gap) || 0;

      return cardWidth + gap;

    }


    /* =======================================================
       UPDATE CAROUSEL
    ======================================================= */

    function updateCarousel(animate = true) {

      const slideWidth =
        getSlideWidth();

      if (!slideWidth) {
        return;
      }

      track.style.transition =
        animate
          ? "transform 0.55s cubic-bezier(.22,.61,.36,1)"
          : "none";

      track.style.transform =
        `translate3d(-${currentIndex * slideWidth}px, 0, 0)`;


      /* -------------------------------------------------------
         UPDATE DOTS
      ------------------------------------------------------- */

      dots.forEach((dot, index) => {

        dot.classList.toggle(
          "active",
          index === currentIndex
        );

      });


      /* -------------------------------------------------------
         BUTTON STATE
      ------------------------------------------------------- */

      if (prevBtn) {
        prevBtn.disabled =
          currentIndex === 0;
      }

      if (nextBtn) {
        nextBtn.disabled =
          currentIndex >= cards.length - 1;
      }

    }


    /* =======================================================
       NEXT
    ======================================================= */

    function nextSlide() {

      if (currentIndex < cards.length - 1) {

        currentIndex++;

      } else {

        /*
          Loop back to first slide.
        */

        currentIndex = 0;

      }

      updateCarousel();

    }


    /* =======================================================
       PREVIOUS
    ======================================================= */

    function previousSlide() {

      if (currentIndex > 0) {

        currentIndex--;

      } else {

        /*
          Loop to last slide.
        */

        currentIndex = cards.length - 1;

      }

      updateCarousel();

    }


    /* =======================================================
       BUTTONS
    ======================================================= */

    if (nextBtn) {

      nextBtn.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        nextSlide();

      });

    }


    if (prevBtn) {

      prevBtn.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        previousSlide();

      });

    }


    /* =======================================================
       DOT NAVIGATION
    ======================================================= */

    dots.forEach((dot, index) => {

      dot.addEventListener("click", event => {

        event.preventDefault();

        currentIndex = index;

        updateCarousel();

      });

    });


    /* =======================================================
       TOUCH SWIPE
    ======================================================= */

    track.addEventListener(
      "touchstart",
      event => {

        if (!event.touches.length) {
          return;
        }

        startX =
          event.touches[0].clientX;

        currentX = startX;

        startTime = Date.now();

        isDragging = true;

        track.style.transition = "none";

      },
      {
        passive: true
      }
    );


    track.addEventListener(
      "touchmove",
      event => {

        if (!isDragging || !event.touches.length) {
          return;
        }

        currentX =
          event.touches[0].clientX;

        const difference =
          currentX - startX;

        const slideWidth =
          getSlideWidth();

        if (!slideWidth) {
          return;
        }

        const baseOffset =
          -(currentIndex * slideWidth);

        /*
          Follow the finger while dragging.
        */

        track.style.transform =
          `translate3d(${baseOffset + difference}px, 0, 0)`;

      },
      {
        passive: true
      }
    );


    track.addEventListener(
      "touchend",
      () => {

        if (!isDragging) {
          return;
        }

        isDragging = false;

        const difference =
          currentX - startX;

        const elapsed =
          Date.now() - startTime;

        const velocity =
          Math.abs(difference) /
          Math.max(elapsed, 1);

        /*
          Normal swipe:
          50px minimum.

          Fast swipe:
          smaller distance accepted.
        */

        const swipeThreshold =
          velocity > 0.5
            ? 25
            : 50;


        if (Math.abs(difference) > swipeThreshold) {

          if (difference < 0) {

            nextSlide();

          } else {

            previousSlide();

          }

        } else {

          updateCarousel();

        }

      }
    );


    /* =======================================================
       MOUSE DRAG
       Useful for desktop.
    ======================================================= */

    track.addEventListener(
      "mousedown",
      event => {

        if (event.button !== 0) {
          return;
        }

        isDragging = true;

        startX =
          event.clientX;

        currentX =
          startX;

        startTime =
          Date.now();

        track.style.transition = "none";

        track.classList.add("dragging");

      }
    );


    window.addEventListener(
      "mousemove",
      event => {

        if (!isDragging) {
          return;
        }

        currentX =
          event.clientX;

        const difference =
          currentX - startX;

        const slideWidth =
          getSlideWidth();

        if (!slideWidth) {
          return;
        }

        const baseOffset =
          -(currentIndex * slideWidth);

        track.style.transform =
          `translate3d(${baseOffset + difference}px, 0, 0)`;

      }
    );


    window.addEventListener(
      "mouseup",
      () => {

        if (!isDragging) {
          return;
        }

        isDragging = false;

        track.classList.remove("dragging");

        const difference =
          currentX - startX;

        const elapsed =
          Date.now() - startTime;

        const velocity =
          Math.abs(difference) /
          Math.max(elapsed, 1);

        const swipeThreshold =
          velocity > 0.5
            ? 25
            : 60;


        if (Math.abs(difference) > swipeThreshold) {

          if (difference < 0) {

            nextSlide();

          } else {

            previousSlide();

          }

        } else {

          updateCarousel();

        }

      }
    );


    /* =======================================================
       PREVENT IMAGE DRAGGING
    ======================================================= */

    const images =
      section.querySelectorAll(".carousel-card img");

    images.forEach(img => {

      img.setAttribute(
        "draggable",
        "false"
      );

      img.addEventListener(
        "dragstart",
        event => {
          event.preventDefault();
        }
      );

    });


    /* =======================================================
       RESIZE
    ======================================================= */

    let resizeTimer;

    window.addEventListener("resize", () => {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(() => {

          updateCarousel(false);

        }, 120);

    });


    /* =======================================================
       INITIALIZE
    ======================================================= */

    updateCarousel(false);

  });


  /* =========================================================
     7. MAGNETIC BUTTON
  ========================================================= */

  const magneticButtons =
    document.querySelectorAll(".magnetic");


  magneticButtons.forEach(button => {

    button.addEventListener("mousemove", event => {

      if (!window.matchMedia("(pointer:fine)").matches) {
        return;
      }

      const rect =
        button.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      button.style.transform =
        `translate(${x * 0.15}px, ${y * 0.15}px)`;

    });


    button.addEventListener("mouseleave", () => {

      button.style.transform = "";

    });

  });


  /* =========================================================
     8. REVEAL ANIMATIONS
  ========================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .style-section, .future-section"
    );


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("show");

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(element => {

      element.classList.add("show");

    });

  }


  /* =========================================================
     9. VIDEO CARD HOVER CLASS
  ========================================================= */

  const cards =
    document.querySelectorAll(
      ".cinematic-video, .mini-video, .video-card, .feature-video"
    );


  cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

      card.classList.add("is-hovered");

    });


    card.addEventListener("mouseleave", () => {

      card.classList.remove("is-hovered");

    });

  });


  /* =========================================================
     10. PAGE EXIT
  ========================================================= */

  window.addEventListener("beforeunload", () => {

    portfolioVideos.forEach(video => {

      video.pause();
      video.muted = true;

    });

  });

});