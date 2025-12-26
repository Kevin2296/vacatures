// === CONFIG ===
const CONFIG = {
  toName: "Kiki",
  fromName: "Kevin",
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 },
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
  if (rfs) {
    try { rfs.call(el); } catch (e) {}
  }
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
  burstEmojis({ emojiList: ["✨","💛","✨"], count: 18, spread: 140, origin: "center" });
}

function hideAfterPart1Modal() {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "true");
}

function playPart1() {
  clearTimers();
  hideAfterPart1Modal();
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
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  player.classList.remove("show");
  player.setAttribute("aria-hidden", "true");
  stopVideo();

  start.style.display = "grid";

  // reset envelope animation for another run
  env.classList.remove("opening");
}

// === PARTICLE BURSTS ===
function burstEmojis({ emojiList, count = 28, spread = 220, origin = "center" }) {
  const rect = document.body.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let x0 = centerX, y0 = centerY;

  if (origin === "bottom") {
    x0 = centerX;
    y0 = rect.height * 0.78;
  }

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    const emoji = emojiList[i % emojiList.length];
    el.textContent = emoji;

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.6 + 0.4) * spread;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 60); // slightly upward bias

    const rot = (Math.random() * 220 - 110).toFixed(0) + "deg";
    const size = (Math.random() * 10 + 16).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    // random delay gives more "explosion" feel
    const delay = Math.random() * 80;
    el.style.animation = `burst 900ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), 1100 + delay);
  }
}

function loveExplosion() {
  // strong, romantic burst
  burstEmojis({ emojiList: ["💛","💖","💞","✨","💛","💥"], count: 44, spread: 280, origin: "bottom" });
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
  burstEmojis({ emojiList: ["✨","💛","✨"], count: 22, spread: 160, origin: "center" });
  setTimeout(returnToStart, 500);
});

document.getElementById("closeEnd").addEventListener("click", () => {
  // Show love explosion BEFORE returning
  loveExplosion();

  // fade end a touch (visually)
  end.style.transition = "opacity 220ms ease";
  end.style.opacity = "0.2";

  setTimeout(() => {
    end.style.opacity = "";
    end.style.transition = "";
    returnToStart();
  }, 900);
});

document.getElementById("fsBtn").addEventListener("click", requestFs);
