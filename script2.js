document.addEventListener("DOMContentLoaded", function () {
  const portfolio = [
    "page1.md",
    "page2.md",
    "page3.md",
    "page4.md",
    "page5.md",
    "page6.md",
  ];
  const portfolioIndex = [];

  async function portfolioIndexer() {
    for (let i = 0; i < portfolio.length; i++) {
      const filename = portfolio[i];
      // ➕ Push to index array
      portfolioIndex.push({
        name: filename,
        index: i,
      });
    }
  }

  let currentIndex = 0;

  function goToNext() {
    const total = portfolioIndex.length;
    const nextIndex = (currentIndex + 1) % portfolioIndex.length;
    showOnlyDiv(portfolioIndex[nextIndex].name);
  }

  function goToPrev() {
    const total = portfolioIndex.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    showOnlyDiv(portfolioIndex[prevIndex].name);
  }

  const divMap = new Map(); // filename → <div>

  const thumbnailMap = new Map(); // filename → thumbnail URL

  async function populatePortfolioOptions(portfolio) {
    const select = document.getElementById("portfolioSelect");

    for (const filename of portfolio) {
      const res = await fetch(filename);
      const text = await res.text();

      // 🔍 Find $thumbnail
      const lines = text.split("\n");
      let thumbnail = null;
      let title = null;
      for (const line of lines) {
        if (line.startsWith("$thumbnail")) {
          thumbnail = line.replace("$thumbnail ", "").trim();
        }
        if (line.startsWith("$title")) {
          title = line.replace("$title", "").trim();
        }
      }
      select.innerHTML += `
    <div class="port-option" onclick="showOnlyDiv('${filename}')">
      <div class="option-tn" style="background-image: url('${thumbnail}');"></div>
      <p>${title}</p>
    </div>`;
      // 📌 Save to Map (optional, for later use)
      if (thumbnail) {
        thumbnailMap.set(filename, thumbnail);
      }

      // Pre-render the actual content into div
      preloadAndRenderToDiv(filename);
    }

    select.addEventListener("change", () => {
      showOnlyDiv(select.value);
    });

    showOnlyDiv(portfolio[0]);
  }

  async function preloadAndRenderToDiv(filename) {
    const res = await fetch(filename);
    const text = await res.text();

    const container = document.getElementById("portfolioDisplay");
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("portfolio-page");
    containerDiv.style.display = "none";

    const lines = text.split("\n");
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("portfolio-content");

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("$thumbnail")) {
        const url = trimmed.replace("$thumbnail", "").trim();
        const thumb = document.createElement("div");
        thumb.classList.add("portfolio-thumbnail");
        thumb.style.backgroundImage = `url('${url}')`;
        containerDiv.appendChild(thumb); // append thumbnail directly
      } else if (trimmed.startsWith("$text")) {
        const p = document.createElement("p");
        p.textContent = trimmed.replace("$text", "").trim();
        p.classList.add("portfolio-text");
        contentWrapper.appendChild(p);
      } else if (trimmed.startsWith("$image")) {
        const img = document.createElement("img");
        img.src = trimmed.replace("$image", "").trim();
        img.alt = "Image";
        img.style.maxWidth = "100%";
        img.classList.add("portfolio-image");
        contentWrapper.appendChild(img);
      } else if (trimmed.startsWith("$divider")) {
        const hr = document.createElement("hr");
        hr.classList.add("portfolio-divider");
        contentWrapper.appendChild(hr);
      } else if (trimmed.startsWith("$embed")) {
        const iframe = document.createElement("iframe");
        iframe.src = trimmed.replace("$embed", "").trim();
        iframe.width = 300;
        iframe.height = 200;
        iframe.allowFullscreen = true;
        iframe.classList.add("portfolio-embed");
        contentWrapper.appendChild(iframe);
      } else if (trimmed.startsWith("$title")) {
        const h2 = document.createElement("h2");
        h2.textContent = trimmed.replace("$title", "").trim();
        h2.classList.add("portfolio-title");
        contentWrapper.appendChild(h2);
      } else if (trimmed !== "") {
        const p = document.createElement("p");
        p.textContent = trimmed;
        p.classList.add("portfolio-paragraph");
        contentWrapper.appendChild(p);
      }
    }

    // Append the non-thumbnail content at the end
    containerDiv.appendChild(contentWrapper);

    // Add fullscreen behavior

    divMap.set(filename, containerDiv);
    document.getElementById("portfolioDisplay").appendChild(containerDiv);
  }

  function showOnlyDiv(filenameToShow) {
    const index = portfolioIndex.findIndex(
      (item) => item.name === filenameToShow
    );
    if (index === -1) return;

    currentIndex = index;

    // 🧹 Hide all divs first
    for (const div of divMap.values()) {
      div.style.display = "none";
      div.style.height = "100vh";
      div.style.width = "100vw";
    }

    // 🔍 Get filenames and divs
    const currentFile = portfolioIndex[index]?.name;
    const total = portfolioIndex.length;
    const title = document.getElementById("selectedTitle");
    const body = document.getElementById("body");

    const prevFile = portfolioIndex[(index - 1 + total) % total]?.name;
    const nextFile = portfolioIndex[(index + 1) % total]?.name;

    const currentDiv = divMap.get(currentFile);
    const prevDiv = divMap.get(prevFile);
    const nextDiv = divMap.get(nextFile);

    // ✅ Apply styles if they exist
    if (currentDiv) {
      title.textContent = currentFile.replace(".md", "").trim();
      currentDiv.style.display = "flex";
      currentDiv.style.width = "90vw";
      currentDiv.style.height = "80vh";
      currentDiv.style.opacity = "1";
      currentDiv.style.zIndex = "25";
      currentDiv.style.background = "rgb(27, 27, 27)";
      currentDiv.style.transitionDelay = "0.1s";

      currentDiv
        .querySelectorAll("*")
        .forEach((el) => (el.style.visibility = "visible"));

      currentDiv.onclick = null;

      currentDiv.onclick = (e) => {
        // ✅ Only trigger fullscreen if a *child element* was clicked
        if (
          e.target === currentDiv ||
          currentDiv.classList.contains("fullscreen")
        )
          return;

        e.stopPropagation();
        currentDiv.classList.add("fullscreen");
        body.style.overflowY = "hidden";
        currentDiv.style.background = "solid black";

        const backButton = document.createElement("button");
        backButton.textContent = "← Back";
        backButton.classList.add("back-button");
        backButton.addEventListener("click", (ev) => {
          ev.stopPropagation();
          currentDiv.scrollTo({ top: 0, behavior: "smooth" });
          currentDiv.classList.remove("fullscreen");
          backButton.remove();
          body.style.overflowY = "auto";
        });

        currentDiv.appendChild(backButton);
      };
    }

    if (prevDiv) {
      prevDiv.style.display = "flex";
      prevDiv.style.width = "50vw";
      prevDiv.style.height = "80vh";
      prevDiv.style.opacity = "0";
      prevDiv.style.zIndex = "24";
      prevDiv.style.background = "transparent";
      // prevDiv.style.transitionDelay = "0.4s";

      prevDiv
        .querySelectorAll("*")
        .forEach((el) => (el.style.visibility = "hidden"));
    }

    if (nextDiv) {
      nextDiv.style.display = "flex";
      nextDiv.style.width = "95vw";
      nextDiv.style.height = "80vh";
      nextDiv.style.opacity = "1";
      nextDiv.style.zIndex = "21";
      // nextDiv.style.transitionDelay = "0.6s";

      // Hide content inside nextDiv
      nextDiv.querySelectorAll("*").forEach((el) => {
        el.style.visibility = "hidden";
      });
    }

    [currentDiv, prevDiv, nextDiv].forEach((div) => {
      if (div) div.classList.remove("outlined");
    });
    if (nextDiv) nextDiv.classList.add("outlined");
  }

  window.showOnlyDiv = showOnlyDiv;
  window.goToNext = goToNext;
  window.goToPrev = goToPrev;

  populatePortfolioOptions(portfolio);
  portfolioIndexer();

  let lastScrollTop = 0;
  let scrollDirection = "down";

  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection = st > lastScrollTop ? "down" : "up";
    lastScrollTop = st <= 0 ? 0 : st; // Avoid negative
  });

  const container = document.getElementById("portfolio-container");
  const trigger = document.getElementById("portfolio-trigger");
  const content = document.getElementById("portfolioDisplay");
  const expand = document.getElementById("expand");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.style.display = "flex";
          if (scrollDirection === "down") {
            container.style.transform = "translateY(100%)"; // Start below view
            requestAnimationFrame(() => {
              container.classList.add("active");
              container.style.transform = "translateY(0%)"; // Slide up
            });
          } else {
            container.style.transform = "translateY(-100%)"; // Start above view
            requestAnimationFrame(() => {
              container.classList.add("active");
              container.style.transform = "translateY(0%)"; // Slide down
            });
          }
          content.style.opacity = "1";
        } else {
          if (scrollDirection === "down") {
            container.style.transform = "translateY(-100%)"; // Slide out upward
          } else {
            container.style.transform = "translateY(100%)"; // Slide out downward
          }
          container.classList.remove("active");
          content.style.opacity = "0";
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "-100px 0px -100px 0px",
    }
  );

  observer.observe(trigger);
});
