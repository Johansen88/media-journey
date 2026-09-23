// gtagame.js - GTA V: Los Santos Cloud Highway Chase
// 60FPS HTML5 Canvas Driving Action with Web Audio Engine & Cloud Telemetry

export class GtaCloudGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.audioCtx = null;
    this.soundEnabled = true;

    // Game States
    this.state = "START"; // START, PLAYING, CRASHED, PAUSED
    this.speed = 65; // MPH
    this.targetSpeed = 65;
    this.maxSpeed = 140;
    this.nitro = 100;
    this.isNitro = false;
    this.wantedStars = 2;
    this.cash = 0;
    this.distance = 0;
    this.highCash = parseInt(localStorage.getItem("omniplay_gta_highcash") || "45000");

    // Radio Stations
    this.radioStations = [
      { name: "Non-Stop Pop FM", freq: 440, genre: "Pop & Synth" },
      { name: "Los Santos Rock Radio", freq: 330, genre: "Classic Rock" },
      { name: "Radio Los Santos", freq: 220, genre: "West Coast Hip-Hop" }
    ];
    this.currentRadioIndex = 0;
    this.radioNoticeTimer = 0;

    // Canvas Dimensions
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Input States
    this.keys = {};

    // Entities
    this.player = null;
    this.traffic = [];
    this.police = [];
    this.pickups = [];
    this.particles = [];
    this.roadOffset = 0;

    // Cloud Telemetry Stats
    this.ping = 11;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    this.lastTime = performance.now();
    this.initInputs();
    this.resetPlayer();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.width = this.canvas.width = parent.clientWidth || 800;
      this.height = this.canvas.height = Math.min(560, window.innerHeight * 0.75);
    } else {
      this.width = this.canvas.width = 800;
      this.height = this.canvas.height = 560;
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playEngineSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";

      const baseFreq = 50 + (this.speed / this.maxSpeed) * 110;
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 15, this.audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  playNitroSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  playSirenSound() {
    if (!this.soundEnabled || !this.audioCtx || this.police.length === 0) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";

      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.18);
      osc.frequency.linearRampToValueAtTime(600, now + 0.36);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  playRadioChime() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const station = this.radioStations[this.currentRadioIndex];
      const chord = [station.freq, station.freq * 1.25, station.freq * 1.5];
      chord.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.09, this.audioCtx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, this.audioCtx.currentTime + i * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + i * 0.08);
        osc.stop(this.audioCtx.currentTime + i * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  playCrashSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.4;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(500, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.4);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {}
  }

  initInputs() {
    window.addEventListener("keydown", (e) => {
      this.initAudio();
      this.keys[e.key] = true;
      this.keys[e.code] = true;

      if (e.code === "KeyR") {
        this.nextRadio();
      }
      if (e.code === "KeyP") {
        this.togglePause();
      }
      if (e.code === "Space" && this.state !== "PLAYING") {
        this.startGame();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      this.keys[e.code] = false;
    });

    // Touch & Pointer
    let touchStartX = 0;
    this.canvas.addEventListener("touchstart", (e) => {
      this.initAudio();
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
      if (this.state !== "PLAYING") this.startGame();
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0 && this.player && this.state === "PLAYING") {
        const deltaX = e.touches[0].clientX - touchStartX;
        this.player.x += deltaX * 0.25;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });
  }

  nextRadio() {
    this.currentRadioIndex = (this.currentRadioIndex + 1) % this.radioStations.length;
    this.radioNoticeTimer = 2200;
    this.playRadioChime();
  }

  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
    } else if (this.state === "PAUSED") {
      this.state = "PLAYING";
    }
  }

  resetPlayer() {
    const roadCenter = this.width / 2;
    this.player = {
      x: roadCenter,
      y: this.height - 110,
      width: 44,
      height: 78,
      speedX: 0,
      color: "#ff1e56",
      angle: 0
    };
  }

  startGame() {
    this.initAudio();
    this.state = "PLAYING";
    this.speed = 70;
    this.nitro = 100;
    this.cash = 0;
    this.distance = 0;
    this.wantedStars = 2;
    this.traffic = [];
    this.police = [];
    this.pickups = [];
    this.particles = [];
    this.resetPlayer();
    this.playRadioChime();
  }

  spawnTraffic() {
    const roadLeft = this.width / 2 - 160;
    const roadWidth = 320;
    const laneWidth = roadWidth / 4;
    const lane = Math.floor(Math.random() * 4);
    const spawnX = roadLeft + lane * laneWidth + laneWidth / 2;

    const colors = ["#cbd5e1", "#3b82f6", "#10b981", "#f59e0b", "#6366f1"];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    this.traffic.push({
      x: spawnX,
      y: -90,
      width: 42,
      height: 74,
      speedY: Math.random() * 3 + 2,
      color: chosenColor,
      lane: lane
    });
  }

  spawnPolice() {
    const roadLeft = this.width / 2 - 160;
    const roadWidth = 320;
    const lane = Math.floor(Math.random() * 4);
    const spawnX = roadLeft + (lane + 0.5) * (roadWidth / 4);

    this.police.push({
      x: spawnX,
      y: -100,
      width: 44,
      height: 76,
      speedY: 4.5,
      sirenTimer: 0,
      sirenState: false
    });
    this.playSirenSound();
  }

  spawnPickup() {
    const roadLeft = this.width / 2 - 140;
    const spawnX = roadLeft + Math.random() * 280;
    const isNitro = Math.random() > 0.65;

    this.pickups.push({
      x: spawnX,
      y: -50,
      type: isNitro ? "nitro" : "cash",
      value: isNitro ? 50 : 2500,
      radius: 14
    });
  }

  update(dt) {
    if (this.state !== "PLAYING") return;

    // Simulate Cloud Telemetry & FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
      this.ping = Math.floor(10 + Math.random() * 3); // 10-12ms Edge Ping
    }

    // Engine Sound Frequency
    if (Math.random() < 0.12) {
      this.playEngineSound();
    }

    // Radio banner timer
    if (this.radioNoticeTimer > 0) this.radioNoticeTimer -= dt;

    // Nitro handling
    if ((this.keys["ShiftLeft"] || this.keys["ShiftRight"]) && this.nitro > 0) {
      this.isNitro = true;
      this.nitro = Math.max(0, this.nitro - 0.4);
      this.targetSpeed = 175;
      this.playNitroSound();

      // Flame particles
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: this.player.x + (i - 1) * 10,
          y: this.player.y + 38,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 6 + 6,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? "#00f0ff" : "#ffaa00",
          alpha: 1,
          decay: 0.08
        });
      }
    } else {
      this.isNitro = false;
      this.targetSpeed = 100;
      if (this.nitro < 100) this.nitro = Math.min(100, this.nitro + 0.1);
    }

    // Smooth Acceleration / Braking
    if (this.keys["ArrowUp"] || this.keys["KeyW"]) {
      this.targetSpeed = this.isNitro ? 175 : 125;
    } else if (this.keys["ArrowDown"] || this.keys["KeyS"]) {
      this.targetSpeed = 40;
    }

    this.speed += (this.targetSpeed - this.speed) * 0.04;
    this.distance += (this.speed / 3600) * (dt / 1000);

    // Player Horizontal Steering
    let steer = 0;
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) steer -= 1;
    if (this.keys["ArrowRight"] || this.keys["KeyD"]) steer += 1;

    this.player.speedX = steer * 6.5;
    this.player.x += this.player.speedX;
    this.player.angle = steer * 0.08;

    // Clamp inside road boundaries
    const roadLeft = this.width / 2 - 160;
    const roadRight = this.width / 2 + 160;
    this.player.x = Math.max(roadLeft + 25, Math.min(roadRight - 25, this.player.x));

    // Road scroll
    this.roadOffset = (this.roadOffset + this.speed * 0.35) % 80;

    // Spawning Logic
    if (Math.random() < 0.025) this.spawnTraffic();
    if (Math.random() < 0.008 + (this.wantedStars * 0.003)) this.spawnPolice();
    if (Math.random() < 0.015) this.spawnPickup();

    // Update Traffic
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const t = this.traffic[i];
      t.y += (this.speed * 0.22) - t.speedY;

      if (t.y > this.height + 100) {
        this.traffic.splice(i, 1);
        continue;
      }

      // Check collision
      if (this.checkCollision(this.player, t)) {
        this.crashGame();
      }
    }

    // Update Police
    for (let i = this.police.length - 1; i >= 0; i--) {
      const cop = this.police[i];
      cop.y += (this.speed * 0.22) - cop.speedY;

      // Homing toward player lane
      if (cop.x < this.player.x - 5) cop.x += 1.2;
      if (cop.x > this.player.x + 5) cop.x -= 1.2;

      cop.sirenTimer += dt;
      if (cop.sirenTimer > 150) {
        cop.sirenState = !cop.sirenState;
        cop.sirenTimer = 0;
      }

      if (cop.y > this.height + 100) {
        this.police.splice(i, 1);
        continue;
      }

      if (this.checkCollision(this.player, cop)) {
        this.crashGame();
      }
    }

    // Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pu = this.pickups[i];
      pu.y += this.speed * 0.22;

      if (pu.y > this.height + 50) {
        this.pickups.splice(i, 1);
        continue;
      }

      const dist = Math.hypot(pu.x - this.player.x, pu.y - this.player.y);
      if (dist < 32) {
        if (pu.type === "cash") {
          this.cash += pu.value;
        } else if (pu.type === "nitro") {
          this.nitro = Math.min(100, this.nitro + pu.value);
        }
        this.pickups.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  crashGame() {
    this.state = "CRASHED";
    this.playCrashSound();

    if (this.cash > this.highCash) {
      this.highCash = this.cash;
      localStorage.setItem("omniplay_gta_highcash", this.highCash.toString());
    }

    // Crash explosion
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 5 + 2;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() * 5 + 2,
        color: Math.random() > 0.5 ? "#ff1e56" : "#ffaa00",
        alpha: 1,
        decay: 0.03
      });
    }
  }

  checkCollision(c1, c2) {
    return (
      Math.abs(c1.x - c2.x) < (c1.width + c2.width) / 2.3 &&
      Math.abs(c1.y - c2.y) < (c1.height + c2.height) / 2.3
    );
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Los Santos Night Landscape (Ground & Skyline)
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, this.width, this.height);

    // City Skyline Silhouette in distance
    ctx.fillStyle = "#0f172a";
    for (let i = 0; i < 15; i++) {
      const bHeight = 70 + ((i * 37) % 80);
      ctx.fillRect(i * 60, 0, 50, bHeight);
    }

    // 8-Lane Asphalt Highway
    const roadLeft = this.width / 2 - 160;
    const roadWidth = 320;
    const roadRight = roadLeft + roadWidth;

    // Road Base
    ctx.fillStyle = "#1e2433";
    ctx.fillRect(roadLeft, 0, roadWidth, this.height);

    // Road Borders (Yellow lines)
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(roadLeft, 0);
    ctx.lineTo(roadLeft, this.height);
    ctx.moveTo(roadRight, 0);
    ctx.lineTo(roadRight, this.height);
    ctx.stroke();

    // Dashed White Lane Dividers
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([25, 25]);
    ctx.lineDashOffset = -this.roadOffset;

    for (let l = 1; l < 4; l++) {
      const laneX = roadLeft + l * (roadWidth / 4);
      ctx.beginPath();
      ctx.moveTo(laneX, 0);
      ctx.lineTo(laneX, this.height);
      ctx.stroke();
    }
    ctx.setLineDash([]); // reset

    // Draw Pickups (Cash / Nitro)
    this.pickups.forEach((pu) => {
      ctx.save();
      ctx.translate(pu.x, pu.y);
      ctx.shadowBlur = 10;
      if (pu.type === "cash") {
        ctx.shadowColor = "#10b981";
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(0, 0, pu.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("$", 0, 1);
      } else {
        ctx.shadowColor = "#00f0ff";
        ctx.fillStyle = "#00f0ff";
        ctx.beginPath();
        ctx.arc(0, 0, pu.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N2O", 0, 1);
      }
      ctx.restore();
    });

    // Draw Traffic Cars
    this.traffic.forEach((car) => {
      this.drawCar(ctx, car.x, car.y, car.width, car.height, car.color, 0, false);
    });

    // Draw Police Cars
    this.police.forEach((cop) => {
      this.drawCar(ctx, cop.x, cop.y, cop.width, cop.height, "#0f172a", 0, true, cop.sirenState);
    });

    // Draw Player Sports Car
    if (this.player && this.state !== "CRASHED") {
      this.drawPlayerCar(ctx, this.player.x, this.player.y, this.player.angle);
    }

    // Draw Particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw HUD Elements
    this.drawHUD(ctx);

    // Overlays
    if (this.state === "START") {
      this.drawStartOverlay(ctx);
    } else if (this.state === "CRASHED") {
      this.drawCrashedOverlay(ctx);
    } else if (this.state === "PAUSED") {
      this.drawPausedOverlay(ctx);
    }
  }

  drawPlayerCar(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Headlight Beams
    const beamGrad = ctx.createLinearGradient(0, -30, 0, -180);
    beamGrad.addColorStop(0, "rgba(255, 255, 200, 0.4)");
    beamGrad.addColorStop(1, "rgba(255, 255, 200, 0)");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(-16, -30);
    ctx.lineTo(-45, -180);
    ctx.lineTo(45, -180);
    ctx.lineTo(16, -30);
    ctx.closePath();
    ctx.fill();

    // Car Body (Turismo R)
    ctx.shadowColor = "#ff1e56";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ff1e56";

    ctx.beginPath();
    ctx.roundRect(-22, -38, 44, 76, 10);
    ctx.fill();

    // Windshield & Roof (Tinted Black)
    ctx.fillStyle = "#0a0a0f";
    ctx.beginPath();
    ctx.roundRect(-16, -18, 32, 40, 6);
    ctx.fill();

    // Headlights (Xenon White)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-18, -37, 8, 4);
    ctx.fillRect(10, -37, 8, 4);

    // Tail Lights (Glowing Red)
    ctx.fillStyle = "#ff0033";
    ctx.shadowColor = "#ff0033";
    ctx.shadowBlur = 10;
    ctx.fillRect(-18, 34, 10, 4);
    ctx.fillRect(8, 34, 10, 4);

    ctx.restore();
  }

  drawCar(ctx, x, y, w, h, color, angle, isPolice = false, sirenLeft = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // Windshield
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-w / 2 + 5, -h / 2 + 15, w - 10, 20);

    // Headlights
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-w / 2 + 4, -h / 2 + 2, 8, 3);
    ctx.fillRect(w / 2 - 12, -h / 2 + 2, 8, 3);

    // Red/Blue Lightbar for Police
    if (isPolice) {
      ctx.fillStyle = sirenLeft ? "#3b82f6" : "#ef4444";
      ctx.shadowColor = sirenLeft ? "#3b82f6" : "#ef4444";
      ctx.shadowBlur = 14;
      ctx.fillRect(-14, -6, 12, 6);

      ctx.fillStyle = sirenLeft ? "#ef4444" : "#3b82f6";
      ctx.shadowColor = sirenLeft ? "#ef4444" : "#3b82f6";
      ctx.fillRect(2, -6, 12, 6);
    }

    ctx.restore();
  }

  drawHUD(ctx) {
    // 1. Top Right: OmniCloud RTX 4090 Telemetry
    ctx.save();
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(0, 240, 255, 0.95)";
    ctx.fillText(`EDGE NODE: JKT-01 (NVIDIA RTX 4090 vGPU)`, this.width - 15, 20);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`PING: ${this.ping}ms | 60 FPS | 4K WebRTC | GPU TEMP: 62°C`, this.width - 15, 34);

    // Wanted Stars
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#eab308";
    let starsStr = "";
    for (let s = 0; s < 5; s++) {
      starsStr += s < this.wantedStars ? "★ " : "☆ ";
    }
    ctx.fillText(starsStr, this.width - 15, 58);
    ctx.restore();

    // 2. Top Left: Cash & Distance
    ctx.save();
    ctx.font = "bold 18px 'Outfit', sans-serif";
    ctx.fillStyle = "#10b981";
    ctx.textAlign = "left";
    ctx.fillText(`$${this.cash.toLocaleString()}`, 15, 28);

    ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`JARAK: ${this.distance.toFixed(1)} MILES`, 15, 48);
    ctx.restore();

    // 3. Bottom Right: Speedometer & Nitro Bar
    ctx.save();
    ctx.textAlign = "right";
    ctx.font = "900 32px 'Outfit', sans-serif";
    ctx.fillStyle = this.isNitro ? "#00f0ff" : "#ffffff";
    ctx.fillText(`${Math.round(this.speed)}`, this.width - 15, this.height - 35);

    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("MPH", this.width - 15, this.height - 22);

    // Nitro Bar
    const barW = 100;
    const barX = this.width - 15 - barW;
    const barY = this.height - 15;
    ctx.fillStyle = "rgba(10, 15, 26, 0.8)";
    ctx.fillRect(barX, barY, barW, 6);
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(barX, barY, (this.nitro / 100) * barW, 6);
    ctx.restore();

    // 4. Radio Station Banner Notification
    if (this.radioNoticeTimer > 0) {
      ctx.save();
      const station = this.radioStations[this.currentRadioIndex];
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 140, 15, 280, 42, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 12px 'Outfit', sans-serif";
      ctx.fillStyle = "#00f0ff";
      ctx.textAlign = "center";
      ctx.fillText(`📻 ${station.name}`, this.width / 2, 32);
      ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(station.genre, this.width / 2, 47);
      ctx.restore();
    }

    // 5. Bottom Left: Mini-Map GPS Radar
    this.drawMiniMap(ctx);
  }

  drawMiniMap(ctx) {
    const radarX = 50;
    const radarY = this.height - 50;
    const radarR = 36;

    ctx.save();
    ctx.fillStyle = "rgba(10, 15, 26, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Player position
    ctx.fillStyle = "#ff1e56";
    ctx.beginPath();
    ctx.arc(radarX, radarY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Traffic relative dots
    this.traffic.forEach((t) => {
      const relY = (t.y - this.player.y) * 0.15;
      const relX = (t.x - this.player.x) * 0.15;
      if (Math.hypot(relX, relY) < radarR - 4) {
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(radarX + relX, radarY + relY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Police relative dots (Flashing blue)
    this.police.forEach((p) => {
      const relY = (p.y - this.player.y) * 0.15;
      const relX = (p.x - this.player.x) * 0.15;
      if (Math.hypot(relX, relY) < radarR - 4) {
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(radarX + relX, radarY + relY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  drawStartOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(7, 9, 14, 0.85)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = "center";
    ctx.font = "900 36px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffaa00";
    ctx.shadowColor = "#ffaa00";
    ctx.shadowBlur = 15;
    ctx.fillText("GTA V: LOS SANTOS CLOUD CHASE", this.width / 2, this.height / 2 - 50);

    ctx.shadowBlur = 0;
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Cloud Gaming Rig: NVIDIA RTX 4090 Edge Node • Latency 11ms", this.width / 2, this.height / 2 - 15);

    ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Kontrol: A/D atau Panah untuk Belok • W/S untuk Gas & Rem • SHIFT untuk NITRO", this.width / 2, this.height / 2 + 15);
    ctx.fillText("Tekan [R] untuk Ganti Stasiun Radio Los Santos • Hindari Polisi & Kumpulkan Cash!", this.width / 2, this.height / 2 + 35);

    ctx.fillStyle = "#ff1e56";
    ctx.beginPath();
    ctx.roundRect(this.width / 2 - 110, this.height / 2 + 65, 220, 44, 8);
    ctx.fill();

    ctx.font = "bold 15px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("MULAI MENGEMUDI (SPACE)", this.width / 2, this.height / 2 + 92);
    ctx.restore();
  }

  drawCrashedOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(7, 9, 14, 0.88)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = "center";
    ctx.font = "900 38px 'Outfit', sans-serif";
    ctx.fillStyle = "#ff1e56";
    ctx.shadowColor = "#ff1e56";
    ctx.shadowBlur = 15;
    ctx.fillText("WASTED / CRASHED", this.width / 2, this.height / 2 - 45);

    ctx.shadowBlur = 0;
    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`CASH TERKUMPUL: $${this.cash.toLocaleString()}`, this.width / 2, this.height / 2 - 5);

    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#00f0ff";
    ctx.fillText(`RECORD CASH: $${this.highCash.toLocaleString()}`, this.width / 2, this.height / 2 + 20);

    ctx.fillStyle = "#ffaa00";
    ctx.beginPath();
    ctx.roundRect(this.width / 2 - 100, this.height / 2 + 45, 200, 42, 8);
    ctx.fill();

    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.fillStyle = "#07090e";
    ctx.fillText("MAIN LAGI (SPACE)", this.width / 2, this.height / 2 + 71);
    ctx.restore();
  }

  drawPausedOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(7, 9, 14, 0.85)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = "center";
    ctx.font = "bold 28px 'Outfit', sans-serif";
    ctx.fillStyle = "#00f0ff";
    ctx.fillText("GAME DIJEDA (PAUSED)", this.width / 2, this.height / 2);
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Tekan [P] atau Klik Resume untuk melanjutkan streaming.", this.width / 2, this.height / 2 + 35);
    ctx.restore();
  }

  animate(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.animate);
  }
}
