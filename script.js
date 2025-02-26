document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".transition-element");

  function updateElementPositions() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.7; // Trigger when element is 70% in view

    elements.forEach((element) => {
      const triggerPoint = parseInt(element.getAttribute("data-scroll"), 10);
      const rangePoint = parseInt(element.getAttribute("data-range"), 10);

      if (
        scrollPosition >= triggerPoint &&
        scrollPosition < triggerPoint + rangePoint
      ) {
        element.classList.add("visible");
      } else {
        element.classList.remove("visible");
      }
    });
  }

  window.addEventListener("scroll", updateElementPositions);
  updateElementPositions(); // Run once on page load
});

/*
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".transition-element");

  function updateElementPositions() {
    const scrollPosition = window.scrollY;
    const moveDistance = 200; // Moves from 100vw to -100vw (200vw total travel)

    elements.forEach((element) => {
      const triggerPoint = parseInt(element.getAttribute("data-scroll"), 10);
      const rangePoint = parseInt(element.getAttribute("data-range"), 10);
      const direction = element.getAttribute("data-direction");

      if (
        scrollPosition >= triggerPoint &&
        scrollPosition <= triggerPoint + rangePoint
      ) {
        // Normalize progress (0 at start, 1 at end)
        let progress = (scrollPosition - triggerPoint) / rangePoint;
        progress = Math.max(0, Math.min(progress, 1)); // Clamp to [0,1]

        let newX = 0,
          newY = 0;

        // 🔹 HOLD AT CENTER: Adjust movement speed around midpoint
        let holdFactor = 0.3; // Percentage of scroll range to hold at the center

        if (progress < 0.5 - holdFactor / 2) {
          progress = (progress / (0.5 - holdFactor / 2)) * 0.5;
        } else if (progress > 0.5 + holdFactor / 2) {
          progress =
            0.5 +
            ((progress - (0.5 + holdFactor / 2)) / (0.5 - holdFactor / 2)) *
              0.5;
        } else {
          progress = 0.5; // Hold in the center
        }

        // 🔹 Movement Calculation (Direction-Specific)
        if (direction === "left") {
          newX = (1 - progress * 2) * moveDistance; // Moves from 100vw → -100vw
        } else if (direction === "right") {
          newX = (-1 + progress * 2) * moveDistance; // Moves from -100vw → 100vw
        } else if (direction === "up") {
          newY = (1 - progress * 2) * moveDistance; // Moves from 100vh → -100vh
        } else if (direction === "down") {
          newY = (-1 + progress * 2) * moveDistance; // Moves from -100vh → 100vh
        }

        // 🔹 FIX OPACITY: Ensure peak visibility at center
        let centerProgress = Math.abs(progress - 0.5) * 2; // 0 at center, 1 at edges
        element.style.opacity = Math.pow(Math.cos(centerProgress * Math.PI), 2); // Peaks at center

        // Apply movement
        element.style.transform = `translate(${newX}vw, ${newY}vh)`;
      } else {
        element.style.opacity = 0;
      }
    });
  }

  window.addEventListener("scroll", updateElementPositions);
  updateElementPositions();
});
*/
