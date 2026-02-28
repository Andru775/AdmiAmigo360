gsap.registerPlugin(ScrollTrigger);

// Premium ease mimicking Apple's cubic-bezier(0.22, 1, 0.36, 1)
const premiumEase = "power3.out";

document.addEventListener("DOMContentLoaded", () => {
    // ---- 1. Select DOM Elements ----
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const progressBar = document.querySelector(".progress-bar");
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const introSequence = document.getElementById("intro-sequence");

    // ---- 2. Preload 180 Image Sequence ----
    const frameCount = 180;
    const images = [];
    const airframes = { frame: 0 };
    let imagesLoaded = 0;

    const currentFrame = index => `/Frames-video-2/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    if (canvas && ctx) {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1) renderFrame(0); // Render first frame to avoid black flash
            };
            images.push(img);
        }

        canvas.width = 1920;
        canvas.height = 1080;

        function renderFrame(index) {
            if (!images[index] || !images[index].complete) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const img = images[index];
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio); // object-fit: cover

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }

        // ---- 3. GSAP Slow Intro Scrub ----
        const introTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: introSequence,
                start: "top top",
                end: "bottom bottom",
                scrub: 2, // Very smooth & slow interpolation
                onUpdate: (self) => {
                    progressBar.style.width = (self.progress * 100) + "%";

                    // Fade out scroll indicator and hero text
                    if (self.progress > 0.05) {
                        gsap.to(".intro-content", { autoAlpha: 0, scale: 0.95, duration: 0.5, overwrite: "auto" });
                        gsap.to(scrollIndicator, { autoAlpha: 0, y: 20, duration: 0.5, overwrite: "auto" });
                    } else {
                        gsap.to(".intro-content", { autoAlpha: 1, scale: 1, duration: 0.5, overwrite: "auto" });
                        gsap.to(scrollIndicator, { autoAlpha: 0.7, y: 0, duration: 0.5, overwrite: "auto" });
                    }
                }
            }
        });

        introTimeline.to(airframes, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            onUpdate: () => renderFrame(airframes.frame)
        }, 0);

        introTimeline.fromTo(canvas,
            { scale: 1.0 },
            { scale: 1.05, ease: "none" },
            0);

        gsap.to(scrollIndicator, { autoAlpha: 0.7, delay: 2, duration: 1 });
    }

    // ---- 4. SPLIT TYPE TEXT SETUP ----
    // This allows us to animate word-by-word or line-by-line stagger
    const splitTitles = new SplitType('.section-title', { types: 'lines, words' });

    // Ensure intro content container is visible so JS can animate its children
    gsap.set(".intro-content", { autoAlpha: 1 });

    // Initial Hero Animation (Premium cinematic fade up)
    gsap.from(".hero-title", {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: premiumEase,
        delay: 0.3
    });

    gsap.from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1.2,
        ease: premiumEase,
        delay: 0.8
    });

    // ---- 5. CONTENT SECTIONS ADVANCED ANIMATION ----
    // Build a master staggered animation for each section block independently
    const sections = gsap.utils.toArray(".content-section");

    sections.forEach(sec => {
        const container = sec.querySelector(".section-container");

        // Remove CSS-based visibility hidden immediately
        gsap.set(container, { autoAlpha: 1 });

        const tag = sec.querySelector(".feature-tag");
        const titleWords = sec.querySelectorAll(".section-title .word");
        const desc = sec.querySelector(".section-desc, .mb-4");
        const listItems = sec.querySelectorAll(".feature-list li");
        const cards = sec.querySelectorAll(".feature-card, .board-side, .glass-mockup");
        const buttons = sec.querySelectorAll(".btn-premium");

        // Intersection Timeline (Triggers when 30% enters screen)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sec,
                start: "top 70%", // Triggers slightly before fully visible
                once: true
            }
        });

        // 1. Tag
        if (tag) tl.from(tag, { opacity: 0, y: 15, duration: 0.8, ease: premiumEase }, 0);

        // 2. Title Stagger
        if (titleWords.length > 0) {
            tl.from(titleWords, {
                y: 30,
                opacity: 0,
                filter: "blur(5px)",
                duration: 1,
                stagger: 0.05,
                ease: premiumEase
            }, 0.1);
        }

        // 3. Paragraph Description
        if (desc) {
            tl.from(desc, { opacity: 0, y: 20, duration: 1, ease: premiumEase }, 0.3);
        }

        // 4. Feature Lists
        if (listItems.length > 0) {
            tl.from(listItems, {
                opacity: 0,
                x: -15,
                duration: 0.8,
                stagger: 0.08,
                ease: premiumEase
            }, 0.4);
        }

        // 5. Cards & Visual Blocks (Subtle spring and scale)
        if (cards.length > 0) {
            tl.from(cards, {
                opacity: 0,
                y: 50,
                scale: 0.96,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out" // Gives a subtle deceleration curve
            }, 0.4);
        }

        // 6. Final Buttons
        if (buttons.length > 0) {
            tl.from(buttons, { opacity: 0, y: 15, duration: 0.8, ease: premiumEase }, 0.6);
        }

        // ---- 6. PER-SECTION PARALLAX DEPTH ----
        // Section containers move slightly slower than the scroll bar to create heavy luxury depth
        gsap.fromTo(container,
            { y: 30 },
            {
                y: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: sec,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    // ---- 7. Animated Counters ----
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => {
                const target = parseInt(counter.getAttribute('data-target'));
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 3,
                    ease: premiumEase,
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        counter.innerHTML = Math.round(counter.innerHTML);
                    }
                });
            },
            once: true
        });
    });
});
