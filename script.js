document.addEventListener("DOMContentLoaded", function () {
  const bottom = document.getElementById("duskfall-bottom");
  const sky = document.getElementById("sky");
  const skyorange = document.getElementById("sky-orange");
  const skyblue = document.getElementById("sky-blue");
  const starsContainer = document.getElementById("stars-container");

  // Create stars dynamically
  createStars(300);

  function createStars(count) {
    for (let i = 0; i < count; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      let x = Math.random() * window.innerWidth;
      let y = (Math.random() * window.innerHeight) / 1.4;
      let size = Math.random() * 3 + 0.2; // Star size varies from 1px to 4px
      let duration = Math.random() * 3 + 2;

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${duration}s`;
      star.dataset.size = size; // Store size for parallax logic

      starsContainer.appendChild(star);
    }
  }

  function applyParallax() {
    let scrollY = window.scrollY;

    // Move bottom upwards the most
    bottom.style.transform = `translateY(${-scrollY * 0.1}px)`;

    // Move sky upwards slightly less
    sky.style.transform = `translateY(${-scrollY * 0.2}px)`;
    skyblue.style.transform = `translateY(${scrollY * 2}px)`;
    skyorange.style.transform = `translateY(${-scrollY * 0.05}px)`;

    document.querySelectorAll(".star").forEach((star) => {
      let size = parseFloat(star.dataset.size);

      // Make the movement drastically different
      let movementFactor = 1 + size * 1000000; // Small stars move 5x, big stars up to 20x

      star.style.transform = `translateY(${-scrollY * movementFactor}vh)`;
    });
  }

  function animateEntrance() {
    bottom.style.transition = "transform 1.5s ease-out";
    sky.style.transition = "transform 1.5s ease-out";

    bottom.style.transform = "translateY(0)";
    sky.style.transform = "translateY(0)";

    setTimeout(() => {
      document.querySelectorAll(".star").forEach((star) => {
        star.style.opacity = "1";
      });
    }, 1000);
  }

  window.addEventListener("scroll", applyParallax);
  animateEntrance();

  const elements = document.querySelectorAll(".transition-element");
  let lastScrollPosition = window.scrollY;
  let isScrollingDown = true; // Default state

  function updateElementPositions() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.7; // Trigger when 70% in view

    // Detect scroll direction
    isScrollingDown = window.scrollY > lastScrollPosition;
    lastScrollPosition = window.scrollY;

    elements.forEach((element) => {
      const triggerPoint = parseInt(element.getAttribute("data-scroll"), 10);
      const rangePoint = parseInt(
        element.getAttribute("data-range") || 800,
        10
      );
      const enterDirection = element.getAttribute("data-direction");
      const exitDirection = element.getAttribute("data-out") || enterDirection;
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

          // Apply transition direction based on scroll direction
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

  window.addEventListener("scroll", updateElementPositions);
  updateElementPositions();
});
