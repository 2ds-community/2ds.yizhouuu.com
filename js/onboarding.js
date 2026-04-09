(function () {
  "use strict";

  const wraps = document.querySelectorAll(".section-wrap");
  const sections = document.querySelectorAll(".section");
  const totalSections = wraps.length;
  const progressBar = document.getElementById("progressBar");
  const stepIndicator = document.getElementById("stepIndicator");
  const container = document.getElementById("container");
  let currentStep = 0;

  // --- Build step indicator dots ---
  wraps.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "step-dot";
    dot.dataset.index = i;
    dot.dataset.label = `${i + 1} / ${totalSections}`;
    dot.addEventListener("click", () => {
      if (i <= currentStep) scrollToSection(i);
    });
    stepIndicator.appendChild(dot);
  });

  // --- Render markdown ---
  function renderMarkdown() {
    document.querySelectorAll("[data-md]").forEach((block) => {
      const raw = block.textContent;
      block.removeAttribute("data-md");
      block.innerHTML = marked.parse(raw);
    });
  }

  // --- Mermaid ---
  async function renderMermaid() {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
      securityLevel: "loose",
    });
    const diagrams = document.querySelectorAll(".language-mermaid");
    for (let i = 0; i < diagrams.length; i++) {
      const pre = diagrams[i].closest("pre");
      if (!pre) continue;
      const code = diagrams[i].textContent;
      const el = document.createElement("div");
      el.className = "mermaid";
      try {
        const { svg } = await mermaid.render("mermaid-" + i, code);
        el.innerHTML = svg;
      } catch {
        el.textContent = code;
      }
      pre.replaceWith(el);
    }
  }

  // --- Centering ---
  function updateCentering() {
    const viewportH = window.innerHeight;
    let totalH = 0;
    wraps.forEach((w) => {
      if (w.classList.contains("open")) totalH += w.offsetHeight;
    });
    const available = viewportH - 80;
    const padTop = totalH > 0 && totalH < available
      ? Math.max(40, (available - totalH) / 2)
      : 40;
    container.style.paddingTop = padTop + "px";
  }

  function updateProgress() {
    progressBar.style.width = ((currentStep + 1) / totalSections) * 100 + "%";
  }

  function updateDots() {
    stepIndicator.querySelectorAll(".step-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentStep);
      dot.classList.toggle("completed", i < currentStep);
    });
  }

  function scrollToSection(index) {
    const section = sections[index];
    if (!section) return;
    const top = window.pageYOffset + section.getBoundingClientRect().top - 60;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function advanceTo(index) {
    if (index >= totalSections) return;

    // Remove highlight from previous section
    sections.forEach((s) => s.classList.remove("highlight"));

    currentStep = index;
    wraps[index].classList.add("open");
    updateProgress();
    updateDots();
    updateCentering();

    // Highlight new section + scroll to it
    sections[index].classList.add("highlight");
    requestAnimationFrame(() => scrollToSection(index));

    // Remove highlight after a few seconds
    setTimeout(() => sections[index].classList.remove("highlight"), 3000);
  }

  // --- Events ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".continue-btn");
    if (!btn) return;
    const next = parseInt(btn.dataset.next, 10);
    if (!isNaN(next)) advanceTo(next);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (currentStep + 1 < totalSections) advanceTo(currentStep + 1);
    }
  });

  window.addEventListener("resize", updateCentering);

  // --- Init ---
  renderMarkdown();
  renderMermaid().then(() => {
    wraps[0].classList.add("open");
    updateProgress();
    updateDots();
    requestAnimationFrame(updateCentering);
  });
})();
