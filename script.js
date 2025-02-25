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
