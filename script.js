/*

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

*/

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".transition-element");

  function updateElementPositions() {
    const scrollPosition = window.scrollY;
    const screenWidth = window.innerWidth; // Get screen width for horizontal movements
    const screenHeight = window.innerHeight; // Get screen height for vertical movements

    elements.forEach((element) => {
      const triggerPoint = parseInt(element.getAttribute("data-scroll"), 10);
      const rangePoint = parseInt(element.getAttribute("data-range"), 10);
      const direction = element.getAttribute("data-direction");

      if (
        scrollPosition >= triggerPoint &&
        scrollPosition <= triggerPoint + rangePoint
      ) {
        let progress = (triggerPoint - scrollPosition) / rangePoint;
        // progress = Math.max(0, Math.min(progress, 1)); // Clamp between 0 and 1

        let newX = 0,
          newY = 0;
        let centerProgress = 0; // NEW: Measures how close element is to center

        // Adjust progress mapping for a proper hold at the center
        let holdFactor = 0.3; // Percentage of time to hold in center

        // Calculate center progress based on actual screen width/height
        if (direction === "left" || direction === "right") {
          newX = (direction === "left" ? (progress > 0) ? 1 - progress : progress) * 100;

          centerProgress = scrollPosition - rangePoint / 100;
        } else if (direction === "up" || direction === "down") {
          newY = scrollPosition + 50 / rangePoint;
        }

        // Apply opacity based on center distance
        element.style.opacity = 1;

        // Apply movement
        element.style.transform = `translate(${newX}%, ${newY}%)`;
      } else {
        element.style.opacity = 0;
      }
    });
  }

  window.addEventListener("scroll", updateElementPositions);
  updateElementPositions();
});
