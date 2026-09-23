// app.js - Main Application Controller for OMNIPLAY Startup Platform
import { startupData } from './data.js';
import { calculateMetrics, updateCharts, formatUSD, formatIDR } from './calculator.js';
import { PitchDeckManager } from './pitchdeck.js';
import { CyberStrikeGame } from './game.js';

let pitchDeck = null;
let cyberGame = null;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initParticleBackground();
  renderProblemSolutions();
  renderBMC();
  renderProductPillars();
  renderMarketStats();
  renderCompetitorMatrix();
  renderRoadmap();
  renderTeam();
  renderFundingBreakdown();
  initFinancialCalculator();
  initNavigation();
  initModals();
  initGameSection();

  // Pitch Deck Manager
  pitchDeck = new PitchDeckManager();

  // Launch Pitch Deck Buttons
  const btnLaunchPitchDeck = document.getElementById("btnLaunchPitchDeck");
  if (btnLaunchPitchDeck) {
    btnLaunchPitchDeck.addEventListener("click", () => pitchDeck.open(0));
  }
  const btnHeroPitchDeck = document.getElementById("btnHeroPitchDeck");
  if (btnHeroPitchDeck) {
    btnHeroPitchDeck.addEventListener("click", () => pitchDeck.open(0));
  }

  // Print Executive Memo
  const btnPrintReport = document.getElementById("btnPrintReport");
  if (btnPrintReport) {
    btnPrintReport.addEventListener("click", () => window.print());
  }
});

// 1. Cyberpunk Particle Canvas Background
function initParticleBackground() {
  const canvas = document.getElementById("heroParticleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener("resize", () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
  });

  const particles = [];
  const count = Math.min(50, Math.floor(width / 25));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? "rgba(0, 240, 255, 0.4)" : "rgba(138, 43, 226, 0.4)"
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

// 2. Render Problem & Solution Cards
function renderProblemSolutions() {
  const container = document.getElementById("problemSolutionGrid");
  if (!container) return;

  container.innerHTML = startupData.problemSolution.map((item, idx) => `
    <div class="glass-card prob-sol-card animate-on-scroll">
      <div class="card-num-badge">0${idx + 1}</div>
      <h3 class="prob-sol-title">${item.title}</h3>
      <div class="prob-box">
        <span class="box-tag prob-tag">Masalah Industri</span>
        <p>${item.problem}</p>
      </div>
      <div class="sol-box">
        <span class="box-tag sol-tag">Solusi OmniPlay</span>
        <p>${item.solution}</p>
      </div>
    </div>
  `).join("");
}

// 3. Render 9-Blocks Business Model Canvas (BMC)
function renderBMC() {
  const container = document.getElementById("bmcGrid");
  if (!container) return;

  container.innerHTML = startupData.bmc.map((block) => `
    <div class="bmc-block-card glass-card" data-bmc-id="${block.id}" style="--block-color: ${block.color};">
      <div class="bmc-header">
        <div class="bmc-icon" style="color: ${block.color};">✦</div>
        <div>
          <h4 class="bmc-title">${block.title}</h4>
          <span class="bmc-sub">${block.subtitle}</span>
        </div>
      </div>
      <ul class="bmc-list">
        ${block.items.slice(0, 3).map((item) => `
          <li>
            <strong>${item.name}:</strong> ${item.desc}
          </li>
        `).join("")}
      </ul>
      <div class="bmc-kpi-footer">
        <span class="kpi-bullet" style="background: ${block.color};"></span>
        <span class="kpi-text">${block.kpi}</span>
      </div>
      <div class="bmc-click-hint">Klik untuk Rencana Aksi Mendalam ➔</div>
    </div>
  `).join("");

  // Attach Click Listener to BMC cards to show detail modal
  container.querySelectorAll(".bmc-block-card").forEach((card) => {
    card.addEventListener("click", () => {
      const bmcId = card.getAttribute("data-bmc-id");
      openBmcModal(bmcId);
    });
  });
}

