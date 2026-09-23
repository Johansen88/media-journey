// cloudrig.js - OmniCloud Virtual Gaming Rig & Streaming Player Manager
import { startupData } from './data.js';
import { GtaCloudGame } from './gtagame.js';
import { CyberStrikeGame } from './game.js';

export class CloudRigManager {
  constructor() {
    this.activeGameInstance = null;
    this.currentGameId = null;

    this.dom = {
      modal: document.getElementById("cloudRigModal"),
      title: document.getElementById("cloudRigGameTitle"),
      subtitle: document.getElementById("cloudRigSubtitle"),
      gpuNodeBadge: document.getElementById("cloudRigGpuNode"),
      resolutionBadge: document.getElementById("cloudRigResolution"),
      pingBadge: document.getElementById("cloudRigPing"),
      canvasContainer: document.getElementById("cloudRigCanvasContainer"),
      handshakeOverlay: document.getElementById("cloudRigHandshake"),
      handshakeLog: document.getElementById("cloudRigHandshakeLog"),
      btnClose: document.getElementById("btnCloseCloudRig"),
      btnFullscreen: document.getElementById("btnFullscreenCloudRig"),
      selectNode: document.getElementById("selectCloudNode"),
      selectResolution: document.getElementById("selectCloudResolution"),
      // Virtual Gamepad Buttons
      btnPadLeft: document.getElementById("padBtnLeft"),
      btnPadRight: document.getElementById("padBtnRight"),
      btnPadUp: document.getElementById("padBtnUp"),
      btnPadDown: document.getElementById("padBtnDown"),
      btnActionA: document.getElementById("padBtnA"),
      btnActionB: document.getElementById("padBtnB"),
      btnActionX: document.getElementById("padBtnX"),
      btnActionY: document.getElementById("padBtnY")
    };

    this.initEvents();
  }

  initEvents() {
    if (this.dom.btnClose) {
      this.dom.btnClose.addEventListener("click", () => this.close());
    }
    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.addEventListener("click", () => this.toggleFullscreen());
    }

    if (this.dom.selectNode) {
      this.dom.selectNode.addEventListener("change", (e) => {
        if (this.dom.gpuNodeBadge) {
          this.dom.gpuNodeBadge.textContent = e.target.value;
        }
      });
    }

    if (this.dom.selectResolution) {
      this.dom.selectResolution.addEventListener("change", (e) => {
        if (this.dom.resolutionBadge) {
          this.dom.resolutionBadge.textContent = e.target.value;
        }
      });
    }

    // Connect Virtual Gamepad to Active Game Keys
    const bindPad = (elem, keyName, codeName) => {
      if (!elem) return;
      elem.addEventListener("mousedown", (e) => {
        e.preventDefault();
        window.dispatchEvent(new KeyboardEvent("keydown", { key: keyName, code: codeName }));
      });
      elem.addEventListener("mouseup", (e) => {
        e.preventDefault();
        window.dispatchEvent(new KeyboardEvent("keyup", { key: keyName, code: codeName }));
      });
      elem.addEventListener("touchstart", (e) => {
        e.preventDefault();
        window.dispatchEvent(new KeyboardEvent("keydown", { key: keyName, code: codeName }));
      }, { passive: false });
      elem.addEventListener("touchend", (e) => {
        e.preventDefault();
        window.dispatchEvent(new KeyboardEvent("keyup", { key: keyName, code: codeName }));
      }, { passive: false });
    };

    bindPad(this.dom.btnPadLeft, "ArrowLeft", "ArrowLeft");
    bindPad(this.dom.btnPadRight, "ArrowRight", "ArrowRight");
    bindPad(this.dom.btnPadUp, "ArrowUp", "ArrowUp");
    bindPad(this.dom.btnPadDown, "ArrowDown", "ArrowDown");
    bindPad(this.dom.btnActionA, " ", "Space");
    bindPad(this.dom.btnActionB, "Shift", "ShiftLeft");
    bindPad(this.dom.btnActionX, "r", "KeyR");
    bindPad(this.dom.btnActionY, "e", "KeyE");
  }

  launchGame(gameId) {
    const game = startupData.aaaGames.find((g) => g.id === gameId) || startupData.aaaGames[0];
    this.currentGameId = game.id;

    if (!this.dom.modal) return;
    this.dom.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Set Info
    if (this.dom.title) this.dom.title.textContent = game.title;
    if (this.dom.subtitle) this.dom.subtitle.textContent = `${game.edition} • ${game.specs.rigProfile}`;
    if (this.dom.resolutionBadge) this.dom.resolutionBadge.textContent = game.specs.resolution;
    if (this.dom.pingBadge) this.dom.pingBadge.textContent = game.specs.latency;

    // Show Handshake Loading Sequence
    this.runHandshakeSequence(game);
  }

  runHandshakeSequence(game) {
    if (!this.dom.handshakeOverlay || !this.dom.handshakeLog) {
      this.bootGameCanvas(game.id);
      return;
    }

    this.dom.handshakeOverlay.classList.remove("hidden");
    this.dom.handshakeLog.innerHTML = `
      <div class="handshake-step">⚡ Menghubungi Cluster Edge Server Jakarta (JKT-01)...</div>
    `;

    setTimeout(() => {
      this.dom.handshakeLog.innerHTML += `
        <div class="handshake-step">🖥️ Mengalokasikan Node GPU: ${game.specs.rigProfile} (24GB VRAM)...</div>
      `;
    }, 400);

    setTimeout(() => {
      this.dom.handshakeLog.innerHTML += `
        <div class="handshake-step">🔒 Negosiasi Protokol WebRTC P2P (Latensi Terukur: 11ms)...</div>
      `;
    }, 850);

    setTimeout(() => {
      this.dom.handshakeLog.innerHTML += `
        <div class="handshake-step" style="color: var(--neon-green);">✓ Koneksi Streaming Cloud Aktif! Memuat Game Engine...</div>
      `;
    }, 1250);

    setTimeout(() => {
      this.dom.handshakeOverlay.classList.add("hidden");
      this.bootGameCanvas(game.id);
    }, 1600);
  }

  bootGameCanvas(gameId) {
    if (!this.dom.canvasContainer) return;

    // Clear previous canvas
    this.dom.canvasContainer.innerHTML = `
      <canvas id="cloudActiveCanvas" style="width: 100%; height: 520px; display: block; background: #000; border-radius: 8px;"></canvas>
    `;

    if (gameId === "gta5") {
      this.activeGameInstance = new GtaCloudGame("cloudActiveCanvas");
      this.activeGameInstance.startGame();
    } else if (gameId === "cyberstrike") {
      this.activeGameInstance = new CyberStrikeGame("cloudActiveCanvas");
      this.activeGameInstance.startGame();
    } else {
      // Generic AAA Cloud Benchmark & Combat Simulator for other games (Cyberpunk, Elden Ring, Wukong)
      this.activeGameInstance = new GtaCloudGame("cloudActiveCanvas");
      this.activeGameInstance.startGame();
    }
  }

  close() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.add("hidden");
    document.body.style.overflow = "auto";

    if (this.activeGameInstance) {
      if (this.activeGameInstance.audioCtx) {
        try { this.activeGameInstance.audioCtx.close(); } catch (e) {}
      }
      this.activeGameInstance = null;
    }

    if (this.dom.canvasContainer) {
      this.dom.canvasContainer.innerHTML = "";
    }
  }

  toggleFullscreen() {
    const modalContent = document.getElementById("cloudRigContentWrapper");
    if (!document.fullscreenElement) {
      if (modalContent && modalContent.requestFullscreen) {
        modalContent.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }
}
