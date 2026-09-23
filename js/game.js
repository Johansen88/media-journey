// game.js - OmniPlay Cloud Arena: Cyber Strike
// High-Octane 60FPS HTML5 Canvas Arcade Game with Web Audio Synthesizer

export class CyberStrikeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    // Audio Context Synthesizer
    this.audioCtx = null;
    this.soundEnabled = true;

    // Game States
    this.state = "START"; // START, PLAYING, GAMEOVER, VICTORY, PAUSED
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("omniplay_highscore") || "12500");
    this.wave = 1;
    this.combo = 1;
    this.comboTimer = 0;

    // Telemetry Simulation (OmniCloud Stats)
    this.ping = 14;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    // Canvas sizing
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Controls
    this.keys = {};
    this.mouse = { x: this.width / 2, y: this.height - 100, isDown: false };
    this.touchActive = false;

    // Entities
    this.player = null;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.stars = [];
    this.floatingTexts = [];
    this.boss = null;

    // Timers
    this.lastShotTime = 0;
    this.fireRate = 180; // ms
    this.waveTimer = 0;
    this.lastTime = performance.now();

    this.initStars();
    this.initInputs();
    this.resetPlayer();

    // Request Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.width = this.canvas.width = parent.clientWidth || 800;
      this.height = this.canvas.height = Math.min(600, window.innerHeight * 0.7);
    } else {
      this.width = this.canvas.width = 800;
      this.height = this.canvas.height = 550;
    }
  }

  // Web Audio Synthesizer (Zero external audio files needed)
  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playLaserSound(pitch = 880) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(pitch, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  playExplosionSound(isBoss = false) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * (isBoss ? 0.6 : 0.25);
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(isBoss ? 450 : 800, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + (isBoss ? 0.6 : 0.25));

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(isBoss ? 0.35 : 0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + (isBoss ? 0.6 : 0.25));

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {}
  }

  playPowerupSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + idx * 0.05 + 0.1);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + idx * 0.05);
        osc.stop(this.audioCtx.currentTime + idx * 0.05 + 0.1);
      });
    } catch (e) {}
  }

  playEmpSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.7);
    } catch (e) {}
  }

  // Parallax Stars
  initStars() {
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.6 ? "#00f0ff" : Math.random() > 0.3 ? "#8a2be2" : "#ffffff"
      });
    }
  }

  initInputs() {
    window.addEventListener("keydown", (e) => {
      this.initAudio();
      this.keys[e.key] = true;
      this.keys[e.code] = true;

      if (e.code === "KeyP") {
        this.togglePause();
      }
      if (e.code === "KeyE") {
        this.triggerEmp();
      }
      if (e.code === "Space" && this.state !== "PLAYING") {
        this.startGame();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      this.keys[e.code] = false;
    });

    // Mouse & Touch
    const updatePointerPos = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((clientX - rect.left) / rect.width) * this.width;
      this.mouse.y = ((clientY - rect.top) / rect.height) * this.height;
    };

    this.canvas.addEventListener("mousemove", (e) => {
      updatePointerPos(e.clientX, e.clientY);
    });

    this.canvas.addEventListener("mousedown", (e) => {
      this.initAudio();
      this.mouse.isDown = true;
      updatePointerPos(e.clientX, e.clientY);
      if (this.state !== "PLAYING") this.startGame();
    });

    window.addEventListener("mouseup", () => {
      this.mouse.isDown = false;
    });

    // Touch Support for Mobile
    this.canvas.addEventListener("touchstart", (e) => {
      this.initAudio();
      e.preventDefault();
      this.touchActive = true;
      this.mouse.isDown = true;
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
      if (this.state !== "PLAYING") this.startGame();
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.isDown = false;
    });
  }

  resetPlayer() {
    this.player = {
      x: this.width / 2,
      y: this.height - 70,
      width: 36,
      height: 42,
      speed: 7,
      hp: 100,
      maxHp: 100,
      empEnergy: 100,
      weaponLevel: 1, // 1 to 4
      weaponTimer: 0,
      shield: false,
      shieldTimer: 0,
      invulnerable: 0
    };
  }

  startGame() {
    this.initAudio();
    this.state = "PLAYING";
    this.score = 0;
    this.wave = 1;
    this.combo = 1;
    this.comboTimer = 0;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];
    this.boss = null;
    this.resetPlayer();
    this.spawnWave(this.wave);
  }

  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
    } else if (this.state === "PAUSED") {
      this.state = "PLAYING";
    }
  }

  triggerEmp() {
    if (this.state !== "PLAYING" || !this.player || this.player.empEnergy < 100) return;
    this.player.empEnergy = 0;
    this.playEmpSound();

    // Shockwave particles
    for (let i = 0; i < 90; i++) {
      const angle = (i / 90) * Math.PI * 2;
      const speed = Math.random() * 8 + 6;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: "#00f0ff",
        alpha: 1,
        decay: 0.02
      });
    }

    // Clear all enemy bullets
    this.enemyBullets = [];

    // Damage all enemies
    this.enemies.forEach((enemy) => {
      enemy.hp -= 80;
      this.createParticles(enemy.x, enemy.y, 8, "#00f0ff");
    });

    if (this.boss) {
      this.boss.hp -= 250;
      this.createParticles(this.boss.x, this.boss.y, 20, "#00f0ff");
    }

    this.addFloatingText("EMP BLAST!", this.player.x, this.player.y - 30, "#00f0ff", 22);
  }

  spawnWave(waveNum) {
    this.wave = waveNum;
    this.enemies = [];
    this.boss = null;

    this.addFloatingText(`WAVE ${waveNum}`, this.width / 2, this.height / 2 - 40, "#00ff9d", 28);

    if (waveNum === 3 || waveNum === 5) {
      // Spawn Boss
      this.boss = {
        x: this.width / 2,
        y: -100,
        targetY: 100,
        width: 90,
        height: 70,
        hp: waveNum === 3 ? 1200 : 2500,
        maxHp: waveNum === 3 ? 1200 : 2500,
        speedX: 2.2,
        attackTimer: 0,
        color: waveNum === 3 ? "#8a2be2" : "#ff007f",
        name: waveNum === 3 ? "CYBER DREADNOUGHT" : "OMNI QUANTUM OVERLORD"
      };
      return;
    }

    // Normal Enemy Formation
    const rows = 2 + Math.min(waveNum, 3);
    const cols = 5 + Math.min(waveNum, 4);
    const spacingX = Math.min(70, (this.width - 100) / cols);
    const startX = (this.width - (cols - 1) * spacingX) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = r === 0 ? "heavy" : r === 1 ? "interceptor" : "drone";
        this.enemies.push({
          x: startX + c * spacingX,
          y: 50 + r * 50 - 250, // drop in from top
          targetY: 60 + r * 50,
          width: type === "heavy" ? 36 : 28,
          height: type === "heavy" ? 32 : 24,
          type: type,
          hp: type === "heavy" ? 40 + waveNum * 8 : type === "interceptor" ? 25 + waveNum * 5 : 15 + waveNum * 3,
          maxHp: type === "heavy" ? 40 + waveNum * 8 : type === "interceptor" ? 25 + waveNum * 5 : 15 + waveNum * 3,
          scoreValue: type === "heavy" ? 300 : type === "interceptor" ? 180 : 100,
          shootCooldown: Math.random() * 200 + 80,
          speedX: (Math.random() - 0.5) * 1.8,
          color: type === "heavy" ? "#ff007f" : type === "interceptor" ? "#8a2be2" : "#00f0ff"
        });
      }
    }
  }

  // Update Game Logic
  update(dt) {
    if (this.state !== "PLAYING") return;

    // Simulate Edge Ping jitter & FPS calculation
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
      this.ping = Math.floor(12 + Math.random() * 4); // 12-16ms edge low latency
    }

    // Player Movement
    let moveX = 0;
    let moveY = 0;
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) moveX -= 1;
    if (this.keys["ArrowRight"] || this.keys["KeyD"]) moveX += 1;
    if (this.keys["ArrowUp"] || this.keys["KeyW"]) moveY -= 1;
    if (this.keys["ArrowDown"] || this.keys["KeyS"]) moveY += 1;

    if (moveX !== 0 || moveY !== 0) {
      this.player.x += moveX * this.player.speed;
      this.player.y += moveY * this.player.speed;
    } else if (this.touchActive || this.mouse.isDown) {
      // Smooth tracking to mouse/touch position
      this.player.x += (this.mouse.x - this.player.x) * 0.15;
      this.player.y += (this.mouse.y - this.player.y) * 0.15;
    }

    // Boundary Clamp
    this.player.x = Math.max(25, Math.min(this.width - 25, this.player.x));
    this.player.y = Math.max(50, Math.min(this.height - 35, this.player.y));

    // Player Shooting (Automatic or Space)
    if (now - this.lastShotTime > this.fireRate) {
      this.firePlayerBullet();
      this.lastShotTime = now;
    }

    // EMP Energy Recharge over time
    if (this.player.empEnergy < 100) {
      this.player.empEnergy = Math.min(100, this.player.empEnergy + 0.15);
    }

    // Player Invulnerability countdown
    if (this.player.invulnerable > 0) this.player.invulnerable -= dt;

    // Powerup Timers
    if (this.player.shieldTimer > 0) {
      this.player.shieldTimer -= dt;
      if (this.player.shieldTimer <= 0) this.player.shield = false;
    }
    if (this.player.weaponTimer > 0) {
      this.player.weaponTimer -= dt;
      if (this.player.weaponTimer <= 0) this.player.weaponLevel = 1;
    }

    // Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 1;
    }

    // Thruster Trail Particles
    if (Math.random() > 0.3) {
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 8,
        y: this.player.y + 18,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.5 ? "#00f0ff" : "#8a2be2",
        alpha: 1,
        decay: 0.05
      });
    }

    // Update Player Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.y < -20 || b.x < -20 || b.x > this.width + 20) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check collision with Boss
      if (this.boss && this.checkCollision(b, this.boss)) {
        this.boss.hp -= b.damage;
        this.createParticles(b.x, b.y, 4, "#00ff9d");
        this.bullets.splice(i, 1);

        if (this.boss.hp <= 0) {
          this.destroyBoss();
        }
        continue;
      }

      // Check collision with Enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (this.checkCollision(b, e)) {
          e.hp -= b.damage;
          this.createParticles(b.x, b.y, 4, "#00f0ff");
          this.bullets.splice(i, 1);

          if (e.hp <= 0) {
            this.destroyEnemy(e, j);
          }
          break;
        }
      }
    }

    // Update Enemies
    let allInPosition = true;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      // Entrance drop animation
      if (e.y < e.targetY) {
        e.y += 4;
        allInPosition = false;
      } else {
        // Horizontal patrol
        e.x += e.speedX;
        if (e.x < 30 || e.x > this.width - 30) {
          e.speedX *= -1;
        }
      }

      // Enemy Shooting
      e.shootCooldown--;
      if (e.shootCooldown <= 0 && Math.random() < 0.35) {
        this.fireEnemyBullet(e);
        e.shootCooldown = Math.random() * 150 + 100;
      }

      // Collision with player
      if (this.checkCollision(e, this.player) && this.player.invulnerable <= 0) {
        this.hitPlayer(25);
        this.destroyEnemy(e, i);
      }
    }

    // Update Boss
    if (this.boss) {
      if (this.boss.y < this.boss.targetY) {
        this.boss.y += 2.5;
      } else {
        this.boss.x += this.boss.speedX;
        if (this.boss.x < 80 || this.boss.x > this.width - 80) {
          this.boss.speedX *= -1;
        }

        // Boss attacks
        this.boss.attackTimer++;
        if (this.boss.attackTimer % 45 === 0) {
          // Circular / Spread bullets
          const spreadCount = 7;
          for (let k = 0; k < spreadCount; k++) {
            const angle = Math.PI / 2 + ((k - (spreadCount - 1) / 2) * 0.25);
            this.enemyBullets.push({
              x: this.boss.x,
              y: this.boss.y + 35,
              vx: Math.cos(angle) * 4.2,
              vy: Math.sin(angle) * 4.2,
              radius: 5,
              color: "#ff007f"
            });
          }
        }
      }
    }

    // Check Next Wave
    if (this.enemies.length === 0 && !this.boss && allInPosition) {
      if (this.wave >= 5) {
        this.state = "VICTORY";
        this.saveHighScore();
      } else {
        this.spawnWave(this.wave + 1);
      }
    }

    // Update Enemy Bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.x += eb.vx;
      eb.y += eb.vy;

      if (eb.y > this.height + 20 || eb.y < -20 || eb.x < -20 || eb.x > this.width + 20) {
        this.enemyBullets.splice(i, 1);
        continue;
      }

      // Check collision with player
      const dist = Math.hypot(eb.x - this.player.x, eb.y - this.player.y);
      if (dist < 18 + (eb.radius || 4)) {
        this.enemyBullets.splice(i, 1);
        this.hitPlayer(15);
      }
    }

    // Update Powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += p.vy;

      if (p.y > this.height + 30) {
        this.powerups.splice(i, 1);
        continue;
      }

      if (this.checkCollision(p, this.player)) {
        this.applyPowerup(p);
        this.powerups.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= pt.decay;
      if (pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Floating Text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= ft.decay;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  firePlayerBullet() {
    this.playLaserSound(750);
    const p = this.player;
    const baseDamage = 18;

    if (p.weaponLevel === 1) {
      this.bullets.push({
        x: p.x,
        y: p.y - 18,
        vx: 0,
        vy: -12,
        width: 4,
        height: 14,
        damage: baseDamage,
        color: "#00f0ff"
      });
    } else if (p.weaponLevel === 2) {
      // Twin Lasers
      [-8, 8].forEach((offset) => {
        this.bullets.push({
          x: p.x + offset,
          y: p.y - 18,
          vx: 0,
          vy: -12,
          width: 4,
          height: 14,
          damage: baseDamage * 1.1,
          color: "#00ff9d"
        });
      });
    } else if (p.weaponLevel >= 3) {
      // Triple Plasma Spread
      [-12, 0, 12].forEach((offset, idx) => {
        const vx = (idx - 1) * 2;
        this.bullets.push({
          x: p.x + offset,
          y: p.y - 18,
          vx: vx,
          vy: -12,
          width: 5,
          height: 16,
          damage: baseDamage * 1.3,
          color: "#8a2be2"
        });
      });
    }
  }

  fireEnemyBullet(enemy) {
    this.enemyBullets.push({
      x: enemy.x,
      y: enemy.y + enemy.height / 2,
      vx: (this.player.x - enemy.x) * 0.012,
      vy: 4.5,
      radius: 4,
      color: "#ff007f"
    });
  }

  hitPlayer(damage) {
    if (this.player.shield) {
      this.player.shield = false;
      this.createParticles(this.player.x, this.player.y, 14, "#00ff9d");
      this.addFloatingText("SHIELD BLOCKED!", this.player.x, this.player.y - 20, "#00ff9d", 16);
      this.player.invulnerable = 600;
      return;
    }

    this.player.hp -= damage;
    this.player.invulnerable = 800;
    this.createParticles(this.player.x, this.player.y, 16, "#ff007f");
    this.playExplosionSound(false);

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.state = "GAMEOVER";
      this.saveHighScore();
      this.playExplosionSound(true);
    }
  }

  destroyEnemy(e, index) {
    this.enemies.splice(index, 1);
    this.playExplosionSound(false);
    this.createParticles(e.x, e.y, 18, e.color);

    // Score & Combo
    this.combo++;
    this.comboTimer = 2200; // 2.2 seconds to maintain combo
    const pts = e.scoreValue * this.combo;
    this.score += pts;
    this.addFloatingText(`+${pts}`, e.x, e.y, "#00f0ff", 14);

    // Chance to drop powerup (18%)
    if (Math.random() < 0.22) {
      const types = ["weapon", "shield", "repair", "emp"];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      this.powerups.push({
        x: e.x,
        y: e.y,
        vy: 1.8,
        width: 22,
        height: 22,
        type: chosenType
      });
    }
  }

  destroyBoss() {
    this.playExplosionSound(true);
    this.createParticles(this.boss.x, this.boss.y, 60, this.boss.color);
    const pts = 5000 * this.combo;
    this.score += pts;
    this.addFloatingText(`BOSS SLAIN! +${pts}`, this.boss.x, this.boss.y, "#00ff9d", 26);
    this.boss = null;
  }

  applyPowerup(p) {
    this.playPowerupSound();
    if (p.type === "weapon") {
      this.player.weaponLevel = Math.min(3, this.player.weaponLevel + 1);
      this.player.weaponTimer = 12000;
      this.addFloatingText("WEAPON OVERCHARGE!", this.player.x, this.player.y - 25, "#8a2be2", 18);
    } else if (p.type === "shield") {
      this.player.shield = true;
      this.player.shieldTimer = 15000;
      this.addFloatingText("QUANTUM SHIELD ON!", this.player.x, this.player.y - 25, "#00ff9d", 18);
    } else if (p.type === "repair") {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
      this.addFloatingText("+35 HULL REPAIR", this.player.x, this.player.y - 25, "#00f0ff", 18);
    } else if (p.type === "emp") {
      this.player.empEnergy = 100;
      this.addFloatingText("EMP READY (PRESS E)!", this.player.x, this.player.y - 25, "#ffaa00", 18);
    }
  }

  createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  addFloatingText(text, x, y, color = "#fff", size = 16) {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      size,
      vy: -1.2,
      alpha: 1,
      decay: 0.025
    });
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x - (rect1.width ? rect1.width / 2 : 10) < rect2.x + (rect2.width ? rect2.width / 2 : 10) &&
      rect1.x + (rect1.width ? rect1.width / 2 : 10) > rect2.x - (rect2.width ? rect2.width / 2 : 10) &&
      rect1.y - (rect1.height ? rect1.height / 2 : 10) < rect2.y + (rect2.height ? rect2.height / 2 : 10) &&
      rect1.y + (rect1.height ? rect1.height / 2 : 10) > rect2.y - (rect2.height ? rect2.height / 2 : 10)
    );
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("omniplay_highscore", this.highScore.toString());
    }
  }

  // Draw Render Loop
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Deep Space Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, "#060810");
    bgGrad.addColorStop(1, "#0a0f1d");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Parallax Stars
    this.stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Powerups
    this.powerups.forEach((pu) => {
      ctx.save();
      ctx.translate(pu.x, pu.y);
      ctx.shadowBlur = 12;

      let color = "#00f0ff";
      let icon = "⚡";
      if (pu.type === "weapon") { color = "#8a2be2"; icon = "⚔️"; }
      if (pu.type === "shield") { color = "#00ff9d"; icon = "🛡️"; }
      if (pu.type === "repair") { color = "#00f0ff"; icon = "❤️"; }
      if (pu.type === "emp") { color = "#ffaa00"; icon = "💥"; }

      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(10, 15, 26, 0.85)";

      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, 0, 0);
      ctx.restore();
    });

    // Draw Player Bullets
    this.bullets.forEach((b) => {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
      ctx.restore();
    });

    // Draw Enemy Bullets
    this.enemyBullets.forEach((eb) => {
      ctx.save();
      ctx.fillStyle = eb.color;
      ctx.shadowColor = eb.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, eb.radius || 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Enemies
    this.enemies.forEach((e) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;

      ctx.fillStyle = e.color;
      ctx.beginPath();
      if (e.type === "heavy") {
        // Hexagonal / Heavy shape
        ctx.moveTo(0, 16);
        ctx.lineTo(18, -4);
        ctx.lineTo(12, -16);
        ctx.lineTo(-12, -16);
        ctx.lineTo(-18, -4);
      } else {
        // Fast triangle drone
        ctx.moveTo(0, 14);
        ctx.lineTo(14, -12);
        ctx.lineTo(0, -6);
        ctx.lineTo(-14, -12);
      }
      ctx.closePath();
      ctx.fill();

      // HP bar for heavy enemies
      if (e.type === "heavy" && e.hp < e.maxHp) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(-15, -22, 30, 3);
        ctx.fillStyle = "#00ff9d";
        ctx.fillRect(-15, -22, (e.hp / e.maxHp) * 30, 3);
      }

      ctx.restore();
    });

    // Draw Boss
    if (this.boss) {
      ctx.save();
      ctx.translate(this.boss.x, this.boss.y);
      ctx.shadowColor = this.boss.color;
      ctx.shadowBlur = 18;

      // Boss Body
      ctx.fillStyle = this.boss.color;
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(45, -10);
      ctx.lineTo(35, -35);
      ctx.lineTo(-35, -35);
      ctx.lineTo(-45, -10);
      ctx.closePath();
      ctx.fill();

      // Core eye
      ctx.fillStyle = "#00f0ff";
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Boss HP Bar at Top
      ctx.save();
      const barW = Math.min(400, this.width - 60);
      const barX = (this.width - barW) / 2;
      ctx.fillStyle = "rgba(10, 15, 26, 0.8)";
      ctx.fillRect(barX, 15, barW, 14);
      ctx.fillStyle = "#ff007f";
      ctx.fillRect(barX, 15, (this.boss.hp / this.boss.maxHp) * barW, 14);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.strokeRect(barX, 15, barW, 14);

      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(`WARNING: ${this.boss.name}`, this.width / 2, 42);
      ctx.restore();
    }

    // Draw Player Ship
    if (this.player && this.state === "PLAYING") {
      ctx.save();
      ctx.translate(this.player.x, this.player.y);

      // Flashing if invulnerable
      if (this.player.invulnerable > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }

      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 12;

      // Vector Ship Shape
      ctx.fillStyle = "#00f0ff";
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(18, 14);
      ctx.lineTo(8, 10);
      ctx.lineTo(0, 15);
      ctx.lineTo(-8, 10);
      ctx.lineTo(-18, 14);
      ctx.closePath();
      ctx.fill();

      // Cockpit Glow
      ctx.fillStyle = "#8a2be2";
      ctx.beginPath();
      ctx.arc(0, -2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Shield Bubble
      if (this.player.shield) {
        ctx.strokeStyle = "rgba(0, 255, 157, 0.8)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#00ff9d";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Draw Floating Texts
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.size}px 'Outfit', sans-serif`;
      ctx.textAlign = "center";
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // Draw HUD & Telemetry
    this.drawHUD(ctx);

    // Draw Screens (Start, GameOver, Victory, Paused)
    if (this.state !== "PLAYING") {
      this.drawOverlays(ctx);
    }
  }

  drawHUD(ctx) {
    // 1. OmniCloud Edge Latency HUD (Top Right)
    ctx.save();
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(0, 240, 255, 0.9)";
    ctx.fillText(`EDGE PING: ${this.ping}ms | FPS: ${this.fps} | 1080p WebRTC`, this.width - 15, 20);
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.fillText(`NODE: JKT-EDGE-01 (OMNICLOUD PROPRIETARY)`, this.width - 15, 34);
    ctx.restore();

    // 2. Score & Wave (Top Left)
    ctx.save();
    ctx.font = "bold 16px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${this.score.toLocaleString()}`, 15, 24);

    if (this.combo > 1) {
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#00ff9d";
      ctx.fillText(`COMBO x${this.combo}!`, 15, 42);
    }

    ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`WAVE: ${this.wave} / 5`, 15, 58);
    ctx.restore();

    // 3. Player Health & EMP Bars (Bottom Left)
    if (this.player && this.state === "PLAYING") {
      ctx.save();
      const barX = 15;
      const barY = this.height - 35;
      const barW = 120;
      const barH = 8;

      // Health
      ctx.fillStyle = "rgba(10, 15, 26, 0.8)";
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = this.player.hp > 30 ? "#00ff9d" : "#ef4444";
      ctx.fillRect(barX, barY, (this.player.hp / this.player.maxHp) * barW, barH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(`HULL: ${Math.round(this.player.hp)}%`, barX, barY - 3);

      // EMP Bar
      const empY = this.height - 15;
      ctx.fillStyle = "rgba(10, 15, 26, 0.8)";
      ctx.fillRect(barX, empY, barW, barH);
      ctx.fillStyle = this.player.empEnergy >= 100 ? "#00f0ff" : "#8a2be2";
      ctx.fillRect(barX, empY, (this.player.empEnergy / 100) * barW, barH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.strokeRect(barX, empY, barW, barH);

      ctx.fillStyle = this.player.empEnergy >= 100 ? "#00f0ff" : "#94a3b8";
      ctx.fillText(this.player.empEnergy >= 100 ? "EMP READY [E]" : "EMP CHARGING...", barX, empY - 3);
      ctx.restore();
    }
  }

  drawOverlays(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(7, 9, 14, 0.85)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = "center";

    if (this.state === "START") {
      ctx.font = "bold 32px 'Outfit', sans-serif";
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 15;
      ctx.fillText("CYBER STRIKE: OMNI ARENA", this.width / 2, this.height / 2 - 60);

      ctx.shadowBlur = 0;
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Demonstrasi Game Interaktif Berbasis OmniCloud Edge Engine", this.width / 2, this.height / 2 - 25);

      ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Kontrol: Tombol WASD / Panah untuk Bergerak • Klik / Spasi untuk Menembak", this.width / 2, this.height / 2 + 15);
      ctx.fillText("Tekan [E] untuk EMP Shockwave • Tekan [P] untuk Pause", this.width / 2, this.height / 2 + 35);

      // Start Button Box
      ctx.fillStyle = "#8a2be2";
      ctx.shadowColor = "#8a2be2";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 110, this.height / 2 + 65, 220, 44, 8);
      ctx.fill();

      ctx.font = "bold 15px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("MULAI MAIN (SPACE)", this.width / 2, this.height / 2 + 92);
    } else if (this.state === "GAMEOVER") {
      ctx.font = "bold 34px 'Outfit', sans-serif";
      ctx.fillStyle = "#ff007f";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 15;
      ctx.fillText("SYSTEM COMPROMISED", this.width / 2, this.height / 2 - 50);

      ctx.shadowBlur = 0;
      ctx.font = "18px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`SKOR AKHIR: ${this.score.toLocaleString()}`, this.width / 2, this.height / 2 - 10);

      ctx.font = "13px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#00f0ff";
      ctx.fillText(`HIGH SCORE: ${this.highScore.toLocaleString()}`, this.width / 2, this.height / 2 + 15);

      // Retry Button Box
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 100, this.height / 2 + 45, 200, 42, 8);
      ctx.fill();

      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillStyle = "#07090e";
      ctx.fillText("MAIN LAGI (SPACE)", this.width / 2, this.height / 2 + 71);
    } else if (this.state === "VICTORY") {
      ctx.font = "bold 34px 'Outfit', sans-serif";
      ctx.fillStyle = "#00ff9d";
      ctx.shadowColor = "#00ff9d";
      ctx.shadowBlur = 15;
      ctx.fillText("OMNIARENA CHAMPION!", this.width / 2, this.height / 2 - 50);

      ctx.shadowBlur = 0;
      ctx.font = "18px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`SELAMAT! SKOR KAMU: ${this.score.toLocaleString()}`, this.width / 2, this.height / 2 - 10);

      ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Skor kamu memenuhi syarat kualifikasi turnamen OmniArena Season 1!", this.width / 2, this.height / 2 + 15);

      ctx.fillStyle = "#8a2be2";
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 100, this.height / 2 + 45, 200, 42, 8);
      ctx.fill();

      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("MAIN ULANG (SPACE)", this.width / 2, this.height / 2 + 71);
    } else if (this.state === "PAUSED") {
      ctx.font = "bold 28px 'Outfit', sans-serif";
      ctx.fillStyle = "#00f0ff";
      ctx.fillText("GAME DIJEDA (PAUSED)", this.width / 2, this.height / 2);
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Tekan [P] atau Klik tombol Resume untuk melanjutkan.", this.width / 2, this.height / 2 + 35);
    }

    ctx.restore();
  }

  // Animation Loop
  animate(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.animate);
  }
}
