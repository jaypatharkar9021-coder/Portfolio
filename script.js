/* =========================================================
   JAY PATHARKAR — PREMIUM VIDEO PORTFOLIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* =====================================================
     CUSTOM CURSOR
  ===================================================== */

  const cursor =
    document.querySelector(".cursor");

  const cursorDot =
    document.querySelector(".cursor-dot");


  if (cursor && cursorDot) {

    document.addEventListener(
      "mousemove",
      (e) => {

        cursor.style.left =
          `${e.clientX}px`;

        cursor.style.top =
          `${e.clientY}px`;


        cursorDot.style.left =
          `${e.clientX}px`;

        cursorDot.style.top =
          `${e.clientY}px`;

      }
    );

  }



  /* =====================================================
     HERO BACKGROUND VIDEOS
  ===================================================== */

  const heroVideos =
    document.querySelectorAll(
      ".bg-video"
    );


  const styleSections =
    document.querySelectorAll(
      "[data-bg-target]"
    );


  function activateHeroVideo(target) {

    heroVideos.forEach(video => {

      if (
        video.dataset.bg === target
      ) {

        video.classList.add(
          "active"
        );

        video.play().catch(() => {});

      } else {

        video.classList.remove(
          "active"
        );

        video.pause();

      }

    });

  }


  styleSections.forEach(section => {

    section.addEventListener(
      "mouseenter",
      () => {

        const target =
          section.dataset.bgTarget;

        if (target) {

          activateHeroVideo(
            target
          );

        }

      }
    );

  });



  /* =====================================================
     ALL PORTFOLIO VIDEOS
  ===================================================== */

  const portfolioVideos =
    document.querySelectorAll(
      ".video-card video, " +
      ".character-media video"
    );


  let audioUnlocked = false;



  /* =====================================================
     USER INTERACTION
  ===================================================== */

  function unlockAudio() {

    audioUnlocked = true;

    document.removeEventListener(
      "click",
      unlockAudio
    );

    document.removeEventListener(
      "keydown",
      unlockAudio
    );

    document.removeEventListener(
      "touchstart",
      unlockAudio
    );

  }


  document.addEventListener(
    "click",
    unlockAudio
  );

  document.addEventListener(
    "keydown",
    unlockAudio
  );

  document.addEventListener(
    "touchstart",
    unlockAudio
  );



  /* =====================================================
     FIND VIDEO CARD
  ===================================================== */

  function getContainer(video) {

    return video.closest(
      ".video-card, .character-media"
    );

  }



  /* =====================================================
     PLAY / PAUSE ICON
  ===================================================== */

  function updatePlayIcon(video) {

    const container =
      getContainer(video);

    if (!container) return;


    const button =
      container.querySelector(
        ".play-btn"
      );

    if (!button) return;


    if (video.paused) {

      button.classList.remove(
        "playing"
      );

      button.setAttribute(
        "aria-label",
        "Play video"
      );

    } else {

      button.classList.add(
        "playing"
      );

      button.setAttribute(
        "aria-label",
        "Pause video"
      );

    }

  }



  /* =====================================================
     UPDATE SOUND ICON
  ===================================================== */

  function updateSoundIcon(video) {

    const container =
      getContainer(video);

    if (!container) return;


    const soundButton =
      container.querySelector(
        ".sound-btn"
      );

    if (!soundButton) return;


    soundButton.textContent =
      video.muted
        ? "🔇"
        : "🔊";

  }



  /* =====================================================
     STOP OTHER VIDEOS
  ===================================================== */

  function stopOtherVideos(
    currentVideo
  ) {

    portfolioVideos.forEach(
      video => {

        if (
          video !== currentVideo
        ) {

          video.pause();

          video.muted = true;

          updatePlayIcon(
            video
          );

          updateSoundIcon(
            video
          );

        }

      }
    );

  }



  /* =====================================================
     PLAY VIDEO
  ===================================================== */

  async function playVideo(
    video,
    withSound = false
  ) {

    stopOtherVideos(video);


    /*
      Desktop hover:

      After the user has interacted
      with the page, attempt original audio.
    */

    if (
      withSound &&
      audioUnlocked
    ) {

      video.muted = false;

    } else {

      video.muted = true;

    }


    try {

      await video.play();

    } catch (error) {

      /*
        Browser may block autoplay
        with sound.

        Fall back to muted.
      */

      video.muted = true;

      try {

        await video.play();

      } catch (e) {

        console.log(
          "Unable to play video."
        );

      }

    }


    updatePlayIcon(video);

    updateSoundIcon(video);

  }



  /* =====================================================
     PORTFOLIO VIDEO EVENTS
  ===================================================== */

  portfolioVideos.forEach(
    video => {

      const container =
        getContainer(video);

      if (!container) return;


      const playButton =
        container.querySelector(
          ".play-btn"
        );


      const soundButton =
        container.querySelector(
          ".sound-btn"
        );


      /*
        Initial state
      */

      video.muted = true;

      updatePlayIcon(video);

      updateSoundIcon(video);



      /* =================================================
         VIDEO EVENTS
      ================================================= */

      video.addEventListener(
        "play",
        () => {

          updatePlayIcon(video);

        }
      );


      video.addEventListener(
        "pause",
        () => {

          updatePlayIcon(video);

        }
      );



      /* =================================================
         DESKTOP HOVER ENTER

         Cursor enters video:
         → video plays
         → original audio attempted
      ================================================= */

      container.addEventListener(
        "mouseenter",
        async () => {

          await playVideo(
            video,
            true
          );

        }
      );



      /* =================================================
         DESKTOP HOVER LEAVE

         Cursor leaves:
         → video pauses
         → sound stops
      ================================================= */

      container.addEventListener(
        "mouseleave",
        () => {

          video.pause();

          video.muted = true;

          updatePlayIcon(
            video
          );

          updateSoundIcon(
            video
          );

        }
      );



      /* =================================================
         PLAY / PAUSE BUTTON
      ================================================= */

      if (playButton) {

        playButton.addEventListener(
          "click",
          async (e) => {

            e.stopPropagation();

            audioUnlocked = true;


            if (
              video.paused
            ) {

              await playVideo(
                video,
                true
              );

            } else {

              video.pause();

              video.muted = true;

              updatePlayIcon(
                video
              );

              updateSoundIcon(
                video
              );

            }

          }
        );

      }



      /* =================================================
         SOUND BUTTON
      ================================================= */

      if (soundButton) {

        soundButton.addEventListener(
          "click",
          async (e) => {

            e.stopPropagation();

            audioUnlocked = true;


            if (
              video.paused
            ) {

              await playVideo(
                video,
                true
              );

            } else {

              video.muted =
                !video.muted;

              updateSoundIcon(
                video
              );

            }

          }
        );

      }



      /* =================================================
         MOBILE TOUCH
      ================================================= */

      container.addEventListener(
        "touchstart",
        async () => {

          audioUnlocked = true;


          if (
            video.paused
          ) {

            await playVideo(
              video,
              true
            );

          } else {

            video.pause();

            video.muted = true;

            updatePlayIcon(
              video
            );

            updateSoundIcon(
              video
            );

          }

        },
        {
          passive: true
        }
      );

    }
  );



  /* =====================================================
     PAGE VISIBILITY
  ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        portfolioVideos.forEach(
          video => {

            video.pause();

            video.muted = true;

            updatePlayIcon(
              video
            );

            updateSoundIcon(
              video
            );

          }
        );

      }

    }
  );



  /* =====================================================
     INTERSECTION OBSERVER
  ===================================================== */

  const videoObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            const video =
              entry.target;


            if (
              !entry.isIntersecting
            ) {

              video.pause();

              video.muted = true;

              updatePlayIcon(
                video
              );

              updateSoundIcon(
                video
              );

            }

          }
        );

      },
      {
        threshold: 0.15
      }
    );


  portfolioVideos.forEach(
    video => {

      videoObserver.observe(
        video
      );

    }
  );



  /* =====================================================
     MAGNETIC BUTTON
  ===================================================== */

  const magneticButtons =
    document.querySelectorAll(
      ".magnetic"
    );


  magneticButtons.forEach(
    button => {

      button.addEventListener(
        "mousemove",
        e => {

          const rect =
            button.getBoundingClientRect();


          const x =
            e.clientX -
            rect.left -
            rect.width / 2;


          const y =
            e.clientY -
            rect.top -
            rect.height / 2;


          button.style.transform =
            `translate(
              ${x * 0.15}px,
              ${y * 0.15}px
            )`;

        }
      );


      button.addEventListener(
        "mouseleave",
        () => {

          button.style.transform =
            "";

        }
      );

    }
  );



  /* =====================================================
     REVEAL ANIMATION
  ===================================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .style-section"
    );


  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "show"
              );

            }

          }
        );

      },
      {
        threshold: 0.08
      }
    );


  revealElements.forEach(
    element => {

      revealObserver.observe(
        element
      );

    }
  );



  /* =====================================================
     CAROUSELS
  ===================================================== */

  const carouselCards =
    document.querySelectorAll(
      ".carousel-card"
    );


  carouselCards.forEach(
    card => {

      const track =
        card.querySelector(
          ".carousel-track"
        );


      const slides =
        card.querySelectorAll(
          ".carousel-track img"
        );


      const previous =
        card.querySelector(
          ".carousel-prev"
        );


      const next =
        card.querySelector(
          ".carousel-next"
        );


      const dotsContainer =
        card.querySelector(
          ".carousel-dots"
        );


      if (
        !track ||
        slides.length === 0
      ) {
        return;
      }


      let currentSlide = 0;


      /* -----------------------------------------------
         CREATE DOTS
      ----------------------------------------------- */

      slides.forEach(
        (_, index) => {

          const dot =
            document.createElement(
              "span"
            );

          dot.className =
            "carousel-dot";


          if (
            index === 0
          ) {

            dot.classList.add(
              "active"
            );

          }


          dot.addEventListener(
            "click",
            e => {

              e.stopPropagation();

              currentSlide =
                index;

              updateCarousel();

            }
          );


          dotsContainer.appendChild(
            dot
          );

        }
      );


      const dots =
        dotsContainer.querySelectorAll(
          ".carousel-dot"
        );



      /* -----------------------------------------------
         UPDATE CAROUSEL
      ----------------------------------------------- */

      function updateCarousel() {

        track.style.transform =
          `translateX(
            -${currentSlide * 100}%
          )`;


        dots.forEach(
          (dot, index) => {

            dot.classList.toggle(
              "active",
              index === currentSlide
            );

          }
        );

      }



      /* -----------------------------------------------
         NEXT
      ----------------------------------------------- */

      next.addEventListener(
        "click",
        e => {

          e.stopPropagation();


          currentSlide++;

          if (
            currentSlide >=
            slides.length
          ) {

            currentSlide = 0;

          }


          updateCarousel();

        }
      );



      /* -----------------------------------------------
         PREVIOUS
      ----------------------------------------------- */

      previous.addEventListener(
        "click",
        e => {

          e.stopPropagation();


          currentSlide--;

          if (
            currentSlide < 0
          ) {

            currentSlide =
              slides.length - 1;

          }


          updateCarousel();

        }
      );



      /* -----------------------------------------------
         TOUCH SWIPE
      ----------------------------------------------- */

      let touchStartX = 0;

      let touchEndX = 0;


      card.addEventListener(
        "touchstart",
        e => {

          touchStartX =
            e.changedTouches[0].screenX;

        },
        {
          passive: true
        }
      );


      card.addEventListener(
        "touchend",
        e => {

          touchEndX =
            e.changedTouches[0].screenX;


          const distance =
            touchEndX -
            touchStartX;


          if (
            Math.abs(distance) < 40
          ) {

            return;

          }


          if (
            distance < 0
          ) {

            currentSlide++;

            if (
              currentSlide >=
              slides.length
            ) {

              currentSlide = 0;

            }

          } else {

            currentSlide--;

            if (
              currentSlide < 0
            ) {

              currentSlide =
                slides.length - 1;

            }

          }


          updateCarousel();

        },
        {
          passive: true
        }
      );


      /* -----------------------------------------------
         INITIAL STATE
      ----------------------------------------------- */

      updateCarousel();

    }
  );



  /* =====================================================
     HOVER CARD STATE
  ===================================================== */

  const cards =
    document.querySelectorAll(
      ".video-card, .character-card, .carousel-card"
    );


  cards.forEach(
    card => {

      card.addEventListener(
        "mouseenter",
        () => {

          card.classList.add(
            "is-hovered"
          );

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          card.classList.remove(
            "is-hovered"
          );

        }
      );

    }
  );



  /* =====================================================
     STOP VIDEOS BEFORE PAGE CLOSE
  ===================================================== */

  window.addEventListener(
    "beforeunload",
    () => {

      portfolioVideos.forEach(
        video => {

          video.pause();

          video.muted = true;

        }
      );

    }
  );

});