function openBmcModal(bmcId) {
  const block = startupData.bmc.find((b) => b.id === bmcId);
  if (!block) return;

  const modal = document.getElementById("bmcModal");
  const modalBody = document.getElementById("bmcModalContent");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="border-left: 4px solid ${block.color}; padding-left: 1.2rem; margin-bottom: 1.5rem;">
      <h2 style="font-size: 1.8rem; color: #fff;">${block.title}</h2>
      <p style="color: var(--neon-cyan); font-size: 1rem;">${block.subtitle}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.8rem; letter-spacing: 0.05em;">Inisiatif Strategis & Operasional Kunci:</h4>
      <div style="display: flex; flex-direction: column; gap: 0.9rem;">
        ${block.items.map((item) => `
          <div style="background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <strong style="color: #00f0ff; display: block; margin-bottom: 0.2rem; font-size: 1rem;">${item.name}</strong>
            <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.5;">${item.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <div style="background: rgba(0, 240, 255, 0.06); border: 1px solid rgba(0, 240, 255, 0.2); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
      <span style="color: #00f0ff; font-weight: 700; font-size: 0.85rem; text-transform: uppercase;">Target Metrik Keberhasilan (KPI):</span>
      <p style="color: #fff; font-size: 1rem; margin-top: 0.3rem;">${block.kpi}</p>
    </div>
  `;

  modal.classList.remove("hidden");
}

// 4. Render 4 Product Pillars with Tab Switcher
function renderProductPillars() {
  const tabNav = document.getElementById("pillarsTabNav");
  const tabDisplay = document.getElementById("pillarDisplay");
  if (!tabNav || !tabDisplay) return;

  tabNav.innerHTML = startupData.products.map((p, idx) => `
    <button class="pillar-tab-btn ${idx === 0 ? "active" : ""}" data-pillar-id="${p.id}">
      <span>✦ ${p.title}</span>
    </button>
  `).join("");

  function displayPillar(pillarId) {
    const p = startupData.products.find((prod) => prod.id === pillarId) || startupData.products[0];
    tabDisplay.innerHTML = `
      <div class="pillar-card glass-card animate-fade-in">
        <div class="pillar-info">
          <span class="pillar-badge">${p.badge}</span>
          <h3 class="pillar-name">${p.title}</h3>
          <p class="pillar-tagline">${p.tagline}</p>
          <ul class="pillar-features">
            ${p.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        </div>
        <div class="pillar-preview-box">
          <div class="preview-header">
            <span class="preview-dot red"></span>
            <span class="preview-dot yellow"></span>
            <span class="preview-dot green"></span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #94a3b8; margin-left: 0.5rem;">omni://${p.id}.core</span>
          </div>
          <div class="preview-content">
            <div class="tech-wireframe">
              <div class="wireframe-stat-row">
                <div class="wire-stat"><span class="label">METRIC 1</span><span class="val text-cyan">${p.previewStats.stat1}</span></div>
                <div class="wire-stat"><span class="label">METRIC 2</span><span class="val text-purple">${p.previewStats.stat2}</span></div>
                <div class="wire-stat"><span class="label">METRIC 3</span><span class="val text-green">${p.previewStats.stat3}</span></div>
              </div>
              <div class="wireframe-graphic">
                <div class="hud-circle"></div>
                <span class="hud-center-text">OMNI ENGINE READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  displayPillar(startupData.products[0].id);

  tabNav.querySelectorAll(".pillar-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabNav.querySelectorAll(".pillar-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      displayPillar(btn.getAttribute("data-pillar-id"));
    });
  });
}

// 5. Render Market Demographics & Stats
function renderMarketStats() {
  const container = document.getElementById("marketDemographics");
  if (!container) return;

  container.innerHTML = startupData.market.demographics.map((demo) => `
    <div class="demographic-card glass-card">
      <div class="demo-cat">${demo.category}</div>
      <div class="demo-val text-cyan">${demo.value}</div>
      <div class="demo-note">${demo.note}</div>
    </div>
  `).join("");
}

// 6. Render Competitor Comparison Matrix
function renderCompetitorMatrix() {
  const tbody = document.getElementById("competitorTableBody");
  if (!tbody) return;

  tbody.innerHTML = startupData.competitors.map((row) => `
    <tr>
      <td class="col-feature">${row.feature}</td>
      <td class="col-omni">${row.omni ? "✓ YES" : "✗"}</td>
      <td>${row.steam ? "✓" : "—"}</td>
      <td>${row.xbox ? "✓" : "—"}</td>
      <td>${row.discord ? "✓" : "—"}</td>
      <td>${row.faceit ? "✓" : "—"}</td>
    </tr>
  `).join("");
}

// 7. Render 4-Phase Roadmap
function renderRoadmap() {
  const container = document.getElementById("roadmapTimeline");
  if (!container) return;

  container.innerHTML = startupData.roadmap.map((item) => `
    <div class="roadmap-item glass-card">
      <div class="roadmap-badge">${item.badge}</div>
      <div class="roadmap-phase">${item.phase}</div>
      <h3 class="roadmap-title">${item.title}</h3>
      <ul class="roadmap-list">
        ${item.items.map((i) => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

// 8. Render Funding Breakdown & Milestones
function renderFundingBreakdown() {
  const cardsContainer = document.getElementById("fundingCards");
  const milestonesContainer = document.getElementById("fundingMilestones");

  if (cardsContainer) {
    cardsContainer.innerHTML = startupData.funding.breakdown.map((item) => `
      <div class="funding-card glass-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
          <h4 style="font-size: 1.1rem; color: #fff;">${item.category}</h4>
          <span style="font-size: 1.3rem; font-weight: 800; color: var(--neon-cyan);">${item.percentage}%</span>
        </div>
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--neon-green); margin-bottom: 0.4rem;">
          ${formatUSD(item.amountUSD)} <span style="font-size: 0.8rem; color: #94a3b8;">(${formatIDR(item.amountUSD)})</span>
        </div>
        <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.4;">${item.desc}</p>
      </div>
    `).join("");
  }

  if (milestonesContainer) {
    milestonesContainer.innerHTML = `
      <ul class="milestones-list">
        ${startupData.funding.milestones.map((m) => `
          <li>
            <span class="milestone-check">✓</span>
            <span>${m}</span>
          </li>
        `).join("")}
      </ul>
    `;
  }
}

// 9. Render Leadership Team
function renderTeam() {
  const container = document.getElementById("teamGrid");
  if (!container) return;

  container.innerHTML = startupData.team.map((member) => `
    <div class="team-card glass-card">
      <div class="team-avatar">${member.avatar}</div>
      <h4 class="team-name">${member.name}</h4>
      <div class="team-role">${member.role}</div>
      <p class="team-desc">${member.background}</p>
      <div class="team-social">
        <span class="social-pill">${member.social}</span>
      </div>
    </div>
  `).join("");
}

// 10. Financial Interactive Calculator
function initFinancialCalculator() {
  const sliderMAU = document.getElementById("sliderMAU");
  const sliderConversion = document.getElementById("sliderConversion");
  const sliderSubPrice = document.getElementById("sliderSubPrice");
  const sliderServerCost = document.getElementById("sliderServerCost");
  const sliderTourneySpend = document.getElementById("sliderTourneySpend");

  const dispMAU = document.getElementById("dispMAU");
  const dispConversion = document.getElementById("dispConversion");
  const dispSubPrice = document.getElementById("dispSubPrice");
  const dispServerCost = document.getElementById("dispServerCost");
  const dispTourneySpend = document.getElementById("dispTourneySpend");

  const kpiPayingSubs = document.getElementById("kpiPayingSubs");
  const kpiARR = document.getElementById("kpiARR");
  const kpiMonthlyGross = document.getElementById("kpiMonthlyGross");
  const kpiNetProfit = document.getElementById("kpiNetProfit");
  const kpiGrossMargin = document.getElementById("kpiGrossMargin");
  const kpiLtvCac = document.getElementById("kpiLtvCac");
  const kpiPayback = document.getElementById("kpiPayback");

  function recalculate() {
    const inputs = {
      mau: parseInt(sliderMAU ? sliderMAU.value : "250000"),
      paidConversion: parseFloat(sliderConversion ? sliderConversion.value : "5.0"),
      subPrice: parseFloat(sliderSubPrice ? sliderSubPrice.value : "4.99"),
      serverCostPerUser: parseFloat(sliderServerCost ? sliderServerCost.value : "0.16"),
      tourneySpendPerUser: parseFloat(sliderTourneySpend ? sliderTourneySpend.value : "0.85")
    };

    // Update Label Badges
    if (dispMAU) dispMAU.textContent = `${inputs.mau.toLocaleString()} MAU`;
    if (dispConversion) dispConversion.textContent = `${inputs.paidConversion.toFixed(1)}%`;
    if (dispSubPrice) dispSubPrice.textContent = `$${inputs.subPrice.toFixed(2)}`;
    if (dispServerCost) dispServerCost.textContent = `$${inputs.serverCostPerUser.toFixed(2)} / bln`;
    if (dispTourneySpend) dispTourneySpend.textContent = `$${inputs.tourneySpendPerUser.toFixed(2)} / bln`;

    const metrics = calculateMetrics(inputs);

    // Update KPI Displays
    if (kpiPayingSubs) kpiPayingSubs.textContent = metrics.payingSubs.toLocaleString();
    if (kpiARR) kpiARR.textContent = formatUSD(metrics.arr);
    if (kpiMonthlyGross) kpiMonthlyGross.textContent = `${formatUSD(metrics.grossRevenueMonthly)}/bln`;

    if (kpiNetProfit) {
      const isPositive = metrics.netProfitMonthly >= 0;
      kpiNetProfit.textContent = `${isPositive ? "+" : ""}${formatUSD(metrics.netProfitMonthly)}/bln`;
      kpiNetProfit.className = isPositive ? "kpi-value text-green" : "kpi-value text-rose";
    }

    if (kpiGrossMargin) kpiGrossMargin.textContent = `${metrics.grossMargin}%`;
    if (kpiLtvCac) kpiLtvCac.textContent = `${metrics.ltvCacRatio}x`;
    if (kpiPayback) kpiPayback.textContent = `${metrics.cacPaybackMonths} Bln`;

    // Update Charts
    updateCharts(metrics);
  }

  const sliders = [sliderMAU, sliderConversion, sliderSubPrice, sliderServerCost, sliderTourneySpend];
  sliders.forEach((slider) => {
    if (slider) {
      slider.addEventListener("input", recalculate);
    }
  });

  // Initial Calculation
  recalculate();
}

// 11. Interactive Game Arena Section
function initGameSection() {
  const canvas = document.getElementById("cyberGameCanvas");
  if (!canvas) return;

  cyberGame = new CyberStrikeGame("cyberGameCanvas");

  // Game UI Buttons
  const btnStartGame = document.getElementById("btnStartGame");
  const btnPauseGame = document.getElementById("btnPauseGame");
  const btnSoundToggle = document.getElementById("btnSoundToggle");
  const btnFullscreenGame = document.getElementById("btnFullscreenGame");
  const btnTriggerEmp = document.getElementById("btnTriggerEmp");

  if (btnStartGame) {
    btnStartGame.addEventListener("click", () => {
      cyberGame.startGame();
    });
  }

  if (btnPauseGame) {
    btnPauseGame.addEventListener("click", () => {
      cyberGame.togglePause();
      btnPauseGame.textContent = cyberGame.state === "PAUSED" ? "▶ Resume" : "⏸ Pause";
    });
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      cyberGame.soundEnabled = !cyberGame.soundEnabled;
      btnSoundToggle.textContent = cyberGame.soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
    });
  }

  if (btnFullscreenGame) {
    btnFullscreenGame.addEventListener("click", () => {
      const wrapper = document.getElementById("gameContainerWrapper");
      if (!document.fullscreenElement) {
        if (wrapper && wrapper.requestFullscreen) {
          wrapper.requestFullscreen();
        } else if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        }
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  if (btnTriggerEmp) {
    btnTriggerEmp.addEventListener("click", () => {
      cyberGame.triggerEmp();
    });
  }

  // Mobile On-Screen Virtual Buttons
  const btnMobileFire = document.getElementById("btnMobileFire");
  const btnMobileEmp = document.getElementById("btnMobileEmp");

  if (btnMobileFire) {
    btnMobileFire.addEventListener("touchstart", (e) => {
      e.preventDefault();
      cyberGame.initAudio();
      cyberGame.firePlayerBullet();
    }, { passive: false });
  }

  if (btnMobileEmp) {
    btnMobileEmp.addEventListener("touchstart", (e) => {
      e.preventDefault();
      cyberGame.triggerEmp();
    }, { passive: false });
  }
}

// 12. Modal & Navigation Handlers
function initModals() {
  const bmcModal = document.getElementById("bmcModal");
  const closeBmcModal = document.getElementById("closeBmcModal");

  if (closeBmcModal && bmcModal) {
    closeBmcModal.addEventListener("click", () => {
      bmcModal.classList.add("hidden");
    });
    bmcModal.addEventListener("click", (e) => {
      if (e.target === bmcModal) bmcModal.classList.add("hidden");
    });
  }
}

function initNavigation() {
  const nav = document.getElementById("topNavbar");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}
