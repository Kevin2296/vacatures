// === CONFIG ===
const CONFIG = {
  toName: "Kiki",
  fromName: "Kevin",
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 },

  // Explosion timing
  explosionDurationMs: 2200, // longer so you actually see it
};

// === ELEMENTS ===
const start = document.getElementById("start");
const env = document.getElementById("env");
const loader = document.getElementById("loader");
const player = document.getElementById("player");
const frame = document.getElementById("frame");
const which = document.getElementById("which");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const end = document.getElementById("end");
const finale = document.getElementById("finale");
const particles = document.getElementById("particles");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let timers = [];

function clearTimers() {
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

function setVideo(id) {
  frame.src = `https://streamable.com/e/${id}?autoplay=1&hd=1`;
}

function stopVideo() {
  frame.src = "";
}

function requestFs() {
  const el = player;
  const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (rfs) { try { rfs.call(el); } catch (e) {} }
}

function showPlayer() {
  start.style.display = "none";
  player.classList.add("show");
  player.setAttribute("aria-hidden", "false");
}

function showAfterPart1Modal() {
  overlay.classList.add("show");
  modal.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-hidden", "false");

  // tiny sparkle burst to emphasize "wow"
  burstEmojis({ emojiList: ["✨","💛","✨"], count: 22, spread: 160, origin: "center", durationMs: 1200 });
}

function hideAfterPart1Modal() {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "true");
}

function showFinale() {
  finale.classList.add("show");
  finale.setAttribute("aria-hidden", "false");

  // keep it festive: small continuing sparkles
  burstEmojis({ emojiList: ["✨","💛","✨","🎄"], count: 26, spread: 180, origin: "center", durationMs: 1500 });
  setTimeout(() => burstEmojis({ emojiList: ["💛","✨","💖"], count: 22, spread: 160, origin: "center", durationMs: 1400 }), 700);
}

function hideFinale() {
  finale.classList.remove("show");
  finale.setAttribute("aria-hidden", "true");
}

function playPart1() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();

  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 1";
  setVideo(CONFIG.video1.id);
  showPlayer();

  timers.push(setTimeout(showAfterPart1Modal, CONFIG.video1.lengthSeconds * 1000));
}

function playPart2() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();

  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 2";
  setVideo(CONFIG.video2.id);

  timers.push(setTimeout(() => {
    end.classList.add("show");
    end.setAttribute("aria-hidden", "false");
  }, CONFIG.video2.lengthSeconds * 1000));
}

function returnToStart() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();

  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  player.classList.remove("show");
  player.setAttribute("aria-hidden", "true");
  stopVideo();

  start.style.display = "grid";

  // reset gift animation for another run
  env.classList.remove("opening");
}

// === PARTICLE BURSTS ===
function burstEmojis({ emojiList, count = 30, spread = 240, origin = "center", durationMs = 1600 }) {
  const rect = document.body.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let x0 = centerX, y0 = centerY;
  if (origin === "bottom") { y0 = rect.height * 0.78; }

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = emojiList[i % emojiList.length];

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.6 + 0.4) * spread;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 90); // more upward feel

    const rot = (Math.random() * 240 - 120).toFixed(0) + "deg";
    const size = (Math.random() * 12 + 18).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    const delay = Math.random() * 110;
    el.style.animation = `burst ${durationMs}ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), durationMs + delay + 250);
  }
}

function loveExplosion() {
  // 2 waves = bigger impact
  burstEmojis({ emojiList: ["💛","💖","💞","✨","💛","💥"], count: 60, spread: 320, origin: "bottom", durationMs: 2000 });
  setTimeout(() => burstEmojis({ emojiList: ["💛","✨","💖","💞"], count: 44, spread: 260, origin: "bottom", durationMs: 1800 }), 260);
}

// === EVENTS ===
document.getElementById("openGift").addEventListener("click", async () => {
  env.classList.add("opening");
  loader.classList.add("show");
  loader.setAttribute("aria-hidden", "false");
  await sleep(1050);
  loader.classList.remove("show");
  loader.setAttribute("aria-hidden", "true");

  playPart1();
  requestFs(); // best effort
});

document.getElementById("replay1").addEventListener("click", playPart1);
document.getElementById("play2").addEventListener("click", playPart2);

document.getElementById("again").addEventListener("click", () => {
  burstEmojis({ emojiList: ["✨","💛","✨"], count: 26, spread: 180, origin: "center", durationMs: 1400 });
  setTimeout(returnToStart, 650);
});

document.getElementById("closeEnd").addEventListener("click", () => {
  // Love explosion, then go to finale instead of immediately back to start
  loveExplosion();

  end.style.transition = "opacity 240ms ease";
  end.style.opacity = "0.15";

  setTimeout(() => {
    end.style.opacity = "";
    end.style.transition = "";
    end.classList.remove("show");
    end.setAttribute("aria-hidden", "true");
    showFinale();
  }, 700);
});

document.getElementById("finalRestart").addEventListener("click", () => {
  burstEmojis({ emojiList: ["✨","💛","🎁"], count: 34, spread: 220, origin: "center", durationMs: 1500 });
  setTimeout(returnToStart, 850);
});

document.getElementById("finalClose").addEventListener("click", () => {
  // one last mini burst then back to start
  burstEmojis({ emojiList: ["💛","✨","🎄"], count: 28, spread: 200, origin: "center", durationMs: 1500 });
  setTimeout(returnToStart, 900);
});

document.getElementById("fsBtn").addEventListener("click", requestFs);
