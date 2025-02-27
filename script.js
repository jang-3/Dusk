document.addEventListener("DOMContentLoaded", function () {
  createStars(200); // Adjust the number of stars as needed

  function createStars(count) {
    const body = document.getElementById("welcome");

    for (let i = 0; i < count; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      // Random position
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      // Random size and animation duration
      let size = Math.random() * 3 + 1;
      let duration = Math.random() * 3 + 2;

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${duration}s`;

      body.appendChild(star);
    }
  }

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
