document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const bottom = document.getElementById("duskfall-bottom");
  const skyblue = document.getElementById("sky-blue");
  const skyorange = document.getElementById("sky-orange");
  const starsContainer = document.getElementById("stars-container");

  let ticking = false;
  let tickingTransitions = false;
  let lastScrollPosition = window.scrollY;
  let isScrollingDown = true;

  // 🎇 Create stars dynamically
  createStars(200);

  function createStars(count) {
    for (let i = 0; i < count; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      let x = Math.random() * window.innerWidth;
      let y = (Math.random() * window.innerHeight) / 1.9;
      let size = Math.random() * 3 + 0.2;

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = "0";

      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${Math.random() * 4 + 3}s`;

      starsContainer.appendChild(star);
      star.addEventListener("animationend", (event) => {
        if (event.animationName === "twinkleStart") {
          star.style.animation = "none";
          void star.offsetWidth;
          star.style.animation = "twinkle 4s infinite alternate ease-in-out";
        }
      });
    }
  }

  function applyParallax() {
    if (!ticking) {
      requestAnimationFrame(() => {
        let scrollY = window.scrollY;
        root.style.setProperty("--scrollY", scrollY); // ✅ Update global CSS variable

        // updateBrightness(); // Ensure brightness changes with scroll
        updateElementTransitions(); // ✅ Ensure section fade-in works

        ticking = false;
      });
      ticking = true;
    }
  }

  function updateBrightness() {
    let scrollY = window.scrollY;
    let windowHeight = window.innerHeight;
    let sectionTop = starsContainer.parentElement.offsetTop;
    let sectionBottom = sectionTop + starsContainer.parentElement.offsetHeight;

    let shouldBeDark =
      scrollY + windowHeight * 0.9 > sectionTop &&
      scrollY < sectionBottom - windowHeight * 0.7;

    let targetBrightness = shouldBeDark ? "brightness(1)" : "brightness(0)";

    if (bottom.style.filter !== targetBrightness) {
      bottom.style.transition = "filter 0.5s ease-in-out";
      bottom.style.filter = targetBrightness;
    }
  }

  function updateProportions() {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    document.documentElement.style.setProperty(
      "--vh",
      screenHeight / 100 + "px"
    );
    document.documentElement.style.setProperty(
      "--vw",
      screenWidth / 100 + "px"
    );
  }

  function updateElementTransitions() {
    if (!tickingTransitions) {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.7;

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

  function restartStarAnimation() {
    document.querySelectorAll(".star").forEach((star) => {
      star.style.opacity = "0";
    });

    setTimeout(() => {
      document.querySelectorAll(".star").forEach((star) => {
        star.style.animation = "none";
        void star.offsetWidth;
        star.style.animation = "twinkleStart 4s alternate ease-in-out";
      });
    }, 1000);
  }

  function animateEntrance() {
    bottom.style.transition = "transform 1.5s ease-out";
    skyblue.style.transition = "transform 1.5s ease-out";
    skyorange.style.transition = "transform 2s ease-out";

    /*
    bottom.style.transform = "translateY(0)";
    skyblue.style.transform = "translateY(0)";
    skyorange.style.transform = "translateY(0)";*/
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
  window.addEventListener("resize", updateProportions);
  window.addEventListener("scroll", applyParallax);

  animateEntrance();
  updateElementTransitions();
  updateProportions();
});
