document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const bottom = document.getElementById("duskfall-bottom");
  const skyblue = document.getElementById("sky-blue");
  const skyorange = document.getElementById("sky-orange");
  const starsContainer = document.getElementById("stars-container");
  const aurora = document.getElementById("aurora");
  const element = document.getElementById("parallax-container");
  let isAnimated = false;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const container = document.getElementById("parallax-container");

  function updateScrollStyles() {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty("--scrollY", scrollY);

    // Compute current dynamic size
    const width = vw - scrollY * 0.005;
    const height = vh - scrollY * 0.025;

    scrollCurrent = window.scrollY;
    scrollChange = scrollY - scrollCurrent;
    const minWidth = vw * 0.98;
    const minHeight = vh * 0.9;

    const reachedMinSize = (width <= minWidth) | (height <= minHeight);

    if (reachedMinSize) {
      container.style.transform = `translateY(${scrollChange}px)`;
    } else {
      // Let CSS handle size again via variables
      container.style.width = "";
      container.style.height = "";
    }
  }

  window.addEventListener("scroll", updateScrollStyles);
  window.addEventListener("load", updateScrollStyles);
  updateScrollStyles(); // initial call

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
      let y = (Math.random() * window.innerHeight) / 2.5;
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
  /*
  document.addEventListener("scroll", () => {
    let scrollY = window.scrollY / 10; // Adjust sensitivity
    document.querySelector(
      "#parallax-container"
    ).style.transform = `perspective(600px) rotateX(${scrollY * -0.2}deg)`;
  });*/

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

  const unstuckThreshold = 500;
  const yes = document.getElementById("pc-up");

  let hasUnstuck = false;
  let lockedOffset = 0;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Update scroll variable for shrinking #two
    document.documentElement.style.setProperty("--scrollY", scrollY);

    if (scrollY < unstuckThreshold) {
      yes.style.position = "fixed";
      yes.style.top = "0";
      yes.style.transform = "translateY(0)";
      hasUnstuck = false;
    } else if (!hasUnstuck) {
      // Lock it in place and let it scroll naturally
      const rect = yes.getBoundingClientRect();
      lockedOffset = scrollY + rect.top;

      yes.style.position = "absolute";
      yes.style.top = `${lockedOffset}px`;
      yes.style.transform = "none";
      hasUnstuck = true;
    }
  });

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

  if (aurora) {
    aurora.addEventListener("animationend", (event) => {
      console.log("Aurora Animation Ended:", event.animationName);

      if (event.animationName === "auroraStart") {
        aurora.style.animation = "none";
        void aurora.offsetWidth; // ✅ Force reflow
        aurora.style.animation =
          "auroraAnimate 20s infinite alternate ease-out";
      }
    });
  }

  window.addEventListener("resize", updateProportions);
  window.addEventListener("scroll", applyParallax);

  animateEntrance();
  updateElementTransitions();
  updateProportions();
});
