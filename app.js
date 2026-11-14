const STAGES = ["Think", "Build", "Test", "Improve"];

const defaultIdeas = [
  {
    id: "seed-1",
    title: "AI-Powered East African Tick Identification",
    description: "Field vets need rapid identification of tick vectors transmitting East Coast Fever to optimize acaricide application.",
    area: "AI and data",
    author: "Vet Innovation Lab",
    stage: "Think",
    supports: 14
  },
  {
    id: "seed-2",
    title: "IoT Vaccine Cold-Chain Monitor",
    description: "Low-cost temperature logging system using SMS alerts to notify rural clinics when vaccine storage drops below safe thresholds.",
    area: "Diagnostics",
    author: "Lab Prototyping Unit",
    stage: "Build",
    supports: 22
  },
  {
    id: "seed-3",
    title: "Pastoralist SMS Vaccination Reminder Network",
    description: "Automated USSD/SMS alert system for seasonal disease outbreaks targeting nomadic cattle herdsmen in ASAL regions.",
    area: "Public health",
    author: "Epidemiology Team",
    stage: "Test",
    supports: 31
  },
  {
    id: "seed-4",
    title: "Offline Mobile Clinical Case-Notes Template",
    description: "A lightweight, browser-based clinical record system that functions entirely offline for field veterinarians working in remote areas.",
    area: "Clinical practice",
    author: "Digital Health Group",
    stage: "Improve",
    supports: 45
  }
];

let ideas = [];

function loadData() {
  try {
    const stored = localStorage.getItem("vet_innovation_ideas_modular");
    if (stored) {
      ideas = JSON.parse(stored);
    } else {
      ideas = [...defaultIdeas];
      saveData();
    }
  } catch (e) {
    ideas = [...defaultIdeas];
  }
}

function saveData() {
  try {
    localStorage.setItem("vet_innovation_ideas_modular", JSON.stringify(ideas));
  } catch (e) {}
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

function supportIdea(id) {
  const idea = ideas.find(i => i.id === id);
  if (idea) {
    idea.supports += 1;
    saveData();
    renderAll();
  }
}

function moveStage(id, direction) {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return;
  const idx = STAGES.indexOf(idea.stage);
  const nextIdx = idx + direction;
  if (nextIdx >= 0 && nextIdx < STAGES.length) {
    idea.stage = STAGES[nextIdx];
    saveData();
    renderAll();
  }
}

function removeIdea(id) {
  ideas = ideas.filter(i => i.id !== id);
  saveData();
  renderAll();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("ideaTitle").value.trim();
  const area = document.getElementById("ideaArea").value;
  const description = document.getElementById("ideaDesc").value.trim();
  const author = document.getElementById("ideaAuthor").value.trim() || "Anonymous Contributor";

  if (!title || !description) return;

  ideas.unshift({
    id: "idea-" + Date.now(),
    title, area, description, author,
    stage: "Think",
    supports: 1
  });

  saveData();
  renderAll();
  document.getElementById("ideaFormHome").reset();
  window.location.href = "projects.html";
}

function toggleVideoPlay() {
  const video = document.getElementById("heroVideo");
  const btn = document.getElementById("playPauseBtn");
  if (video) {
    if (video.paused) {
      video.play();
      btn.textContent = "Pause";
    } else {
      video.pause();
      btn.textContent = "Play";
    }
  }
}

function toggleTheme() {
  const current = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

function renderCards(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center;"><p style="color: var(--text-muted);">No items found.</p></div>`;
    return;
  }

  container.innerHTML = list.map(idea => {
    const stageIdx = STAGES.indexOf(idea.stage);
    const canPrev = stageIdx > 0;
    const canNext = stageIdx < STAGES.length - 1;

    return `
      <article class="idea-card">
        <div class="card-header">
          <div class="badge-group">
            <span class="badge badge-stage">${escapeHTML(idea.stage)}</span>
            <span class="badge badge-area">${escapeHTML(idea.area)}</span>
          </div>
          <span class="card-author">By ${escapeHTML(idea.author)}</span>
        </div>
        <h3 class="card-title">${escapeHTML(idea.title)}</h3>
        <p class="card-description">${escapeHTML(idea.description)}</p>
        <div class="card-actions">
          <button class="btn btn-support" onclick="supportIdea('${idea.id}')">
            <span>▲ Support</span>
            <span>${idea.supports}</span>
          </button>
          <div class="action-group">
            ${canPrev ? `<button class="btn" onclick="moveStage('${idea.id}', -1)">← ${STAGES[stageIdx - 1]}</button>` : ''}
            ${canNext ? `<button class="btn btn-primary" onclick="moveStage('${idea.id}', 1)">${STAGES[stageIdx + 1]} →</button>` : ''}
            <button class="btn btn-danger" onclick="removeIdea('${idea.id}')">Remove</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderAll() {
  const sorted = [...ideas].sort((a, b) => b.supports - a.supports);
  renderCards("homeIdeasGrid", sorted.slice(0, 3));
  renderCards("projectsGrid", sorted);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.setAttribute("data-theme", "dark");
}

loadData();
renderAll();
// Background Image Slideshow Controller
let slideInterval = null;
let isSlideshowPlaying = true;
let currentSlideIndex = 0;

function startBackgroundSlideshow() {
  const slides = document.querySelectorAll('.bg-slide');
  if (slides.length < 2) return;

  slideInterval = setInterval(() => {
    slides[currentSlideIndex].classList.remove('active', 'kenburns-top-left');
    
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
    // Force reflow so kenburns animation restarts cleanly on the new slide
    void slides[currentSlideIndex].offsetWidth;
    slides[currentSlideIndex].classList.add('active', 'kenburns-top-left');
  }, 5000);
}

// Replace toggleVideoPlay() with toggleBackgroundPlay()
function toggleVideoPlay() {
  const btn = document.getElementById("playPauseBtn");
  const activeSlide = document.querySelector('.bg-slide.active');
  
  if (isSlideshowPlaying) {
    clearInterval(slideInterval);
    if (activeSlide) activeSlide.style.animationPlayState = 'paused';
    if (btn) btn.textContent = "Play";
    isSlideshowPlaying = false;
  } else {
    if (activeSlide) activeSlide.style.animationPlayState = 'running';
    startBackgroundSlideshow();
    if (btn) btn.textContent = "Pause";
    isSlideshowPlaying = true;
  }
}

// Initialize slideshow on page load
startBackgroundSlideshow();