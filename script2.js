document.addEventListener("DOMContentLoaded", function () {
  const portfolio = ["page1.md", "page2.md", "page3.md", "page4.md"];
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
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("$text")) {
        const p = document.createElement("p");
        p.textContent = trimmed.replace("$text", "").trim();
        containerDiv.appendChild(p);
      } else if (trimmed.startsWith("$image")) {
        const img = document.createElement("img");
        img.src = trimmed.replace("$image", "").trim();
        img.alt = "Image";
        img.style.maxWidth = "100%";
        containerDiv.appendChild(img);
      } else if (trimmed.startsWith("$divider")) {
        const hr = document.createElement("hr");
        containerDiv.appendChild(hr);
      } else if (trimmed.startsWith("$embed")) {
        const iframe = document.createElement("iframe");
        iframe.src = trimmed.replace("$embed", "").trim();
        iframe.width = 300;
        iframe.height = 200;
        iframe.allowFullscreen = true;
        containerDiv.appendChild(iframe);
      } else if (trimmed.startsWith("$title")) {
        const h2 = document.createElement("h2");
        h2.textContent = trimmed.replace("$title", "").trim();
        containerDiv.appendChild(h2);
      } else if (trimmed !== "") {
        const p = document.createElement("p");
        p.textContent = trimmed;
        containerDiv.appendChild(p);
      }
    }

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
    }

    // 🔍 Get filenames and divs
    const currentFile = portfolioIndex[index]?.name;
    const total = portfolioIndex.length;

    const prevFile = portfolioIndex[(index - 1 + total) % total]?.name;
    const nextFile = portfolioIndex[(index + 1) % total]?.name;

    const currentDiv = divMap.get(currentFile);
    const prevDiv = divMap.get(prevFile);
    const nextDiv = divMap.get(nextFile);

    // ✅ Apply styles if they exist
    if (currentDiv) {
      currentDiv.style.display = "flex";
      currentDiv.style.width = "80vw";
      currentDiv.style.height = "80vh";
      currentDiv.style.opacity = "1";
      currentDiv.style.zIndex = "5";

      currentDiv
        .querySelectorAll("*")
        .forEach((el) => (el.style.visibility = "visible"));

      currentDiv.onclick = null;

      currentDiv.onclick = (e) => {
        if (currentDiv.classList.contains("fullscreen")) return;
        e.stopPropagation();
        currentDiv.classList.add("fullscreen");

        const backButton = document.createElement("button");
        backButton.textContent = "← Back";
        backButton.classList.add("back-button");
        backButton.addEventListener("click", (ev) => {
          ev.stopPropagation();
          currentDiv.classList.remove("fullscreen");
          backButton.remove();
        });

        currentDiv.appendChild(backButton);
      };
    }

    if (prevDiv) {
      prevDiv.style.display = "flex";
      prevDiv.style.width = "50vw";
      prevDiv.style.height = "50vh";
      prevDiv.style.opacity = "0";
      prevDiv.style.zIndex = "4";
      prevDiv.style.background = "grey";

      prevDiv
        .querySelectorAll("*")
        .forEach((el) => (el.style.visibility = "hidden"));
    }

    if (nextDiv) {
      nextDiv.style.display = "flex";
      nextDiv.style.width = "90vw";
      nextDiv.style.height = "90vh";
      nextDiv.style.opacity = "1";
      nextDiv.style.zIndex = "1";

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

  const container = document.getElementById("portfolio-container");
  const trigger = document.getElementById("portfolio-trigger");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.add("active"); // slide up
        } else {
          container.classList.remove("active"); // slide down
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.5, // trigger when 50% of #portfolio-trigger is visible
    }
  );

  observer.observe(trigger);
});
