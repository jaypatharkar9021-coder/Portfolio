/* =========================================================
   JAY PATHARKAR — VIDEO EDITOR PORTFOLIO
   SMOOTH + PERFORMANCE OPTIMIZED SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. CUSTOM CURSOR
    ===================================================== */

    const cursor = document.querySelector(".cursor");
    const cursorDot = document.querySelector(".cursor-dot");

    if (cursor && cursorDot) {

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.transform =
                `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.transform =
                `translate3d(${cursorX}px, ${cursorY}px, 0)`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }


    /* =====================================================
       2. VIDEO LOADING HELPER
    ===================================================== */

    function ensureVideoLoaded(video) {

        if (!video) return false;

        const dataSrc = video.getAttribute("data-src");

        if (!video.getAttribute("src") && dataSrc) {
            video.setAttribute("src", dataSrc);
            video.load();
        }

        return !!video.getAttribute("src");
    }


    /* =====================================================
       3. HERO BACKGROUND VIDEOS
    ===================================================== */

    const heroVideos =
        document.querySelectorAll(".bg-video");

    const heroSections =
        document.querySelectorAll("[data-bg]");

    let activeHeroVideo =
        document.querySelector(".bg-video.active");


    /* Load first hero video */
    if (activeHeroVideo) {
        ensureVideoLoaded(activeHeroVideo);

        activeHeroVideo.muted = true;
        activeHeroVideo.playsInline = true;
        activeHeroVideo.setAttribute("playsinline", "");
    }


    /* Pause all non-active hero videos */

    heroVideos.forEach((video) => {

        video.muted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");

        if (!video.classList.contains("active")) {
            video.pause();
        }

    });


    function activateHeroVideo(type) {

        const target =
            document.querySelector(
                `.bg-video[data-bg="${type}"]`
            );

        if (!target || target === activeHeroVideo) {
            return;
        }


        /* Load only when required */

        ensureVideoLoaded(target);


        /* Pause all other hero videos */

        heroVideos.forEach((video) => {

            if (video !== target) {

                video.pause();
                video.classList.remove("active");

            }

        });


        target.classList.add("active");

        activeHeroVideo = target;

        target.muted = true;
        target.playsInline = true;


        const playPromise = target.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }

    }


    /* Hero section hover */

    heroSections.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            const type = element.dataset.bg;

            if (type) {
                activateHeroVideo(type);
            }

        });

    });


    /* Start first hero video */

    if (activeHeroVideo) {

        ensureVideoLoaded(activeHeroVideo);

        activeHeroVideo.muted = true;

        activeHeroVideo
            .play()
            .catch(() => {});

    }


    /* =====================================================
       4. PORTFOLIO VIDEOS
       SMOOTH PLAYBACK
    ===================================================== */

    const portfolioVideos =
        document.querySelectorAll(
            ".video-card video, .character-media video"
        );

    let activePortfolioVideo = null;


    function stopOtherVideos(currentVideo) {

        portfolioVideos.forEach((video) => {

            if (video !== currentVideo) {

                video.pause();

                /*
                 * Don't reset currentTime.
                 * This avoids unnecessary seeking/decoding.
                 */

            }

        });

    }


    function playPortfolioVideo(video) {

        if (!video) return;


        /* Make sure data-src becomes src */

        if (!ensureVideoLoaded(video)) {
            return;
        }


        stopOtherVideos(video);

        activePortfolioVideo = video;

        video.playsInline = true;
        video.setAttribute("playsinline", "");

        /*
         * Start muted.
         * Browser autoplay rules are easier this way.
         */

        if (video.paused) {

            const promise = video.play();

            if (promise !== undefined) {

                promise.catch(() => {

                    /*
                     * Retry muted if browser blocks playback.
                     */

                    video.muted = true;

                    video.play().catch(() => {});

                });

            }

        }

    }


    function pausePortfolioVideo(video) {

        if (!video) return;

        video.pause();

        if (activePortfolioVideo === video) {
            activePortfolioVideo = null;
        }

    }


    /* =====================================================
       5. DESKTOP HOVER PLAY
    ===================================================== */

    portfolioVideos.forEach((video) => {

        const card =
            video.closest(
                ".video-card, .character-card"
            );

        if (!card) return;


        card.addEventListener("mouseenter", () => {

            if (
                window.matchMedia("(hover: hover)").matches
            ) {

                playPortfolioVideo(video);

            }

        });


        card.addEventListener("mouseleave", () => {

            if (
                window.matchMedia("(hover: hover)").matches
            ) {

                pausePortfolioVideo(video);

            }

        });

    });


    /* =====================================================
       6. PLAY / PAUSE BUTTONS
    ===================================================== */

    const playButtons =
        document.querySelectorAll(".play-btn");


    playButtons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();
            e.stopPropagation();


            const card =
                button.closest(
                    ".video-card, .character-card"
                );

            if (!card) return;


            const video =
                card.querySelector("video");

            if (!video) return;


            if (video.paused) {

                playPortfolioVideo(video);

            } else {

                pausePortfolioVideo(video);

            }

        });

    });


    /* =====================================================
       7. SOUND BUTTON
    ===================================================== */

    const soundButtons =
        document.querySelectorAll(".sound-btn");


    soundButtons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();
            e.stopPropagation();


            const card =
                button.closest(
                    ".video-card, .character-card"
                );

            if (!card) return;


            const video =
                card.querySelector("video");

            if (!video) return;


            /*
             * Load video first if needed.
             */

            ensureVideoLoaded(video);


            video.muted = !video.muted;


            button.classList.toggle(
                "muted",
                video.muted
            );


            /*
             * Change icon.
             */

            button.textContent =
                video.muted ? "🔇" : "🔊";


            /*
             * Make sure video is playing.
             */

            if (video.paused) {
                playPortfolioVideo(video);
            }

        });

    });


    /* =====================================================
       8. MOBILE VIDEO TAP
    ===================================================== */

    portfolioVideos.forEach((video) => {

        const card =
            video.closest(
                ".video-card, .character-card"
            );

        if (!card) return;


        card.addEventListener("click", (e) => {

            if (e.target.closest("button")) {
                return;
            }


            /*
             * On touch devices:
             * tap = play / pause
             */

            if (
                !window.matchMedia(
                    "(hover: hover)"
                ).matches
            ) {

                if (video.paused) {

                    playPortfolioVideo(video);

                } else {

                    pausePortfolioVideo(video);

                }

            }

        });

    });


    /* =====================================================
       9. LOAD VIDEOS NEAR VIEWPORT
    ===================================================== */

    if ("IntersectionObserver" in window) {

        const videoObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        const video = entry.target;


                        if (entry.isIntersecting) {

                            /*
                             * Load video only when close
                             * to the viewport.
                             */

                            ensureVideoLoaded(video);

                        } else {

                            /*
                             * Pause when far out of view.
                             */

                            video.pause();

                            if (
                                activePortfolioVideo === video
                            ) {
                                activePortfolioVideo = null;
                            }

                        }

                    });

                },
                {
                    rootMargin: "500px 0px",
                    threshold: 0.05
                }
            );


        portfolioVideos.forEach((video) => {

            video.preload = "metadata";
            video.playsInline = true;
            video.setAttribute("playsinline", "");

            videoObserver.observe(video);

        });

    } else {

        /*
         * Fallback for older browsers.
         */

        portfolioVideos.forEach((video) => {
            ensureVideoLoaded(video);
        });

    }


    /* =====================================================
       10. PAUSE VIDEOS WHEN TAB IS HIDDEN
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                portfolioVideos.forEach(
                    (video) => {
                        video.pause();
                    }
                );


                heroVideos.forEach(
                    (video) => {
                        video.pause();
                    }
                );


                activePortfolioVideo = null;

            } else {

                /*
                 * Restart active hero video.
                 */

                if (activeHeroVideo) {

                    ensureVideoLoaded(activeHeroVideo);

                    activeHeroVideo
                        .play()
                        .catch(() => {});

                }

            }

        }
    );


    /* =====================================================
       11. CAROUSELS
    ===================================================== */

    const carouselCards =
        document.querySelectorAll(
            ".carousel-card"
        );


    carouselCards.forEach((card) => {

        const track =
            card.querySelector(
                ".carousel-track"
            );


        const slides =
            Array.from(
                card.querySelectorAll(
                    ".carousel-track img"
                )
            );


        const prevBtn =
            card.querySelector(
                ".carousel-prev"
            );


        const nextBtn =
            card.querySelector(
                ".carousel-next"
            );


        const dotsContainer =
            card.querySelector(
                ".carousel-dots"
            );


        if (
            !track ||
            slides.length <= 1
        ) {
            return;
        }


        let currentIndex = 0;

        let startX = 0;
        let endX = 0;


        /* =================================================
           CREATE DOTS
        ================================================= */

        if (dotsContainer) {

            dotsContainer.innerHTML = "";


            slides.forEach((_, index) => {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type = "button";

                dot.className =
                    "carousel-dot";


                if (index === 0) {

                    dot.classList.add(
                        "active"
                    );

                }


                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );


                dot.addEventListener(
                    "click",
                    (e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        goToSlide(index);

                    }
                );


                dotsContainer.appendChild(dot);

            });

        }


        /* =================================================
           UPDATE DOTS
        ================================================= */

        function updateDots() {

            if (!dotsContainer) return;


            const dots =
                dotsContainer.querySelectorAll(
                    ".carousel-dot"
                );


            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

        }


        /* =================================================
           MOVE SLIDE
        ================================================= */

        function goToSlide(index) {

            currentIndex =
                (index + slides.length) %
                slides.length;


            track.style.transform =
                `translate3d(-${currentIndex * 100}%, 0, 0)`;


            updateDots();

        }


        /* =================================================
           NEXT
        ================================================= */

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();
                    e.stopPropagation();


                    goToSlide(
                        currentIndex + 1
                    );

                }
            );

        }


        /* =================================================
           PREVIOUS
        ================================================= */

        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();
                    e.stopPropagation();


                    goToSlide(
                        currentIndex - 1
                    );

                }
            );

        }


        /* =================================================
           MOBILE SWIPE
        ================================================= */

        card.addEventListener(
            "touchstart",
            (e) => {

                if (
                    e.target.closest("button")
                ) {
                    return;
                }


                startX =
                    e.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "touchend",
            (e) => {

                if (!startX) return;


                endX =
                    e.changedTouches[0].clientX;


                const difference =
                    startX - endX;


                if (difference > 50) {

                    goToSlide(
                        currentIndex + 1
                    );

                } else if (difference < -50) {

                    goToSlide(
                        currentIndex - 1
                    );

                }


                startX = 0;
                endX = 0;

            },
            {
                passive: true
            }
        );


        /* =================================================
           PREVENT IMAGE DRAG
        ================================================= */

        slides.forEach((img) => {

            img.draggable = false;


            img.addEventListener(
                "dragstart",
                (e) => {
                    e.preventDefault();
                }
            );

        });


        /* Initial position */

        goToSlide(0);

    });


    /* =====================================================
       12. MAGNETIC BUTTONS
    ===================================================== */

    const magneticButtons =
        document.querySelectorAll(
            ".magnetic"
        );


    magneticButtons.forEach((button) => {

        if (
            !window.matchMedia(
                "(hover: hover)"
            ).matches
        ) {
            return;
        }


        button.addEventListener(
            "mousemove",
            (e) => {

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
                    `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "";

            }
        );

    });


    /* =====================================================
       13. REVEAL ANIMATIONS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       14. VIDEO HOVER CARD STATE
    ===================================================== */

    portfolioVideos.forEach((video) => {

        const card =
            video.closest(
                ".video-card, .character-card"
            );

        if (!card) return;


        video.addEventListener(
            "play",
            () => {

                card.classList.add(
                    "is-playing"
                );

            }
        );


        video.addEventListener(
            "pause",
            () => {

                card.classList.remove(
                    "is-playing"
                );

            }
        );

    });


    /* =====================================================
       15. REDUCE MOTION SUPPORT
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (prefersReducedMotion.matches) {

        document.documentElement.style
            .scrollBehavior = "auto";

    }


    /* =====================================================
       16. FINAL VIDEO SETUP
    ===================================================== */

    portfolioVideos.forEach((video) => {

        video.preload = "metadata";

        video.playsInline = true;

        video.setAttribute(
            "playsinline",
            ""
        );


        /*
         * Don't autoplay portfolio videos.
         * They play only when interacted with.
         */

        video.autoplay = false;

    });

});