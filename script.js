document.addEventListener("DOMContentLoaded", function () {
  const bottom = document.getElementById("duskfall-bottom");
  const skyblue = document.getElementById("sky-blue");
  const skyorange = document.getElementById("sky-orange");
  const welcome = document.getElementById("welcome-text");
  const starsContainer = document.getElementById("stars-container");

  const cloudFront = document.getElementById("cloud-front");
  const cloudBack = document.getElementById("cloud-back");

  let ticking = false;
  let tickingTransitions = false;
  let lastScrollPosition = window.scrollY;
  let isScrollingDown = true;

  // Create stars dynamically
  createStars(200);

  function createStars(count) {
    for (let i = 0; i < count; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      let x = Math.random() * window.innerWidth;
      let y = (Math.random() * window.innerHeight) / 1.4;
      let size = Math.random() * 3 + 0.2; // Star size varies from 0.2px to 3.2px

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = `0`;
      star.dataset.size = size; // Store size for parallax logic

      // Set Random Delay & Duration for Animation (Fixed)
      const delay = Math.random() * 3 + "s"; // Random delay between 0s - 3s
      const duration = Math.random() * 4 + 3 + "s"; // Random duration between 3s - 7s

      star.style.animationDelay = delay;
      star.style.animationDuration = duration;

      // Listen for when `twinkleStart` finishes, then start `twinkle`
      star.addEventListener("animationend", (event) => {
        if (event.animationName === "twinkleStart") {
          star.style.animation = "twinkle 4s infinite alternate ease-in-out";
        }
      });

      starsContainer.appendChild(star);
    }
  }

  function applyParallax() {
    if (!ticking) {
      requestAnimationFrame(() => {
        let scrollY = window.scrollY;
        let windowHeight = window.innerHeight;
        let parallaxSection = starsContainer.parentElement;
        let sectionTop = parallaxSection.offsetTop;
        let sectionBottom = sectionTop + parallaxSection.offsetHeight;

        // Move bottom upwards the most
        bottom.style.transform = `translateY(${-scrollY * 0.01}px)`;

        // Move sky upwards slightly less
        skyblue.style.transform = `translateY(${scrollY * 0.2}px)`;
        skyorange.style.transform = `translateY(${scrollY * 0.07}px)`;

        // Clouds parallax effect
        cloudFront.style.transform = `translateY(${scrollY * 0.1}px)`;
        cloudBack.style.transform = `translateY(${scrollY * 0.15}px)`;

        welcome.style.transform = `translateY(${scrollY * 0.3}px)`;

        // Parallax effect for stars (Fixed)
        document.querySelectorAll(".star").forEach((star) => {
          let size = parseFloat(star.dataset.size);
          let movementFactor = 0.1 + size * 0.9;
          star.style.transform = `translateY(${-scrollY * movementFactor}px)`;
        });

        // Restart animation when scrolling back to section
        if (
          scrollY + windowHeight * 1.5 > sectionTop &&
          scrollY < sectionBottom
        ) {
          restartStarAnimation();
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  function restartStarAnimation() {
    setTimeout(() => {
      document.querySelectorAll(".star").forEach((star) => {
        star.style.animation = "none"; // Remove existing animation
        void star.offsetWidth; // Trigger reflow to reset animation
        star.style.animation = "twinkleStart 4s alternate ease-in-out"; // Restart first animation
      });
    }, 1000);
  }

  function animateEntrance() {
    bottom.style.transition = "transform 1.5s ease-out";
    skyblue.style.transition = "transform 1.5s ease-out";
    skyorange.style.transition = "transform 2s ease-out";

    bottom.style.transform = "translateY(0)";
    skyblue.style.transform = "translateY(0)";
    skyorange.style.transform = "translateY(0)";
  }

  function updateElementPositions() {
    if (!tickingTransitions) {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.7;

        // Detect scroll direction
        isScrollingDown = window.scrollY > lastScrollPosition;
        lastScrollPosition = window.scrollY;

        document.querySelectorAll(".transition-element").forEach((element) => {
          const triggerPoint = parseInt(
            element.getAttribute("data-scroll"),
            10
          );
          const rangePoint = parseInt(
            element.getAttribute("data-range") || 800,
            10
          );
          const enterDirection = element.getAttribute("data-direction");
          const exitDirection =
            element.getAttribute("data-out") || enterDirection;
          const startOffset = element.getAttribute("data-start") || "10vh";
          const waitTime = parseInt(element.getAttribute("data-wait") || 0, 10);

          if (
            scrollPosition >= triggerPoint &&
            scrollPosition < triggerPoint + rangePoint
          ) {
            if (!element.classList.contains("visible")) {
              setTimeout(() => {
                element.classList.add("visible");
                element.style.opacity = "1";
                element.style.transform = "translate(0, 0)";
              }, waitTime);
            }
          } else {
            if (element.classList.contains("visible")) {
              element.classList.remove("visible");
              element.style.opacity = "0";

              const transitionDirection = isScrollingDown
                ? exitDirection
                : enterDirection;
              element.style.transform = getTransformValue(
                transitionDirection,
                startOffset
              );
            }
          }
        });

        tickingTransitions = false;
      });
      tickingTransitions = true;
    }
  }

  function getTransformValue(direction, offset) {
    switch (direction) {
      case "left":
        return `translateX(-${offset}) translateY(0)`;
      case "right":
        return `translateX(${offset}) translateY(0)`;
      case "up":
        return `translateY(-${offset}) translateX(0)`;
      case "down":
        return `translateY(${offset}) translateX(0)`;
      default:
        return "translateX(0) translateY(0)";
    }
  }

  window.addEventListener("scroll", applyParallax);
  window.addEventListener("scroll", updateElementPositions);

  animateEntrance();
  updateElementPositions();
});
