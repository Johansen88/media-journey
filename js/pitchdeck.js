// pitchdeck.js - Pitch Deck Presentation Mode Engine
import { startupData } from './data.js';

export class PitchDeckManager {
  constructor() {
    this.slides = startupData.pitchDeck;
    this.currentIndex = 0;
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.showNotes = false;

    this.dom = {
      modal: document.getElementById("pitchDeckModal"),
      slideContainer: document.getElementById("pitchSlideContent"),
      slideCounter: document.getElementById("slideCounter"),
      progressBar: document.getElementById("slideProgressBar"),
      timerDisplay: document.getElementById("pitchTimerDisplay"),
      notesContainer: document.getElementById("presenterNotesBox"),
      notesContent: document.getElementById("presenterNotesContent"),
      btnToggleNotes: document.getElementById("btnToggleNotes"),
      btnPrev: document.getElementById("btnPrevSlide"),
      btnNext: document.getElementById("btnNextSlide"),
      btnClose: document.getElementById("btnClosePitchDeck"),
      btnFullscreen: document.getElementById("btnFullscreenPitch"),
      btnTimerToggle: document.getElementById("btnTimerToggle"),
      btnTimerReset: document.getElementById("btnTimerReset")
    };

    this.initEvents();
  }

  initEvents() {
    if (this.dom.btnPrev) this.dom.btnPrev.addEventListener("click", () => this.prevSlide());
    if (this.dom.btnNext) this.dom.btnNext.addEventListener("click", () => this.nextSlide());
    if (this.dom.btnClose) this.dom.btnClose.addEventListener("click", () => this.close());
    if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener("click", () => this.toggleFullscreen());
    if (this.dom.btnToggleNotes) this.dom.btnToggleNotes.addEventListener("click", () => this.toggleNotes());

    if (this.dom.btnTimerToggle) {
      this.dom.btnTimerToggle.addEventListener("click", () => this.toggleTimer());
    }
    if (this.dom.btnTimerReset) {
      this.dom.btnTimerReset.addEventListener("click", () => this.resetTimer());
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (!this.isOpen()) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.code === "Space") {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === "Escape") {
        this.close();
      } else if (e.key === "f" || e.key === "F") {
        this.toggleFullscreen();
      } else if (e.key === "n" || e.key === "N") {
        this.toggleNotes();
      }
    });
  }

  isOpen() {
    return this.dom.modal && !this.dom.modal.classList.contains("hidden");
  }

  open(startIndex = 0) {
    if (!this.dom.modal) return;
    this.currentIndex = startIndex;
    this.dom.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    this.renderSlide();
    this.startTimer();
  }

  close() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.add("hidden");
    document.body.style.overflow = "auto";
    this.pauseTimer();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  renderSlide() {
    const slide = this.slides[this.currentIndex];
    if (!slide) return;

    // Update Counter & Progress
    if (this.dom.slideCounter) {
      this.dom.slideCounter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
    if (this.dom.progressBar) {
      const pct = ((this.currentIndex + 1) / this.slides.length) * 100;
      this.dom.progressBar.style.width = `${pct}%`;
    }

    // Render Slide Body
    if (this.dom.slideContainer) {
      this.dom.slideContainer.innerHTML = `
        <div class="pitch-slide-card animate-fade-in">
          <div class="pitch-slide-header">
            <span class="pitch-slide-badge">${slide.badge}</span>
            <h2 class="pitch-slide-title">${slide.title}</h2>
            <p class="pitch-slide-sub">${slide.subtitle}</p>
          </div>
          <div class="pitch-slide-body">
            ${slide.content}
          </div>
        </div>
      `;
    }

    // Update Presenter Notes
    if (this.dom.notesContent) {
      this.dom.notesContent.textContent = slide.notes || "Tidak ada catatan untuk slide ini.";
    }

    // Update Button States
    if (this.dom.btnPrev) {
      this.dom.btnPrev.disabled = this.currentIndex === 0;
      this.dom.btnPrev.style.opacity = this.currentIndex === 0 ? "0.4" : "1";
    }
    if (this.dom.btnNext) {
      this.dom.btnNext.textContent = this.currentIndex === this.slides.length - 1 ? "Selesai Presentasi ✓" : "Selanjutnya ▶";
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.renderSlide();
    } else {
      this.close();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderSlide();
    }
  }

  toggleNotes() {
    this.showNotes = !this.showNotes;
    if (this.dom.notesContainer) {
      this.dom.notesContainer.classList.toggle("hidden", !this.showNotes);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // Timer Methods
  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    if (this.dom.btnTimerToggle) this.dom.btnTimerToggle.textContent = "Pause";

    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.updateTimerDisplay();
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    if (this.dom.btnTimerToggle) this.dom.btnTimerToggle.textContent = "Mulai";
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds = 0;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    if (!this.dom.timerDisplay) return;
    const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, "0");
    const secs = (this.timerSeconds % 60).toString().padStart(2, "0");
    this.dom.timerDisplay.textContent = `${mins}:${secs}`;
  }
}
