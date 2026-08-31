/* =========================================================
   JAY PATHARKAR — PREMIUM VIDEO PORTFOLIO
   Optimized playback — same design / same interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CUSTOM CURSOR
  ===================================================== */
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");

  if (cursor && cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (raf) return;
      raf = requestAnimationFrame(() => {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        raf = 0;
      });
    }, { passive: true });
  }

  /* =====================================================
     HERO BACKGROUND VIDEOS
     Only ONE hero video plays at a time.
  ===================================================== */
  const heroVideos = document.querySelectorAll(".bg-video");
  const styleSections = document.querySelectorAll("[data-bg-target]");

  let activeHero = document.querySelector(".bg-video.active") || heroVideos[0];

  function activateHeroVideo(target) {
    if (!heroVideos.length) return;

    heroVideos.forEach(video => {
      const shouldPlay = video.dataset.bg === target;

      if (shouldPlay) {
        activeHero = video;
        video.classList.add("active");
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.classList.remove("active");
        video.pause();
      }
    });
  }

  // Start only the first visible hero video.
  if (activeHero) {
    heroVideos.forEach(video => {
      if (video !== activeHero) {
        video.pause();
        video.classList.remove("active");
      }
    });
    activeHero.muted = true;
    activeHero.play().catch(() => {});
  }

  styleSections.forEach(section => {
    section.addEventListener("mouseenter", () => {
      const target = section.dataset.bgTarget;
      if (target) activateHeroVideo(target);
    }, { passive: true });
  });

  /* =====================================================
     ALL PORTFOLIO VIDEOS
  ===================================================== */
  const portfolioVideos = Array.from(
    document.querySelectorAll(".video-card video, .character-media video")
  );

  let audioUnlocked = false;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  function unlockAudio() {
    audioUnlocked = true;
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
  }

  document.addEventListener("click", unlockAudio, { once: true, passive: true });
  document.addEventListener("keydown", unlockAudio, { once: true, passive: true });
  document.addEventListener("touchstart", unlockAudio, { once: true, passive: true });

  function getContainer(video) {
    return video.closest(".video-card, .character-media");
  }

  function updatePlayIcon(video) {
    const container = getContainer(video);
    if (!container) return;

    const playButton = container.querySelector(".play-btn");
    if (!playButton) return;

    const playing = !video.paused;
    playButton.classList.toggle("playing", playing);
    playButton.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  }

  function resetSound(video) {
    video.muted = true;
    const container = getContainer(video);
    const soundButton = container?.querySelector(".sound-btn");
    if (soundButton) {
      soundButton.textContent = "🔇";
      soundButton.setAttribute("aria-label", "Enable sound");
    }
  }

  function stopOtherVideos(currentVideo) {
    portfolioVideos.forEach(video => {
      if (video !== currentVideo && !video.paused) {
        video.pause();
        resetSound(video);
        updatePlayIcon(video);
      }
    });
  }

  async function playVideo(video, withSound = false) {
    prepareVideo(video);
    stopOtherVideos(video);

    video.muted = !(withSound && audioUnlocked);

    try {
      await video.play();
    } catch (error) {
      // Browser autoplay policy fallback.
      video.muted = true;
      try {
        await video.play();
      } catch (e) {
        return;
      }
    }

    updatePlayIcon(video);
  }

  /* =====================================================
     VIDEO PREVIEW LOADING
     The video itself provides the preview frame — no extra
     thumbnail files are used. Only load a card when it gets
     close to the viewport to reduce mobile lag.
  ===================================================== */
  function prepareVideo(video) {
    if (!video || video.dataset.previewReady === "1") return;
    video.dataset.previewReady = "1";
    video.preload = "metadata";
    try {
      video.load();
    } catch (e) {}
  }

  if ("IntersectionObserver" in window) {
    const previewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          prepareVideo(entry.target);
          previewObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "500px 0px", threshold: 0.01 });

    portfolioVideos.forEach(video => previewObserver.observe(video));
  } else {
    portfolioVideos.forEach(prepareVideo);
  }

  /* =====================================================
     VIDEO EVENTS
  ===================================================== */
  portfolioVideos.forEach(video => {
    const container = getContainer(video);
    if (!container) return;

    const playButton = container.querySelector(".play-btn");
    const soundButton = container.querySelector(".sound-btn");

    video.muted = true;
    video.preload = "metadata";
    updatePlayIcon(video);

    video.addEventListener("play", () => updatePlayIcon(video), { passive: true });
    video.addEventListener("pause", () => updatePlayIcon(video), { passive: true });
    video.addEventListener("ended", () => updatePlayIcon(video), { passive: true });

    // Make the first decoded video frame available as the preview.
    video.addEventListener("loadeddata", () => {
      video.classList.add("preview-ready");
    }, { once: true, passive: true });

    // If a video fails to load, retry once after forcing a fresh request.
    video.addEventListener("error", () => {
      if (video.dataset.retry === "1") return;
      video.dataset.retry = "1";
      setTimeout(() => {
        try {
          video.load();
        } catch (e) {}
      }, 300);
    }, { passive: true });

    // Desktop: hover = play + original audio when the browser permits it.
    if (!isTouchDevice) {
      container.addEventListener("mouseenter", () => {
        playVideo(video, true);
      }, { passive: true });

      container.addEventListener("mouseleave", () => {
        video.pause();
        resetSound(video);
        updatePlayIcon(video);
      }, { passive: true });
    }

    // Play/pause button works on both desktop and mobile.
    if (playButton) {
      playButton.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        audioUnlocked = true;

        if (video.paused) {
          await playVideo(video, true);
        } else {
          video.pause();
          resetSound(video);
          updatePlayIcon(video);
        }
      });
    }

    // Sound button.
    if (soundButton) {
      soundButton.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        audioUnlocked = true;

        if (video.paused) {
          await playVideo(video, true);
        } else {
          video.muted = !video.muted;
        }

        soundButton.textContent = video.muted ? "🔇" : "🔊";
        soundButton.setAttribute(
          "aria-label",
          video.muted ? "Enable sound" : "Mute video"
        );
      });
    }

    // Mobile: tapping the video itself toggles play/pause.
    // Button taps are excluded so they don't double-toggle.
    if (isTouchDevice) {
      container.addEventListener("click", async (e) => {
        if (e.target.closest("button")) return;

        audioUnlocked = true;

        if (video.paused) {
          await playVideo(video, true);
        } else {
          video.pause();
          resetSound(video);
          updatePlayIcon(video);
        }
      });
    }
  });

  /* =====================================================
     PAGE VISIBILITY
  ===================================================== */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      portfolioVideos.forEach(video => {
        video.pause();
        resetSound(video);
        updatePlayIcon(video);
      });

      heroVideos.forEach(video => video.pause());
    } else if (activeHero && document.visibilityState === "visible") {
      activeHero.play().catch(() => {});
    }
  });

  /* =====================================================
     INTERSECTION OBSERVER
     Pause videos that are not actually visible.
  ===================================================== */
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;

        if (!entry.isIntersecting) {
          video.pause();
          resetSound(video);
          updatePlayIcon(video);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "120px 0px"
    });

    portfolioVideos.forEach(video => videoObserver.observe(video));
  }

  /* =====================================================
     MAGNETIC BUTTON
  ===================================================== */
  if (!isTouchDevice) {
    document.querySelectorAll(".magnetic").forEach(button => {
      button.addEventListener("mousemove", e => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }, { passive: true });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      }, { passive: true });
    });
  }

  /* =====================================================
     REVEAL ANIMATION
  ===================================================== */
  const revealElements = document.querySelectorAll(".reveal, .style-section");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("show"));
  }

  /* =====================================================
     HOVER CARD STATE
  ===================================================== */
  if (!isTouchDevice) {
    document.querySelectorAll(".video-card, .character-card").forEach(card => {
      card.addEventListener("mouseenter", () => card.classList.add("is-hovered"), { passive: true });
      card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"), { passive: true });
    });
  }

  /* =====================================================
     STOP VIDEOS BEFORE PAGE CLOSE
  ===================================================== */
  window.addEventListener("pagehide", () => {
    portfolioVideos.forEach(video => {
      video.pause();
      video.muted = true;
    });
    heroVideos.forEach(video => video.pause());
  }, { passive: true });

});
